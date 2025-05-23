<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'training_session_id',
        'reserved_at',
        'attended',
        'cancelled',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'reserved_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'attended' => 'boolean',
        'cancelled' => 'boolean',
    ];

    /**
     * Get the user that owns the reservation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the training session that owns the reservation.
     */
    public function trainingSession(): BelongsTo
    {
        return $this->belongsTo(TrainingSession::class);
    }

    /**
     * Scope a query to only include active reservations.
     */
    public function scopeActive($query)
    {
        return $query->where('cancelled', false);
    }

    /**
     * Cancel this reservation
     */
    public function cancel($reason = null)
    {
        $this->update([
            'cancelled' => true,
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
    }
}
