<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

class OutboxMessage extends Model
{
    protected $table = 'event_outbox';

    protected $fillable = [
        'id',
        'event_type',
        'aggregate_type',
        'aggregate_id',
        'payload',
        'occurred_at',
        'published_at',
        'attempts',
        'last_error_at',
    ];

    protected function casts(): array
    {
        return [
            'id' => 'string',
            'payload' => 'array',
            'occurred_at' => 'datetime',
            'published_at' => 'datetime',
            'last_error_at' => 'datetime',
        ];
    }
}
