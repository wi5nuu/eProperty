<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('houses', function (Blueprint $table) {
            $table->id();
            $table->string('house_code', 20)->unique();
            $table->string('address');
            $table->string('rt', 10)->nullable();
            $table->string('rw', 10)->nullable();
            $table->string('block', 10)->nullable();
            $table->string('owner_name');
            $table->string('phone', 20)->nullable();
            $table->string('meter_number', 30)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->index('status');
            $table->index('rt');
            $table->index('rw');
            $table->index('block');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('houses');
    }
};
