<?php

namespace Tests\Feature;

use App\Models\MeterReading;
use App\Models\House;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MeterReadingTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_meter_readings(): void
    {
        MeterReading::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/readings');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_can_create_meter_reading(): void
    {
        Storage::fake('public');
        $house = House::factory()->create();

        $response = $this->postJson('/api/v1/readings', [
            'house_id' => $house->id,
            'reading_date' => '2024-01-01',
            'previous_reading' => 100,
            'current_reading' => 150,
            'reader_name' => 'John Doe',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'consumption' => 50,
                    'status' => 'pending',
                ],
            ]);
    }

    public function test_cannot_create_reading_with_invalid_data(): void
    {
        $response = $this->postJson('/api/v1/readings', [
            'house_id' => 999,
            'reading_date' => 'invalid-date',
            'previous_reading' => -10,
            'current_reading' => 5,
        ]);

        $response->assertStatus(422);
    }

    public function test_can_update_meter_reading(): void
    {
        $reading = MeterReading::factory()->create();

        $response = $this->putJson("/api/v1/readings/{$reading->id}", [
            'status' => 'confirmed',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'status' => 'confirmed',
                ],
            ]);
    }

    public function test_can_delete_meter_reading(): void
    {
        $reading = MeterReading::factory()->create();

        $response = $this->deleteJson("/api/v1/readings/{$reading->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('meter_readings', ['id' => $reading->id]);
    }
}
