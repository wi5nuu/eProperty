<?php

namespace Tests\Feature;

use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_employee_list_requires_a_token(): void
    {
        $this->getJson('/api/employees')->assertUnauthorized();
    }

    public function test_authorized_user_can_create_an_employee(): void
    {
        config(['auth_token.secret' => 'test-secret-that-is-at-least-thirty-two-bytes']);
        $token = JWT::encode([
            'iss' => config('auth_token.issuer'),
            'aud' => config('auth_token.audience'),
            'iat' => now()->timestamp,
            'exp' => now()->addMinutes(5)->timestamp,
            'sub' => '1',
            'permissions' => ['employees.create'],
        ], 'test-secret-that-is-at-least-thirty-two-bytes', 'HS256');

        $this->withToken($token)->postJson('/api/employees', [
            'employee_number' => 'EMP-001',
            'full_name' => 'Siti Aminah',
            'employment_status' => 'active',
        ])->assertCreated()->assertJsonPath('data.employee_number', 'EMP-001');
    }
}
