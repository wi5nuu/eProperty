<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table): void {
            $table->id();
            $table->string('employee_number', 50)->unique();
            $table->string('full_name');
            $table->string('email')->nullable()->unique();
            $table->string('department', 120)->nullable();
            $table->string('position', 120)->nullable();
            $table->string('employment_status', 20)->default('active')->index();
            $table->date('hired_on')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};

