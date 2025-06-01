<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrainingSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
        'capacity',
        'trainer_name',
        'location',
        'difficulty_level',
        'type',
        'is_cancelled',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'capacity' => 'integer',
        'is_cancelled' => 'boolean',
    ];

    /**
     * Get the reservations for the training session.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Get the active (non-cancelled) reservations for this session.
     */
    public function activeReservations()
    {
        return $this->reservations()->where('cancelled', false);
    }

    /**
     * Get the active (non-cancelled) reservations count for this session.
     */
    public function getActiveReservationsCountAttribute(): int
    {
        return $this->activeReservations()->count();
    }

    /**
     * Check if the session has reached its capacity.
     */
    public function getIsFullAttribute(): bool
    {
        return $this->active_reservations_count >= $this->capacity;
    }

    /**
     * Get the remaining spots for this session.
     */
    public function getRemainingSpacesAttribute(): int
    {
        return max(0, $this->capacity - $this->active_reservations_count);
    }
    
    /**
     * Refresh the cached reservation counts for this session.
     */
    public function refreshReservationCounts(): void
    {
        // Clear any cached relationships
        $this->unsetRelation('reservations');
        $this->unsetRelation('activeReservations');
        
        // Clear cached attributes
        unset($this->attributes['active_reservations_count']);
        unset($this->attributes['is_full']);
        unset($this->attributes['remaining_spaces']);
        
        // Log for debugging
        \Log::info("[SESSION REFRESH] Session {$this->id}: Refreshing reservation counts");
        
        // Refresh the model from database
        $this->refresh();
    }

    /**
     * Check if a specific user has an active reservation for this session.
     */
    public function hasUserReservation($userId): bool
    {
        \Log::info("[USER RESERVATION CHECK] Checking user {$userId} for session {$this->id}");
        
        // Force a fresh query to avoid any caching issues
        $hasActiveReservation = $this->reservations()
            ->where('cancelled', false)
            ->where('user_id', $userId)
            ->exists();
        
        \Log::info("[USER RESERVATION CHECK] Result: " . ($hasActiveReservation ? 'Has reservation' : 'No reservation'));
        
        return $hasActiveReservation;
    }

    /**
     * Get the user's active reservation for this session, if any.
     */
    public function getUserReservation($userId)
    {
        \Log::info("[GET USER RESERVATION] Getting reservation for user {$userId} in session {$this->id}");
        
        $reservation = $this->activeReservations()
            ->where('user_id', $userId)
            ->first();
            
        \Log::info("[GET USER RESERVATION] " . ($reservation ? "Found reservation ID: {$reservation->id}" : "No active reservation found"));
        
        return $reservation;
    }

    /**
     * Override toArray to include user-specific reservation data
     */
    public function toArray()
    {
        $array = parent::toArray();
        
        // Add computed attributes
        $array['active_reservations_count'] = $this->active_reservations_count;
        $array['remaining_spaces'] = $this->remaining_spaces;
        $array['is_full'] = $this->is_full;
        
        // Get the current authenticated user
        $user = auth()->user();
        
        if ($user) {
            // Log the check process
            \Log::info("[SESSION TO_ARRAY] Processing session {$this->id} for user {$user->id}");
            
            // Use our existing methods to check for user reservation
            $hasReservation = $this->hasUserReservation($user->id);
            $userReservation = $hasReservation ? $this->getUserReservation($user->id) : null;
            
            // Set consistent properties for frontend
            $array['user_has_reservation'] = $hasReservation;
            $array['user_reservation_id'] = $userReservation ? $userReservation->id : null;
            $array['user_reservation'] = $userReservation ? $userReservation->toArray() : null;
            
            \Log::info("[SESSION TO_ARRAY] Session {$this->id} - Final result: user_has_reservation=" . ($hasReservation ? 'true' : 'false') . ", reservation_id=" . ($userReservation ? $userReservation->id : 'null'));
        } else {
            $array['user_has_reservation'] = false;
            $array['user_reservation_id'] = null;
            $array['user_reservation'] = null;
            \Log::info("[SESSION TO_ARRAY] No authenticated user for session {$this->id}");
        }
        
        return $array;
    }
}