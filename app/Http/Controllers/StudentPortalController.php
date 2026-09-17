<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentPortalController extends Controller
{
    public function profile(Request $request): Response
    {
        $student = $request->user()->student;
        if (!$student) {
            abort(404, 'Student record not found for your account.');
        }

        $student->load(['program', 'section', 'academicYear', 'user']);

        return Inertia::render('student-portal/profile', [
            'student' => $student,
        ]);
    }

    public function subjects(Request $request): Response
    {
        $student = $request->user()->student;
        if (!$student) {
            abort(404, 'Student record not found.');
        }

        $activeAy = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        $enrollment = Enrollment::with(['academicYear', 'semester', 'program', 'section', 'enrollmentSubjects.subject', 'enrollmentSubjects.teacher'])
            ->where('student_id', $student->id)
            ->when($activeAy, fn ($q) => $q->where('academic_year_id', $activeAy->id))
            ->when($activeSem, fn ($q) => $q->where('semester_id', $activeSem->id))
            ->first();

        return Inertia::render('student-portal/subjects', [
            'enrollment' => $enrollment,
            'subjects' => $enrollment ? $enrollment->enrollmentSubjects->map(fn ($es) => [
                'code' => $es->subject?->code,
                'name' => $es->subject?->name,
                'units' => $es->subject?->units,
                'teacher' => $es->teacher?->full_name ?? 'To be announced',
                'department' => $es->subject?->department,
            ]) : [],
        ]);
    }

    public function grades(Request $request): Response
    {
        $student = $request->user()->student;
        if (!$student) {
            abort(404, 'Student record not found.');
        }

        $activeAy = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        $grades = Grade::with(['subject', 'academicYear', 'semester', 'teacher'])
            ->where('student_id', $student->id)
            ->when($activeAy, fn ($q) => $q->where('academic_year_id', $activeAy->id))
            ->when($activeSem, fn ($q) => $q->where('semester_id', $activeSem->id))
            ->get();

        return Inertia::render('student-portal/grades', [
            'grades' => $grades->map(fn ($g) => [
                'id' => $g->id,
                'code' => $g->subject?->code,
                'name' => $g->subject?->name,
                'units' => $g->subject?->units,
                'teacher' => $g->teacher?->full_name ?? 'N/A',
                'prelim' => $g->prelim_grade,
                'midterm' => $g->midterm_grade,
                'final' => $g->final_grade,
                'rating' => $g->final_rating,
                'remarks' => $g->remarks,
            ]),
            'academicYear' => $activeAy?->name,
            'semester' => $activeSem?->name,
        ]);
    }

    public function history(Request $request): Response
    {
        $student = $request->user()->student;
        if (!$student) {
            abort(404, 'Student record not found.');
        }

        // Delegate to academic record show
        return app(AcademicRecordController::class)->show($request, $student);
    }
}

