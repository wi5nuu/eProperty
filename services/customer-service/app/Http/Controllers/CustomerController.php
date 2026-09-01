<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Support\DomainEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Customer::query()->orderBy('customer_code')->paginate()]);
    }

    public function store(Request $request): JsonResponse
    {
        $customer = DB::transaction(function () use ($request): Customer {
            $customer = Customer::query()->create($this->validated($request));
            DomainEvent::record('customer.created', 'customer', (string) $customer->id, ['customer' => $customer->toArray()]);

            return $customer;
        });

        return response()->json(['data' => $customer], 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json(['data' => $customer]);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $customer = DB::transaction(function () use ($request, $customer): Customer {
            $customer->update($this->validated($request, $customer));
            DomainEvent::record('customer.updated', 'customer', (string) $customer->id, ['customer' => $customer->refresh()->toArray()]);

            return $customer->refresh();
        });

        return response()->json(['data' => $customer]);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        DB::transaction(function () use ($customer): void {
            $customer->delete();
            DomainEvent::record('customer.deleted', 'customer', (string) $customer->id, ['id' => $customer->id]);
        });

        return response()->json(status: 204);
    }

    private function validated(Request $request, ?Customer $customer = null): array
    {
        return $request->validate([
            'customer_code' => ['required', 'string', 'max:50', Rule::unique('customers', 'customer_code')->ignore($customer)],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['individual', 'company'])],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('customers', 'email')->ignore($customer)],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
    }
}
