<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\TrainingSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationConfirmation;
use App\Mail\ReservationCancellation;

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
        $trainingSession = TrainingSession::findOrFail($trainingSessionId);
        
        // Check if session is already cancelled
        if ($trainingSession->is_cancelled) {
            return response()->json(['message' => 'This training session has been cancelled'], 400);
        }
        
        // Check if session is in the past
        if ($trainingSession->start_time->isPast()) {
            return response()->json(['message' => 'Cannot reserve a session that has already started'], 400);
        }
        
        // Check if user already has a reservation for this session
        if ($trainingSession->hasUserReservation($user->id)) {
            return response()->json(['message' => 'You already have a reservation for this session'], 400);
        }
        
        // Check if session is full
        if ($trainingSession->is_full) {
            return response()->json(['message' => 'This session is full'], 400);
        }
        
        // Create the reservation
        $reservation = new Reservation([
            'user_id' => $user->id,
            'training_session_id' => $trainingSessionId,
            'reserved_at' => now(),
        ]);
        
        $reservation->save();
        
        // Load training session relationship
        $reservation->load('trainingSession');
        
        // Send confirmation email
        try {
            Mail::to($user->email)->send(new ReservationConfirmation($reservation));
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Failed to send reservation confirmation email: ' . $e->getMessage());
        }
        
        return response()->json([
            'message' => 'Reservation created successfully',
            'reservation' => $reservation
        ], 201);
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
     * Cancel a reservation.
     */
    public function cancel(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        $reservation = Reservation::with('trainingSession')
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->where('cancelled', false)
            ->firstOrFail();
        
        // Check if session has already started
        if ($reservation->trainingSession->start_time->isPast()) {
            return response()->json(['message' => 'Cannot cancel a reservation for a session that has already started'], 400);
        }
        
        // Get optional cancellation reason
        $reason = $request->input('reason');
        
        // Cancel the reservation
        $reservation->update([
            'cancelled' => true,
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
        
        // Send cancellation email
        try {
            Mail::to($user->email)->send(new ReservationCancellation($reservation));
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Failed to send reservation cancellation email: ' . $e->getMessage());
        }
        
        return response()->json([
            'message' => 'Reservation cancelled successfully',
            'reservation' => $reservation
        ]);
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
