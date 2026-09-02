<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\MeterReadingController;
use Illuminate\Support\Facades\Route;

Route::get('health', fn () => response()->json(['status' => 'ok', 'service' => 'meter-reading-service']));

Route::middleware(['jwt', 'throttle:api'])->group(function (): void {
    Route::get('dashboard', [DashboardController::class, 'index']);

    Route::get('houses/map', [HouseController::class, 'mapData']);
    Route::apiResource('houses', HouseController::class);

    Route::get('readings', [MeterReadingController::class, 'index']);
    Route::post('readings', [MeterReadingController::class, 'store']);
    Route::get('readings/{meterReading}', [MeterReadingController::class, 'show']);
    Route::put('readings/{meterReading}', [MeterReadingController::class, 'update']);
    Route::delete('readings/{meterReading}', [MeterReadingController::class, 'destroy']);
    Route::get('houses/{houseId}/history', [MeterReadingController::class, 'history']);
});
