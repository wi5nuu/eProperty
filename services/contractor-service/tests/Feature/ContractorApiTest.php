<?php

namespace Tests\Feature;

use Firebase\JWT\JWT;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContractorApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_contractor_list_requires_a_token(): void
    {
        $this->getJson('/api/contractors')->assertUnauthorized();
    }

    public function test_authorized_user_can_create_a_contractor(): void
    {
        config(['auth_token.secret' => 'test-secret-that-is-at-least-thirty-two-bytes']);
        $token = JWT::encode([
            'iss' => config('auth_token.issuer'),
            'aud' => config('auth_token.audience'),
            'iat' => now()->timestamp,
            'exp' => now()->addMinutes(5)->timestamp,
            'sub' => '1',
            'permissions' => ['contractors.create'],
        ], 'test-secret-that-is-at-least-thirty-two-bytes', 'HS256');

        $this->withToken($token)->postJson('/api/contractors', [
            'contractor_code' => 'CT-001',
            'company_name' => 'PT Bangun Jaya',
            'status' => 'active',
        ])->assertCreated()->assertJsonPath('data.contractor_code', 'CT-001');
    }
}
