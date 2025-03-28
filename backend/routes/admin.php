<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ProductController;

// Admin routes - all protected by auth:sanctum middleware and admin ability
Route::middleware(['auth:sanctum', 'abilities:admin'])->group(function () {
    // Product management
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
});
