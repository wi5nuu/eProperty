<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateJwt
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization', '');
        if (!str_starts_with($header, 'Bearer ')) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $token = substr($header, 7);
        try {
            $claims = JWT::decode($token, new Key(config('auth_token.secret'), 'HS256'));
            if ($claims->iss !== config('auth_token.issuer') || $claims->aud !== config('auth_token.audience')) {
                return response()->json(['message' => 'Invalid token claims.'], 401);
            }
            $request->attributes->set('token_claims', (array) $claims);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid or expired token.'], 401);
        }

        return $next($request);
    }
}
