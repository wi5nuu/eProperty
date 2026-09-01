<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $permissions = collect([
            'employees.read' => 'Melihat pegawai',
            'employees.create' => 'Membuat pegawai',
            'employees.update' => 'Memperbarui pegawai',
            'employees.delete' => 'Menghapus pegawai',
            'contractors.read' => 'Melihat kontraktor',
            'contractors.create' => 'Membuat kontraktor',
            'contractors.update' => 'Memperbarui kontraktor',
            'contractors.delete' => 'Menghapus kontraktor',
            'customers.read' => 'Melihat customer',
            'customers.create' => 'Membuat customer',
            'customers.update' => 'Memperbarui customer',
            'customers.delete' => 'Menghapus customer',
            'suppliers.read' => 'Melihat supplier',
            'suppliers.create' => 'Membuat supplier',
            'suppliers.update' => 'Memperbarui supplier',
            'suppliers.delete' => 'Menghapus supplier',
            'properties.read' => 'Melihat properti',
            'properties.create' => 'Membuat properti',
            'properties.update' => 'Memperbarui properti',
            'properties.delete' => 'Menghapus properti',
            'tenants.read' => 'Melihat penyewa',
            'tenants.create' => 'Membuat penyewa',
            'tenants.update' => 'Memperbarui penyewa',
            'tenants.delete' => 'Menghapus penyewa',
            'invoices.read' => 'Melihat invoice',
            'invoices.create' => 'Membuat invoice',
            'invoices.update' => 'Memperbarui invoice',
            'invoices.delete' => 'Menghapus invoice',
            'meters.read' => 'Melihat meter',
            'meters.create' => 'Membuat pembacaan meter',
            'meters.update' => 'Memperbarui pembacaan meter',
            'meters.delete' => 'Menghapus pembacaan meter',
        ])->map(fn (string $name, string $code) => Permission::firstOrCreate(['code' => $code], ['name' => $name]));

        $adminRole = Role::firstOrCreate(['code' => 'administrator'], ['name' => 'Administrator']);
        $adminRole->permissions()->sync($permissions->pluck('id'));

        $admin = User::firstOrCreate(
            ['email' => env('INITIAL_ADMIN_EMAIL', 'admin@eproperty.local')],
            ['name' => 'System Administrator', 'password' => env('INITIAL_ADMIN_PASSWORD', 'ChangeMe123!')],
        );
        $admin->roles()->syncWithoutDetaching([$adminRole->id]);
    }
}
