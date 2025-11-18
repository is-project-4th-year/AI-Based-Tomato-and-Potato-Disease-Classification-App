<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\DiseaseController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Predictions
    Route::apiResource('predictions', PredictionController::class);

    // Diseases
    Route::get('/diseases', [DiseaseController::class, 'index']);
    Route::get('/diseases/{disease}', [DiseaseController::class, 'show']);
});
