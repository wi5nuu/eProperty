<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Models\MeterReading;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalHouses = House::count();
        $activeHouses = House::where('status', 'active')->count();

        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $readingsThisMonth = MeterReading::whereBetween('reading_date', [$startOfMonth, $endOfMonth])->count();
        $pendingReadings = MeterReading::where('status', 'pending')->count();

        $totalConsumption = MeterReading::whereBetween('reading_date', [$startOfMonth, $endOfMonth])
            ->sum('consumption');

        $recentReadings = MeterReading::with('house')
            ->orderByDesc('reading_date')
            ->limit(5)
            ->get();

        $blockStats = House::select('block', DB::raw('count(*) as total'))
            ->whereNotNull('block')
            ->groupBy('block')
            ->orderBy('block')
            ->get();

        return response()->json([
            'total_houses' => $totalHouses,
            'active_houses' => $activeHouses,
            'readings_this_month' => $readingsThisMonth,
            'pending_readings' => $pendingReadings,
            'total_consumption' => round($totalConsumption, 2),
            'recent_readings' => $recentReadings,
            'block_stats' => $blockStats,
        ]);
    }
}
