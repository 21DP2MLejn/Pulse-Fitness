<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SubscriptionController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'sendResetPasswordEmail']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

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
    
    // Direct product creation route (bypasses abilities middleware)
    Route::post('/create-product', [AdminProductController::class, 'store']);
    
    // Direct product listing route (bypasses abilities middleware)
    Route::get('/get-products', [AdminProductController::class, 'index']);
    
    // Direct user listing route (bypasses abilities middleware)
    Route::get('/get-users', [UserController::class, 'index']);
    
    Route::get('/get-user-stats', [UserController::class, 'stats']);
    
    // Admin routes - protected by auth:sanctum
    Route::prefix('admin')->group(function () {
        // Product management
        Route::get('/products', [AdminProductController::class, 'index']);
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::get('/products/{product}', [AdminProductController::class, 'show']);
        Route::put('/products/{product}', [AdminProductController::class, 'update']);
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy']);
        Route::get('/subscriptions', [SubscriptionController::class, 'index']);
        Route::post('/subscriptions', [SubscriptionController::class, 'store']);
        Route::get('/subscriptions/{subscription}', [SubscriptionController::class, 'show']);
        Route::put('/subscriptions/{subscription}', [SubscriptionController::class, 'update']);
        Route::delete('/subscriptions/{subscription}', [SubscriptionController::class, 'destroy']);
    });
});

// Public routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Route to serve product images
Route::get('/images/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);
    if (!file_exists($fullPath)) {
        abort(404);
    }
    return response()->file($fullPath);
})->where('path', '.*');
