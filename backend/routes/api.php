<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'userProfile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Profile routes
    Route::get('/profile', [AuthController::class, 'userProfile']);
    Route::put('/profile', [AuthController::class, 'editProfile']);
    Route::delete('/profile', [AuthController::class, 'deleteProfile']);

    // Cart routes
    Route::get('/cart', [CartController::class, 'getCart']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::put('/cart/{id}', [CartController::class, 'updateCartItem']);
    Route::delete('/cart/{id}', [CartController::class, 'removeFromCart']);
});

// Public routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::get('/image/{filename}', function ($filename) {
    $path = storage_path('app/public/images/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});
