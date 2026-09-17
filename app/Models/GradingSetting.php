<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradingSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'passing_grade',
        'prelim_weight',
        'midterm_weight',
        'final_weight',
        'grading_system',
    ];

    protected $casts = [
        'passing_grade' => 'decimal:2',
        'prelim_weight' => 'decimal:2',
        'midterm_weight' => 'decimal:2',
        'final_weight' => 'decimal:2',
    ];

    public static function getSettings(): self
    {
        return static::firstOrCreate([], [
            'passing_grade' => 75.00,
            'prelim_weight' => 30.00,
            'midterm_weight' => 30.00,
            'final_weight' => 40.00,
            'grading_system' => 'percentage',
        ]);
    }
}

