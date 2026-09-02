<?php

use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;

Route::get('health', fn () => response()->json(['status' => 'ok', 'service' => 'customer-service']));

Route::middleware(['jwt', 'throttle:api'])->group(function (): void {
    Route::get('customers', [CustomerController::class, 'index'])->middleware('permission:customers.read');
    Route::post('customers', [CustomerController::class, 'store'])->middleware('permission:customers.create');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->middleware('permission:customers.read');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->middleware('permission:customers.update');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->middleware('permission:customers.delete');
});
