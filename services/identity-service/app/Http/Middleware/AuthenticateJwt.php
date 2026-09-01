<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AuthenticateJwt
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        $secret = config('auth_token.secret');

        if ($token === null || ! is_string($secret) || $secret === '') {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $claims = JWT::decode($token, new Key($secret, 'HS256'));
            if ($claims->iss !== config('auth_token.issuer') || $claims->aud !== config('auth_token.audience')) {
                return response()->json(['message' => 'Invalid token audience.'], 401);
            }
            $request->attributes->set('token_claims', $claims);
        } catch (Throwable) {
            return response()->json(['message' => 'Invalid or expired token.'], 401);
        }

        return $next($request);
    }
}

