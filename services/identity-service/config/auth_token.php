<?php

return [
    'secret' => env('JWT_SECRET'),
    'issuer' => env('JWT_ISSUER', 'eproperty-identity'),
    'audience' => env('JWT_AUDIENCE', 'eproperty-services'),
    'ttl_minutes' => (int) env('JWT_TTL_MINUTES', 15),
];

