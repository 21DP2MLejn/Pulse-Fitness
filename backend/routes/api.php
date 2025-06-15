<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TrainingSessionController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\OrderController;

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
    
    // Order routes
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    
    // Training sessions routes - MOVED TO PROTECTED SECTION
    Route::get('/training-sessions', [TrainingSessionController::class, 'index']);
    Route::get('/training-sessions/{id}', [TrainingSessionController::class, 'show']);
    
    // User subscription routes - protected by auth
    Route::post('/subscriptions', [SubscriptionController::class, 'subscribe']);
    Route::get('/check-subscription/{id}', [SubscriptionController::class, 'checkSubscription']);
    
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
        
        // Orders management
        Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index']);
        Route::get('/orders/count', [App\Http\Controllers\Admin\OrderController::class, 'count']);
        
        // Subscription management
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

// Public subscription routes - for viewing available subscription plans
Route::get('/subscriptions', [SubscriptionController::class, 'index']);
Route::get('/subscriptions/{subscription}', [SubscriptionController::class, 'show']);

// Protected subscription routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Subscribe to a plan
    Route::post('/subscriptions', [SubscriptionController::class, 'subscribe']);
    
    // Check if user has a specific subscription
    Route::get('/subscriptions/{id}/check', [SubscriptionController::class, 'checkSubscription']);
    
    // Get user's subscriptions
    Route::get('/user/subscriptions', [SubscriptionController::class, 'getUserSubscriptions']);
});

// Protected training sessions and reservations routes
Route::middleware('auth:sanctum')->group(function () {
    // User reservation routes
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::post('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    
    // Debug endpoint to check reservation status
    Route::get('/debug/session/{sessionId}/reservation-status', function($sessionId) {
        $user = auth()->user();
        $session = \App\Models\TrainingSession::find($sessionId);
        
        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }
        
        // Get all reservations for this session
        $allReservations = $session->reservations()->get();
        $activeReservations = $session->activeReservations()->get();
        $userReservations = $session->reservations()->where('user_id', $user->id)->get();
        $userActiveReservations = $session->activeReservations()->where('user_id', $user->id)->get();
        
        return response()->json([
            'session_id' => $sessionId,
            'user_id' => $user->id,
            'all_reservations_count' => $allReservations->count(),
            'active_reservations_count' => $activeReservations->count(),
            'user_all_reservations' => $userReservations,
            'user_active_reservations' => $userActiveReservations,
            'has_user_reservation_method' => $session->hasUserReservation($user->id),
            'session_to_array' => $session->toArray(),
        ]);
    });
    
    // Direct delete endpoint for testing
    Route::delete('/reservations/{id}', function($id) {
        \Log::info('Direct deletion attempt for reservation ID: ' . $id);
        try {
            $reservation = \App\Models\Reservation::find($id);
            if (!$reservation) {
                \Log::error('Reservation not found with ID: ' . $id);
                return response()->json(['message' => 'Reservation not found'], 404);
            }
            
            \Log::info('Found reservation: ' . json_encode($reservation));
            $deleted = $reservation->delete();
            \Log::info('Deletion result: ' . ($deleted ? 'Success' : 'Failed'));
            
            return response()->json([
                'message' => 'Reservation deleted successfully', 
                'success' => true
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting reservation: ' . $e->getMessage());
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    });
    
    // Admin training session management routes
    Route::post('/training-sessions', [TrainingSessionController::class, 'store']);
    Route::put('/training-sessions/{id}', [TrainingSessionController::class, 'update']);
    Route::delete('/training-sessions/{id}', [TrainingSessionController::class, 'destroy']);
    Route::post('/training-sessions/{id}/cancel', [TrainingSessionController::class, 'cancel']);
    Route::get('/training-sessions/{sessionId}/reservations', [ReservationController::class, 'getSessionReservations']);
});

// Guest order lookup by email
Route::post('/orders/email', [OrderController::class, 'getByEmail']);

// Protected order routes - for authenticated users
Route::middleware('auth:sanctum')->group(function () {
    // User order routes
    Route::get('/orders', [OrderController::class, 'index']);
    
    // Admin order routes
    Route::middleware('ability:admin')->group(function () {
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    });
});

// Route to serve product images
Route::get('/images/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);
    if (!file_exists($fullPath)) {
        abort(404);
    }
    return response()->file($fullPath);
})->where('path', '.*');
