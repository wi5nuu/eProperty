<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\TokenIssuer;
use App\Support\DomainEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request, TokenIssuer $tokens): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('email', $credentials['email'])->first();
        if ($user === null || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => ['Kredensial tidak valid.']]);
        }

        DB::transaction(fn () => DomainEvent::record(
            'identity.user.logged_in',
            'user',
            (string) $user->id,
            ['email' => $user->email, 'ip' => (string) $request->ip()],
        ));

        return response()->json([
            'access_token' => $tokens->issue($user),
            'token_type' => 'Bearer',
            'expires_in' => config('auth_token.ttl_minutes') * 60,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => $request->attributes->get('token_claims')]);
    }
}

