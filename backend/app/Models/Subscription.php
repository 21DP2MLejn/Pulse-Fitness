<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'price',
        'features',
        'specifications',
        'subscription_name',
        'subscription_id',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'features' => 'array',
        'specifications' => 'array',
        'price' => 'float',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}