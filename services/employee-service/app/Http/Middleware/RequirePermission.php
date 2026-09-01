<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequirePermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $claims = $request->attributes->get('token_claims');
        $permissions = is_object($claims) ? (array) ($claims->permissions ?? []) : [];
        if (! in_array($permission, $permissions, true)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return $next($request);
    }
}

