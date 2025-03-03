<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'products';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'description',
        'price',
        'images',
        'category',
        'rating',
        'stock',
        'features',
        'specifications',
    ];

    protected $casts = [
        'images' => 'array',
        'features' => 'array',
        'specifications' => 'array',
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    public function calculateRating()
    {
        $this->rating = $this->reviews()->avg('rating') ?? 0;
        $this->save();
    }
}