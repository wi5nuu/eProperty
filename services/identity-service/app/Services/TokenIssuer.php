<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Support\Str;
use RuntimeException;

class TokenIssuer
{
    public function issue(User $user): string
    {
        $secret = config('auth_token.secret');

        if (! is_string($secret) || $secret === '') {
            throw new RuntimeException('JWT_SECRET belum dikonfigurasi.');
        }

        $user->loadMissing('roles.permissions');
        $now = now();
        $permissions = $user->roles
            ->flatMap(fn ($role) => $role->permissions->pluck('code'))
            ->unique()
            ->values()
            ->all();

        return JWT::encode([
            'iss' => config('auth_token.issuer'),
            'aud' => config('auth_token.audience'),
            'iat' => $now->timestamp,
            'nbf' => $now->timestamp,
            'exp' => $now->copy()->addMinutes(config('auth_token.ttl_minutes'))->timestamp,
            'jti' => (string) Str::uuid(),
            'sub' => (string) $user->id,
            'email' => $user->email,
            'roles' => $user->roles->pluck('code')->values()->all(),
            'permissions' => $permissions,
        ], $secret, 'HS256');
    }
}

