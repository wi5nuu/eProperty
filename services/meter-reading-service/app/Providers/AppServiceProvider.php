<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        RateLimiter::for('login', fn (Request $request) => [
            \Illuminate\Http\Middleware\RateLimiter::perMinute(5)->by('login|' . mb_strtolower((string) $request->input('email')) . '|' . (string) $request->ip()),
        ]);
    }
}
