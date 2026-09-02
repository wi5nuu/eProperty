<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contractors', function (Blueprint $table): void {
            $table->id();
            $table->string('contractor_code', 50)->unique();
            $table->string('company_name');
            $table->string('contact_person', 255)->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('phone', 30)->nullable();
            $table->text('address')->nullable();
            $table->string('npwp', 30)->nullable();
            $table->string('specialization', 120)->nullable();
            $table->string('status', 20)->default('active')->index();
            $table->timestamps();

            $table->index('specialization');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contractors');
    }
};
