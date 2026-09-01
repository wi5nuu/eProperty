<?php

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Menulis event domain ke tabel outbox. Harus dipanggil di dalam transaksi
 * database yang sama dengan perubahan bisnis terkait (transactional outbox).
 */
class DomainEvent
{
    public static function record(string $eventType, string $aggregateType, string $aggregateId, array $payload): OutboxMessage
    {
        return OutboxMessage::query()->create([
            'id' => (string) Str::uuid(),
            'event_type' => $eventType,
            'aggregate_type' => $aggregateType,
            'aggregate_id' => $aggregateId,
            'payload' => $payload,
            'occurred_at' => now(),
        ]);
    }
}
