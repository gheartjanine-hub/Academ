<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\EnrollmentSubject;
use App\Models\Grade;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherPortalController extends Controller
{
    public function classes(Request $request): Response
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            abort(404, 'Teacher profile not found.');
        }

        $activeAy = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        // Get subjects assigned to teacher
        $enrollmentSubjects = EnrollmentSubject::with(['subject', 'enrollment.student', 'enrollment.section', 'enrollment.academicYear', 'enrollment.semester'])
            ->where('teacher_id', $teacher->id)
            ->get();

        $classes = $enrollmentSubjects->groupBy('subject_id')->map(function ($items, $subjId) {
            $first = $items->first();
            return [
                'subjectId' => $subjId,
                'subjectCode' => $first->subject?->code,
                'subjectName' => $first->subject?->name,
                'units' => $first->subject?->units,
                'totalStudents' => $items->count(),
                'students' => $items->map(fn ($item) => [
                    'enrollmentId' => $item->enrollment_id,
                    'studentId' => $item->enrollment?->student?->student_id,
                    'name' => $item->enrollment?->student?->full_name,
                    'section' => $item->enrollment?->section?->name ?? 'N/A',
                    'yearLevel' => $item->enrollment?->year_level,
                ])->values(),
            ];
        })->values();

        return Inertia::render('teacher-portal/classes', [
            'classes' => $classes,
            'activeAcademicYear' => $activeAy?->name,
            'activeSemester' => $activeSem?->name,
        ]);
    }

    public function gradeEntry(Request $request, int $subjectId): Response
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            abort(404, 'Teacher profile not found.');
        }

        $activeAy = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        $grades = Grade::with(['student.section', 'subject', 'academicYear', 'semester'])
            ->where('teacher_id', $teacher->id)
            ->where('subject_id', $subjectId)
            ->when($activeAy, fn ($q) => $q->where('academic_year_id', $activeAy->id))
            ->when($activeSem, fn ($q) => $q->where('semester_id', $activeSem->id))
            ->get();

        $subject = \App\Models\Subject::findOrFail($subjectId);

        return Inertia::render('teacher-portal/grade-entry', [
            'subject' => $subject,
            'grades' => $grades->map(fn ($g) => [
                'id' => $g->id,
                'studentId' => $g->student?->student_id,
                'studentName' => $g->student?->full_name,
                'section' => $g->student?->section?->name ?? 'N/A',
                'prelim_grade' => $g->prelim_grade,
                'midterm_grade' => $g->midterm_grade,
                'final_grade' => $g->final_grade,
                'final_rating' => $g->final_rating,
                'remarks' => $g->remarks,
            ]),
            'academicYear' => $activeAy?->name,
            'semester' => $activeSem?->name,
        ]);
    }
}

