<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->updateOrInsert(
            ['email' => env('INITIAL_ADMIN_EMAIL', 'admin@eproperty.local')],
            [
                'name' => 'System Administrator',
                'password' => Hash::make(env('INITIAL_ADMIN_PASSWORD', 'ChangeMe123!')),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
