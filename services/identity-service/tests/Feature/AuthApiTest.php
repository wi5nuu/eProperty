<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_log_in_and_receive_permissions_in_token(): void
    {
        config(['auth_token.secret' => 'test-secret-that-is-at-least-thirty-two-bytes']);
        $permission = Permission::query()->create(['code' => 'employees.read', 'name' => 'View employees']);
        $role = Role::query()->create(['code' => 'reader', 'name' => 'Reader']);
        $role->permissions()->attach($permission);
        $user = User::factory()->create(['password' => 'secret-password']);
        $user->roles()->attach($role);

        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'secret-password',
        ])->assertOk()
            ->assertJsonStructure(['access_token', 'token_type', 'expires_in']);
    }
}
