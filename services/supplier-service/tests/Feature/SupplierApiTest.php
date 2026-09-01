<?php

namespace Tests\Feature;

use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SupplierApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_supplier_list_requires_a_token(): void
    {
        $this->getJson('/api/suppliers')->assertUnauthorized();
    }

    public function test_authorized_user_can_create_a_supplier(): void
    {
        config(['auth_token.secret' => 'test-secret-that-is-at-least-thirty-two-bytes']);
        $token = JWT::encode([
            'iss' => config('auth_token.issuer'),
            'aud' => config('auth_token.audience'),
            'iat' => now()->timestamp,
            'exp' => now()->addMinutes(5)->timestamp,
            'sub' => '1',
            'permissions' => ['suppliers.create'],
        ], 'test-secret-that-is-at-least-thirty-two-bytes', 'HS256');

        $this->withToken($token)->postJson('/api/suppliers', [
            'supplier_code' => 'SUP-001',
            'name' => 'PT Pemasok Andalan',
            'status' => 'active',
        ])->assertCreated()->assertJsonPath('data.supplier_code', 'SUP-001');
    }
}
