<?php

namespace App\Http\Controllers;

use App\Models\TrainingSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TrainingSessionController extends Controller
{
    /**
     * Display a listing of the training sessions.
     */
    public function index(Request $request)
    {
        // Get current week's start and end date by default
        $startDate = $request->input('start_date', now()->startOfWeek()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfWeek()->format('Y-m-d'));
        
        // Force fresh query without any caching
        $trainingSessions = TrainingSession::query()
            ->whereBetween('start_time', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->orderBy('start_time')
            ->get();
        
        // Load reservations relationship after getting sessions to avoid N+1 queries
        $trainingSessions->load(['reservations' => function($query) {
            $query->where('cancelled', false);
        }]);
        
        \Log::info("[SESSIONS INDEX] Retrieved {$trainingSessions->count()} sessions for date range {$startDate} to {$endDate}");
        
        // The toArray method will handle adding user-specific data
        $response = $trainingSessions->toArray();
        
        // Add cache-busting headers
        return response()->json($response)
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }

    /**
     * Display the specified training session.
     */
    public function show(Request $request, $id)
    {
        $trainingSession = TrainingSession::with(['reservations' => function($query) {
            $query->where('cancelled', false);
        }])->findOrFail($id);
        
        return response()->json($trainingSession->toArray())
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    /**
     * Store a newly created training session.
     */
    public function store(Request $request)
    {
        // Check admin permission
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'capacity' => 'required|integer|min:1',
            'trainer_name' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'difficulty_level' => 'nullable|string|in:beginner,intermediate,advanced',
            'type' => 'nullable|string|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $trainingSession = TrainingSession::create($request->all());
        
        return response()->json($trainingSession, 201);
    }

    /**
     * Update the specified training session.
     */
    public function update(Request $request, $id)
    {
        // Check admin permission
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $trainingSession = TrainingSession::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'capacity' => 'sometimes|required|integer|min:1',
            'trainer_name' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'difficulty_level' => 'nullable|string|in:beginner,intermediate,advanced',
            'type' => 'nullable|string|max:255',
            'is_cancelled' => 'sometimes|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $trainingSession->update($request->all());
        
        return response()->json($trainingSession);
    }

    /**
     * Remove the specified training session.
     */
    public function destroy(Request $request, $id)
    {
        // Check admin permission
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $trainingSession = TrainingSession::findOrFail($id);
        
        // Check if the session has active reservations
        if ($trainingSession->active_reservations_count > 0) {
            return response()->json([
                'message' => 'Cannot delete training session with active reservations. Cancel the session instead.'
            ], 400);
        }
        
        $trainingSession->delete();
        
        return response()->json(null, 204);
    }

    /**
     * Cancel a training session and notify users.
     */
    public function cancel(Request $request, $id)
    {
        // Check admin permission
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $trainingSession = TrainingSession::findOrFail($id);
        
        // Mark session as cancelled
        $trainingSession->update(['is_cancelled' => true]);
        
        // Get all active reservations
        $reservations = $trainingSession->activeReservations()->get();
        
        // Cancel all reservations
        foreach ($reservations as $reservation) {
            $reservation->update([
                'cancelled' => true,
                'cancelled_at' => now(),
                'cancellation_reason' => 'Session cancelled by admin'
            ]);
            
            // Notify user via email (this would be handled by a notification class in a real app)
            // Notification::send($reservation->user, new TrainingSessionCancelled($trainingSession));
        }
        
        return response()->json([
            'message' => 'Training session cancelled successfully',
            'cancelled_reservations_count' => $reservations->count()
        ]);
    }
}