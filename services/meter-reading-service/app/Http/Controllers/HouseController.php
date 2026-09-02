<?php

namespace App\Http\Controllers;

use App\Models\House;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = House::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('house_code', 'like', "%" . str_replace(['%', '_'], ['\\%', '\\_'], $search) . "%")
                  ->orWhere('owner_name', 'like', "%" . str_replace(['%', '_'], ['\\%', '\\_'], $search) . "%")
                  ->orWhere('address', 'like', "%" . str_replace(['%', '_'], ['\\%', '\\_'], $search) . "%")
                  ->orWhere('block', 'like', "%" . str_replace(['%', '_'], ['\\%', '\\_'], $search) . "%");
            });
        }

        if ($rt = $request->input('rt')) {
            $query->where('rt', $rt);
        }

        if ($rw = $request->input('rw')) {
            $query->where('rw', $rw);
        }

        if ($block = $request->input('block')) {
            $query->where('block', $block);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $houses = $query->orderBy('house_code')->paginate($request->input('per_page', 20));

        return response()->json($houses);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'house_code'    => 'required|string|max:20|unique:houses',
            'address'       => 'required|string|max:255',
            'rt'            => 'nullable|string|max:10',
            'rw'            => 'nullable|string|max:10',
            'block'         => 'nullable|string|max:10',
            'owner_name'    => 'required|string|max:255',
            'phone'         => 'nullable|string|max:20',
            'meter_number'  => 'nullable|string|max:30',
            'latitude'      => 'nullable|numeric|between:-90,90',
            'longitude'     => 'nullable|numeric|between:-180,180',
            'status'        => 'nullable|string|max:20',
        ]);

        $house = House::create($validated);

        return response()->json(['data' => $house], 201);
    }

    public function show(House $house): JsonResponse
    {
        $house->load('latestReading');

        return response()->json(['data' => $house]);
    }

    public function update(Request $request, House $house): JsonResponse
    {
        $validated = $request->validate([
            'house_code'    => 'sometimes|required|string|max:20|unique:houses,house_code,' . $house->id,
            'address'       => 'sometimes|required|string|max:255',
            'rt'            => 'nullable|string|max:10',
            'rw'            => 'nullable|string|max:10',
            'block'         => 'nullable|string|max:10',
            'owner_name'    => 'sometimes|required|string|max:255',
            'phone'         => 'nullable|string|max:20',
            'meter_number'  => 'nullable|string|max:30',
            'latitude'      => 'nullable|numeric|between:-90,90',
            'longitude'     => 'nullable|numeric|between:-180,180',
            'status'        => 'nullable|string|max:20',
        ]);

        $house->update($validated);

        return response()->json(['data' => $house]);
    }

    public function destroy(House $house): JsonResponse
    {
        $house->delete();

        return response()->json(status: 204);
    }

    public function mapData(): JsonResponse
    {
        $houses = House::where('latitude', '!=', null)
            ->where('longitude', '!=', null)
            ->select('id', 'house_code', 'owner_name', 'address', 'block', 'latitude', 'longitude', 'status')
            ->get();

        return response()->json(['data' => $houses]);
    }
}
