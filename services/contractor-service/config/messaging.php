<?php

return [
    'host' => env('RABBITMQ_HOST', 'rabbitmq'),
    'port' => (int) env('RABBITMQ_PORT', 5672),
    'user' => env('RABBITMQ_USER', 'eproperty'),
    'password' => env('RABBITMQ_PASSWORD', ''),
    'vhost' => env('RABBITMQ_VHOST', '/'),
    'exchange' => env('EVENT_EXCHANGE', 'eproperty.events'),
    'producer' => env('EVENT_PRODUCER', 'contractor-service'),
    'watch_sleep_seconds' => max(1, (int) env('OUTBOX_POLL_SECONDS', 1)),
];
