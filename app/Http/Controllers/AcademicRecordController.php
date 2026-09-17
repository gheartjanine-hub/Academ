<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicRecordController extends Controller
{
    public function show(Request $request, Student $student): Response
    {
        $user = $request->user();

        // Security: Student can ONLY view their own records
        if ($user->isStudent()) {
            if (!$user->student || $user->student->id !== $student->id) {
                abort(403, 'Unauthorized. Students cannot view other students academic records.');
            }
        }

        $student->load(['program', 'section', 'academicYear']);

        $grades = Grade::with(['subject', 'academicYear', 'semester', 'teacher'])
            ->where('student_id', $student->id)
            ->get();

        // Group by term (Academic Year + Semester)
        $termRecords = $grades->groupBy(function ($grade) {
            return "{$grade->academicYear?->name} - {$grade->semester?->name}";
        })->map(function ($items, $termName) {
            $totalUnits = $items->sum(fn ($g) => $g->subject?->units ?? 0);
            $passedUnits = $items->where('remarks', 'Passed')->sum(fn ($g) => $g->subject?->units ?? 0);

            // Compute term weighted average or arithmetic average
            $graded = $items->filter(fn ($g) => $g->final_rating !== null);
            $totalWeightedScore = 0;
            $totalGradedUnits = 0;

            foreach ($graded as $g) {
                $u = $g->subject?->units ?? 3;
                $totalWeightedScore += ((float) $g->final_rating * $u);
                $totalGradedUnits += $u;
            }

            $termGpa = $totalGradedUnits > 0 ? round($totalWeightedScore / $totalGradedUnits, 2) : null;
            $termAvg = $graded->count() > 0 ? round($graded->avg('final_rating'), 2) : null;

            return [
                'term' => $termName,
                'academicYear' => $items->first()->academicYear?->name,
                'semester' => $items->first()->semester?->name,
                'totalUnits' => $totalUnits,
                'passedUnits' => $passedUnits,
                'gpa' => $termGpa,
                'averageGrade' => $termAvg,
                'subjects' => $items->map(fn ($g) => [
                    'id' => $g->id,
                    'code' => $g->subject?->code,
                    'name' => $g->subject?->name,
                    'units' => $g->subject?->units,
                    'prelim' => $g->prelim_grade,
                    'midterm' => $g->midterm_grade,
                    'final' => $g->final_grade,
                    'rating' => $g->final_rating,
                    'remarks' => $g->remarks,
                    'teacher' => $g->teacher?->full_name,
                ]),
            ];
        })->values();

        // Cumulative totals
        $allGraded = $grades->filter(fn ($g) => $g->final_rating !== null);
        $cumulativeUnits = $grades->where('remarks', 'Passed')->sum(fn ($g) => $g->subject?->units ?? 0);
        $totalEarnedUnits = $grades->sum(fn ($g) => $g->subject?->units ?? 0);

        $cumWeightedScore = 0;
        $cumGradedUnits = 0;
        foreach ($allGraded as $g) {
            $u = $g->subject?->units ?? 3;
            $cumWeightedScore += ((float) $g->final_rating * $u);
            $cumGradedUnits += $u;
        }

        $cumulativeGpa = $cumGradedUnits > 0 ? round($cumWeightedScore / $cumGradedUnits, 2) : null;
        $generalAverage = $allGraded->count() > 0 ? round($allGraded->avg('final_rating'), 2) : null;

        return Inertia::render('academic-records/show', [
            'student' => [
                'id' => $student->id,
                'studentId' => $student->student_id,
                'name' => $student->full_name,
                'program' => $student->program?->name ?? 'N/A',
                'programCode' => $student->program?->code ?? 'N/A',
                'yearLevel' => $student->year_level ?? 'N/A',
                'section' => $student->section?->name ?? 'N/A',
                'status' => $student->status,
                'email' => $student->email,
            ],
            'termRecords' => $termRecords,
            'summary' => [
                'totalSubjects' => $grades->count(),
                'passedSubjects' => $grades->where('remarks', 'Passed')->count(),
                'failedSubjects' => $grades->where('remarks', 'Failed')->count(),
                'incompleteSubjects' => $grades->where('remarks', 'Incomplete')->count(),
                'totalUnits' => $totalEarnedUnits,
                'earnedUnits' => $cumulativeUnits,
                'generalAverage' => $generalAverage,
                'cumulativeGpa' => $cumulativeGpa,
            ],
        ]);
    }
}

