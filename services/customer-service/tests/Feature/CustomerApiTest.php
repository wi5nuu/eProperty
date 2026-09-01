<?php

namespace Tests\Feature;

use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_list_requires_a_token(): void
    {
        $this->getJson('/api/customers')->assertUnauthorized();
    }

    public function test_authorized_user_can_create_a_customer(): void
    {
        config(['auth_token.secret' => 'test-secret-that-is-at-least-thirty-two-bytes']);
        $token = JWT::encode([
            'iss' => config('auth_token.issuer'),
            'aud' => config('auth_token.audience'),
            'iat' => now()->timestamp,
            'exp' => now()->addMinutes(5)->timestamp,
            'sub' => '1',
            'permissions' => ['customers.create'],
        ], 'test-secret-that-is-at-least-thirty-two-bytes', 'HS256');

        $this->withToken($token)->postJson('/api/customers', [
            'customer_code' => 'CUS-001',
            'name' => 'PT Pelanggan Sejahtera',
            'type' => 'company',
            'status' => 'active',
        ])->assertCreated()->assertJsonPath('data.customer_code', 'CUS-001');
    }
}
