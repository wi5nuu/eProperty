<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_number',
        'full_name',
        'email',
        'department',
        'position',
        'employment_status',
        'hired_on',
    ];

    protected function casts(): array
    {
        return ['hired_on' => 'date'];
    }
}

