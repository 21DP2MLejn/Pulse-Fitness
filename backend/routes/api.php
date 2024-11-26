<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;

Route::middleware(['auth:api'])->group(function () {
    Route::get('/register', [ApiController::class, 'register']);
    Route::get('/login', [ApiController::class, 'login']);
    Route::get('/logout', [ApiController::class, 'logout']);
});