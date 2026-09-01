<?php

namespace App\Http\Controllers;

use App\Models\Contractor;
use App\Support\DomainEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ContractorController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Contractor::query()->orderBy('contractor_code')->paginate()]);
    }

    public function store(Request $request): JsonResponse
    {
        $contractor = DB::transaction(function () use ($request): Contractor {
            $contractor = Contractor::query()->create($this->validated($request));
            DomainEvent::record('contractor.created', 'contractor', (string) $contractor->id, ['contractor' => $contractor->toArray()]);

            return $contractor;
        });

        return response()->json(['data' => $contractor], 201);
    }

    public function show(Contractor $contractor): JsonResponse
    {
        return response()->json(['data' => $contractor]);
    }

    public function update(Request $request, Contractor $contractor): JsonResponse
    {
        $contractor = DB::transaction(function () use ($request, $contractor): Contractor {
            $contractor->update($this->validated($request, $contractor));
            DomainEvent::record('contractor.updated', 'contractor', (string) $contractor->id, ['contractor' => $contractor->refresh()->toArray()]);

            return $contractor->refresh();
        });

        return response()->json(['data' => $contractor]);
    }

    public function destroy(Contractor $contractor): JsonResponse
    {
        DB::transaction(function () use ($contractor): void {
            $contractor->delete();
            DomainEvent::record('contractor.deleted', 'contractor', (string) $contractor->id, ['id' => $contractor->id]);
        });

        return response()->json(status: 204);
    }

    private function validated(Request $request, ?Contractor $contractor = null): array
    {
        return $request->validate([
            'contractor_code' => ['required', 'string', 'max:50', Rule::unique('contractors', 'contractor_code')->ignore($contractor)],
            'company_name' => ['required', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('contractors', 'email')->ignore($contractor)],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'specialization' => ['nullable', 'string', 'max:120'],
            'status' => ['required', Rule::in(['active', 'suspended', 'blacklisted'])],
        ]);
    }
}
