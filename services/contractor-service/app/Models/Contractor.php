<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contractor extends Model
{
    use HasFactory;

    protected $fillable = [
        'contractor_code',
        'company_name',
        'contact_person',
        'email',
        'phone',
        'address',
        'npwp',
        'specialization',
        'status',
    ];
}
