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
     * Get the active (non-cancelled) reservations count for this session.
     */
    public function getActiveReservationsCountAttribute(): int
    {
        return $this->reservations()->where('cancelled', false)->count();
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
     * Check if a specific user has a reservation for this session.
     */
    public function hasUserReservation($userId): bool
    {
        return $this->reservations()
            ->where('user_id', $userId)
            ->where('cancelled', false)
            ->exists();
    }

    /**
     * Get the user's reservation for this session, if any.
     */
    public function getUserReservation($userId)
    {
        return $this->reservations()
            ->where('user_id', $userId)
            ->first();
    }
}
