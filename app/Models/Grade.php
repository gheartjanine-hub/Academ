<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_id',
        'teacher_id',
        'academic_year_id',
        'semester_id',
        'enrollment_id',
        'prelim_grade',
        'midterm_grade',
        'final_grade',
        'final_rating',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'prelim_grade' => 'decimal:2',
            'midterm_grade' => 'decimal:2',
            'final_grade' => 'decimal:2',
            'final_rating' => 'decimal:2',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    /**
     * Compute final rating and remarks based on grading settings.
     */
    public function computeGrade(): void
    {
        $setting = GradingSetting::first();
        $passingGrade = $setting ? (float) $setting->passing_grade : 75.0;
        $prelimWeight = $setting ? (float) $setting->prelim_weight / 100.0 : 0.30;
        $midtermWeight = $setting ? (float) $setting->midterm_weight / 100.0 : 0.30;
        $finalWeight = $setting ? (float) $setting->final_weight / 100.0 : 0.40;

        if ($this->prelim_grade !== null && $this->midterm_grade !== null && $this->final_grade !== null) {
            $rating = round(
                ((float) $this->prelim_grade * $prelimWeight) +
                ((float) $this->midterm_grade * $midtermWeight) +
                ((float) $this->final_grade * $finalWeight),
                2
            );
            $this->final_rating = $rating;
            $this->remarks = $rating >= $passingGrade ? 'Passed' : 'Failed';
        } elseif ($this->prelim_grade !== null || $this->midterm_grade !== null || $this->final_grade !== null) {
            $this->remarks = 'Incomplete';
        } else {
            $this->remarks = 'Pending';
        }
    }
}

