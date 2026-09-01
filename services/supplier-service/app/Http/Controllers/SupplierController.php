<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Support\DomainEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SupplierController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Supplier::query()->orderBy('supplier_code')->paginate()]);
    }

    public function store(Request $request): JsonResponse
    {
        $supplier = DB::transaction(function () use ($request): Supplier {
            $supplier = Supplier::query()->create($this->validated($request));
            DomainEvent::record('supplier.created', 'supplier', (string) $supplier->id, ['supplier' => $supplier->toArray()]);

            return $supplier;
        });

        return response()->json(['data' => $supplier], 201);
    }

    public function show(Supplier $supplier): JsonResponse
    {
        return response()->json(['data' => $supplier]);
    }

    public function update(Request $request, Supplier $supplier): JsonResponse
    {
        $supplier = DB::transaction(function () use ($request, $supplier): Supplier {
            $supplier->update($this->validated($request, $supplier));
            DomainEvent::record('supplier.updated', 'supplier', (string) $supplier->id, ['supplier' => $supplier->refresh()->toArray()]);

            return $supplier->refresh();
        });

        return response()->json(['data' => $supplier]);
    }

    public function destroy(Supplier $supplier): JsonResponse
    {
        DB::transaction(function () use ($supplier): void {
            $supplier->delete();
            DomainEvent::record('supplier.deleted', 'supplier', (string) $supplier->id, ['id' => $supplier->id]);
        });

        return response()->json(status: 204);
    }

    private function validated(Request $request, ?Supplier $supplier = null): array
    {
        return $request->validate([
            'supplier_code' => ['required', 'string', 'max:50', Rule::unique('suppliers', 'supplier_code')->ignore($supplier)],
            'name' => ['required', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('suppliers', 'email')->ignore($supplier)],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'payment_terms_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'status' => ['required', Rule::in(['active', 'suspended'])],
        ]);
    }
}
