<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meter_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained()->cascadeOnDelete();
            $table->date('reading_date');
            $table->decimal('previous_reading', 12, 2)->default(0);
            $table->decimal('current_reading', 12, 2)->default(0);
            $table->decimal('consumption', 12, 2)->default(0);
            $table->string('photo_before')->nullable();
            $table->string('photo_after')->nullable();
            $table->string('reader_name');
            $table->text('notes')->nullable();
            $table->string('status', 20)->default('pending');
            $table->timestamps();

            $table->index(['house_id', 'reading_date']);
            $table->index('status');
            $table->index('reading_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meter_readings');
    }
};
