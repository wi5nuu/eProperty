<?php

use App\Http\Controllers\ContractorController;
use Illuminate\Support\Facades\Route;

Route::get('health', fn () => response()->json(['status' => 'ok', 'service' => 'contractor-service']));

Route::middleware('jwt')->group(function (): void {
    Route::get('contractors', [ContractorController::class, 'index'])->middleware('permission:contractors.read');
    Route::post('contractors', [ContractorController::class, 'store'])->middleware('permission:contractors.create');
    Route::get('contractors/{contractor}', [ContractorController::class, 'show'])->middleware('permission:contractors.read');
    Route::put('contractors/{contractor}', [ContractorController::class, 'update'])->middleware('permission:contractors.update');
    Route::delete('contractors/{contractor}', [ContractorController::class, 'destroy'])->middleware('permission:contractors.delete');
});
