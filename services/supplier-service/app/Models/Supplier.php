<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_code',
        'name',
        'contact_person',
        'email',
        'phone',
        'address',
        'npwp',
        'payment_terms_days',
        'status',
    ];

    protected function casts(): array
    {
        return ['payment_terms_days' => 'integer'];
    }
}
