<?php

namespace App\Http\Controllers;

use App\Models\MeterReading;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MeterReadingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MeterReading::with('house');

        if ($houseId = $request->input('house_id')) {
            $query->where('house_id', $houseId);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($from = $request->input('from')) {
            $query->where('reading_date', '>=', $from);
        }

        if ($to = $request->input('to')) {
            $query->where('reading_date', '<=', $to);
        }

        $readings = $query->orderByDesc('reading_date')->paginate($request->input('per_page', 20));

        return response()->json($readings);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'house_id'          => 'required|exists:houses,id',
            'reading_date'      => 'required|date',
            'previous_reading'  => 'required|numeric|min:0',
            'current_reading'   => 'required|numeric|min:0|gte:previous_reading',
            'photo_before'      => 'nullable|image|max:5120',
            'photo_after'       => 'nullable|image|max:5120',
            'reader_name'       => 'required|string|max:255',
            'notes'             => 'nullable|string',
        ]);

        $validated['consumption'] = $validated['current_reading'] - $validated['previous_reading'];
        $validated['status'] = 'pending';

        if ($request->hasFile('photo_before')) {
            $validated['photo_before'] = $request->file('photo_before')->store('readings', 'public');
        }
        if ($request->hasFile('photo_after')) {
            $validated['photo_after'] = $request->file('photo_after')->store('readings', 'public');
        }

        $reading = MeterReading::create($validated);

        return response()->json(['data' => $reading], 201);
    }

    public function show(MeterReading $meterReading): JsonResponse
    {
        $meterReading->load('house');

        return response()->json(['data' => $meterReading]);
    }

    public function update(Request $request, MeterReading $meterReading): JsonResponse
    {
        $validated = $request->validate([
            'reading_date'      => 'sometimes|required|date',
            'previous_reading'  => 'sometimes|required|numeric|min:0',
            'current_reading'   => 'sometimes|required|numeric|min:0',
            'notes'             => 'nullable|string',
            'status'            => 'nullable|string|in:pending,confirmed,disputed',
        ]);

        if (isset($validated['previous_reading']) && isset($validated['current_reading'])) {
            $validated['consumption'] = $validated['current_reading'] - $validated['previous_reading'];
        }

        if ($request->hasFile('photo_before')) {
            if ($meterReading->photo_before) {
                Storage::disk('public')->delete($meterReading->photo_before);
            }
            $validated['photo_before'] = $request->file('photo_before')->store('readings', 'public');
        }
        if ($request->hasFile('photo_after')) {
            if ($meterReading->photo_after) {
                Storage::disk('public')->delete($meterReading->photo_after);
            }
            $validated['photo_after'] = $request->file('photo_after')->store('readings', 'public');
        }

        $meterReading->update($validated);

        return response()->json(['data' => $meterReading]);
    }

    public function destroy(MeterReading $meterReading): JsonResponse
    {
        if ($meterReading->photo_before) {
            Storage::disk('public')->delete($meterReading->photo_before);
        }
        if ($meterReading->photo_after) {
            Storage::disk('public')->delete($meterReading->photo_after);
        }

        $meterReading->delete();

        return response()->json(status: 204);
    }

    public function history(Request $request, int $houseId): JsonResponse
    {
        $readings = MeterReading::where('house_id', $houseId)
            ->with('house')
            ->orderByDesc('reading_date')
            ->paginate($request->input('per_page', 12));

        return response()->json($readings);
    }
}
