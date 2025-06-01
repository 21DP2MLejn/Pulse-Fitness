<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\TrainingSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationConfirmation;
use App\Mail\ReservationCancellation;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    /**
     * Display a listing of the user's reservations.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        $reservations = $user->reservations()
            ->with('trainingSession')
            ->when($request->input('status') === 'active', function ($query) {
                return $query->where('cancelled', false);
            })
            ->when($request->input('status') === 'cancelled', function ($query) {
                return $query->where('cancelled', true);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($reservations);
    }

    /**
     * Store a newly created reservation.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        // Check if user has an active subscription
        if (!$user->hasActiveSubscription()) {
            return response()->json([
                'message' => 'You need an active subscription to make reservations',
                'subscription_required' => true
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'training_session_id' => 'required|exists:training_sessions,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $trainingSessionId = $request->input('training_session_id');
        
        // Use database transaction to ensure consistency
        return DB::transaction(function () use ($user, $trainingSessionId) {
            $trainingSession = TrainingSession::lockForUpdate()->findOrFail($trainingSessionId);
            
            \Log::info("[RESERVATION CREATE] User {$user->id} attempting to reserve session {$trainingSessionId}");
            
            // Check if session is already cancelled
            if ($trainingSession->is_cancelled) {
                return response()->json(['message' => 'This training session has been cancelled'], 400);
            }
            
            // Check if session is in the past
            if ($trainingSession->start_time->isPast()) {
                return response()->json(['message' => 'Cannot reserve a session that has already started'], 400);
            }
            
            // Check if user already has an active reservation for this session
            if ($trainingSession->hasUserReservation($user->id)) {
                \Log::info("[RESERVATION CREATE] User {$user->id} already has reservation for session {$trainingSessionId}");
                
                // Debug: Check all reservations for this user and session
                $allUserReservations = \App\Models\Reservation::where('user_id', $user->id)
                    ->where('training_session_id', $trainingSessionId)
                    ->get();
                
                \Log::info("[RESERVATION CREATE DEBUG] All reservations for user {$user->id} in session {$trainingSessionId}:", 
                    $allUserReservations->map(function($r) {
                        return [
                            'id' => $r->id,
                            'cancelled' => $r->cancelled,
                            'cancelled_at' => $r->cancelled_at,
                            'created_at' => $r->created_at
                        ];
                    })->toArray()
                );
                
                return response()->json(['message' => 'You already have a reservation for this session'], 400);
            }
            
            // Check if session is full (get fresh count)
            $activeReservationsCount = $trainingSession->activeReservations()->count();
            if ($activeReservationsCount >= $trainingSession->capacity) {
                \Log::info("[RESERVATION CREATE] Session {$trainingSessionId} is full. Active: {$activeReservationsCount}, Capacity: {$trainingSession->capacity}");
                return response()->json(['message' => 'This session is full'], 400);
            }
            
            // Create the reservation
            $reservation = new Reservation([
                'user_id' => $user->id,
                'training_session_id' => $trainingSessionId,
                'reserved_at' => now(),
                'cancelled' => false,
            ]);
            
            try {
                $reservation->save();
                \Log::info("[RESERVATION CREATE] Created reservation ID {$reservation->id} for user {$user->id} and session {$trainingSessionId}");
            } catch (\Illuminate\Database\QueryException $e) {
                // Check if it's a unique constraint violation
                if ($e->getCode() == 23000) {
                    \Log::info("[RESERVATION CREATE] Unique constraint hit - checking for cancelled reservation");
                    
                    // Find the existing cancelled reservation
                    $existingReservation = Reservation::where('user_id', $user->id)
                        ->where('training_session_id', $trainingSessionId)
                        ->where('cancelled', true)
                        ->first();
                    
                    if ($existingReservation) {
                        \Log::info("[RESERVATION CREATE] Found cancelled reservation ID {$existingReservation->id} - reactivating it");
                        
                        // Reactivate the cancelled reservation
                        $existingReservation->update([
                            'cancelled' => false,
                            'cancelled_at' => null,
                            'cancellation_reason' => null,
                            'reserved_at' => now(),
                        ]);
                        
                        $reservation = $existingReservation;
                        \Log::info("[RESERVATION CREATE] Reactivated reservation ID {$reservation->id}");
                    } else {
                        // Some other unique constraint issue
                        throw $e;
                    }
                } else {
                    // Some other database error
                    throw $e;
                }
            }
            
            // Load training session relationship
            $reservation->load('trainingSession');
            
            // Refresh the training session to clear cached counts
            $trainingSession->refreshReservationCounts();
            
            // Send confirmation email
            try {
                Mail::to($user->email)->send(new ReservationConfirmation($reservation));
            } catch (\Exception $e) {
                \Log::error('Failed to send reservation confirmation email: ' . $e->getMessage());
            }
            
            return response()->json([
                'message' => 'Reservation created successfully',
                'reservation' => $reservation,
                'id' => $reservation->id
            ], 201);
        });
    }

    /**
     * Display the specified reservation.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        $reservation = Reservation::with('trainingSession')
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
        
        return response()->json($reservation);
    }

    /**
     * Cancel a reservation by marking it as cancelled.
     */
    public function cancel(Request $request, $id)
    {
        \Log::info("[CANCELLATION] Starting cancellation process for reservation ID: {$id}");
        
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        // Use database transaction to ensure consistency
        return DB::transaction(function () use ($user, $id, $request) {
            // Find the reservation with lock to prevent race conditions
            $reservation = Reservation::with('trainingSession')
                ->lockForUpdate()
                ->find($id);
                
            if (!$reservation) {
                \Log::info("[CANCELLATION] Reservation {$id} not found");
                return response()->json(['message' => 'Reservation not found'], 404);
            }
            
            // Check if the reservation belongs to the user
            if ($reservation->user_id !== $user->id) {
                \Log::info("[CANCELLATION] Reservation {$id} does not belong to user {$user->id}");
                return response()->json(['message' => 'This reservation does not belong to you'], 403);
            }
            
            // Check if already cancelled
            if ($reservation->cancelled) {
                \Log::info("[CANCELLATION] Reservation {$id} is already cancelled");
                return response()->json(['message' => 'This reservation is already cancelled'], 400);
            }
            
            // Check if session has already started
            if ($reservation->trainingSession && $reservation->trainingSession->start_time->isPast()) {
                \Log::info("[CANCELLATION] Cannot cancel reservation {$id} - session has already started");
                return response()->json(['message' => 'Cannot cancel a reservation for a session that has already started'], 400);
            }
            
            $reason = $request->input('reason', 'Cancelled by user');
            
            \Log::info("[CANCELLATION] Marking reservation {$id} as cancelled with reason: {$reason}");
            
            // Mark the reservation as cancelled
            $reservation->update([
                'cancelled' => true,
                'cancelled_at' => now(),
                'cancellation_reason' => $reason
            ]);
            
            // Refresh the training session counts
            $trainingSession = $reservation->trainingSession;
            if ($trainingSession) {
                $trainingSession->refreshReservationCounts();
                
                // Get fresh data
                $trainingSession->refresh();
                
                \Log::info("[CANCELLATION] Session {$trainingSession->id} now has {$trainingSession->remaining_spaces} remaining spaces");
            }
            
            // Try to send cancellation email
            try {
                if ($user->email) {
                    Mail::to($user->email)->send(new ReservationCancellation($reservation));
                }
            } catch (\Exception $e) {
                \Log::error('Failed to send cancellation email: ' . $e->getMessage());
            }
            
            \Log::info("[CANCELLATION] Successfully cancelled reservation {$id}");
            
            // Ensure the training session has fresh data
            if ($trainingSession) {
                // Clear all cached relationships and attributes
                $trainingSession->setRelations([]);
                $trainingSession->refresh();
            }
            
            // Return detailed information for the frontend
            // Use toArray() to get the properly computed user reservation status
            $sessionArray = $trainingSession ? $trainingSession->toArray() : null;
            
            return response()->json([
                'message' => 'Reservation cancelled successfully',
                'reservation' => $reservation->fresh(),
                'training_session' => $sessionArray,
                'success' => true
            ])
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
        });
    }

    /**
     * Get all reservations for a specific training session (admin only).
     */
    public function getSessionReservations(Request $request, $sessionId)
    {
        // Check admin permission
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $trainingSession = TrainingSession::findOrFail($sessionId);
        
        $reservations = $trainingSession->reservations()
            ->with('user:id,name,lastname,email')
            ->get();
        
        return response()->json([
            'session' => $trainingSession,
            'reservations' => $reservations,
            'active_count' => $trainingSession->active_reservations_count,
            'remaining_spaces' => $trainingSession->remaining_spaces
        ]);
    }
}