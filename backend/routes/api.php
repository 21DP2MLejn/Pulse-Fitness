<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;

Route::post('/register', [ApiController::class, 'register']);
Route::post('/login', [ApiController::class, 'login']);
Route::get('/logout', [ApiController::class, 'logout']);
Route::get('/verify-email', [ApiController::class, 'verifyEmail']);

    
