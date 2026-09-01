<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Support\DomainEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Employee::query()->orderBy('employee_number')->paginate()]);
    }

    public function store(Request $request): JsonResponse
    {
        $employee = DB::transaction(function () use ($request): Employee {
            $employee = Employee::query()->create($this->validated($request));
            DomainEvent::record('employee.created', 'employee', (string) $employee->id, ['employee' => $employee->toArray()]);

            return $employee;
        });

        return response()->json(['data' => $employee], 201);
    }

    public function show(Employee $employee): JsonResponse
    {
        return response()->json(['data' => $employee]);
    }

    public function update(Request $request, Employee $employee): JsonResponse
    {
        $employee = DB::transaction(function () use ($request, $employee): Employee {
            $employee->update($this->validated($request, $employee));
            DomainEvent::record('employee.updated', 'employee', (string) $employee->id, ['employee' => $employee->refresh()->toArray()]);

            return $employee->refresh();
        });

        return response()->json(['data' => $employee]);
    }

    public function destroy(Employee $employee): JsonResponse
    {
        DB::transaction(function () use ($employee): void {
            $employee->delete();
            DomainEvent::record('employee.deleted', 'employee', (string) $employee->id, ['id' => $employee->id]);
        });

        return response()->json(status: 204);
    }

    private function validated(Request $request, ?Employee $employee = null): array
    {
        return $request->validate([
            'employee_number' => ['required', 'string', 'max:50', Rule::unique('employees', 'employee_number')->ignore($employee)],
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('employees', 'email')->ignore($employee)],
            'department' => ['nullable', 'string', 'max:120'],
            'position' => ['nullable', 'string', 'max:120'],
            'employment_status' => ['required', Rule::in(['active', 'inactive', 'terminated'])],
            'hired_on' => ['nullable', 'date'],
        ]);
    }
}

