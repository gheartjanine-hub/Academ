<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ActivityLog;
use App\Models\Grade;
use App\Models\GradingSetting;
use App\Models\Program;
use App\Models\Section;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class GradeController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $academicYearId = $request->input('academic_year_id');
        $semesterId = $request->input('semester_id');
        $subjectId = $request->input('subject_id');
        $sectionId = $request->input('section_id');
        $search = $request->input('search');

        $query = Grade::with(['student.program', 'student.section', 'subject', 'teacher', 'academicYear', 'semester']);

        // Teacher security: if logged in as teacher, only show grades for their assigned subjects
        if ($user->isTeacher()) {
            $teacher = $user->teacher;
            if ($teacher) {
                $query->where('teacher_id', $teacher->id);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        // Student security: if logged in as student, only show own grades
        if ($user->isStudent()) {
            $student = $user->student;
            if ($student) {
                $query->where('student_id', $student->id);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        $grades = $query
            ->when($academicYearId, fn ($q) => $q->where('academic_year_id', $academicYearId))
            ->when($semesterId, fn ($q) => $q->where('semester_id', $semesterId))
            ->when($subjectId, fn ($q) => $q->where('subject_id', $subjectId))
            ->when($sectionId, function ($q) use ($sectionId) {
                $q->whereHas('student', fn ($sq) => $sq->where('section_id', $sectionId));
            })
            ->when($search, function ($q) use ($search) {
                $q->whereHas('student', function ($sq) use ($search) {
                    $sq->where('student_id', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                })->orWhereHas('subject', function ($sq) use ($search) {
                    $sq->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $academicYears = AcademicYear::latest()->get(['id', 'name', 'is_active']);
        $semesters = Semester::get(['id', 'name', 'academic_year_id', 'is_active']);
        $subjects = Subject::where('status', 'active')->get(['id', 'code', 'name', 'units']);
        $sections = Section::where('status', 'active')->get(['id', 'name']);
        $teachers = Teacher::where('status', 'active')->get(['id', 'teacher_id', 'first_name', 'last_name']);
        $gradingSetting = GradingSetting::getSettings();

        return Inertia::render('grades/index', [
            'grades' => $grades,
            'filters' => [
                'academic_year_id' => $academicYearId,
                'semester_id' => $semesterId,
                'subject_id' => $subjectId,
                'section_id' => $sectionId,
                'search' => $search,
            ],
            'academicYears' => $academicYears,
            'semesters' => $semesters,
            'subjects' => $subjects,
            'sections' => $sections,
            'teachers' => $teachers,
            'gradingSetting' => $gradingSetting,
            'canEdit' => $user->isAdmin() || $user->isRegistrar() || $user->isTeacher(),
        ]);
    }

    public function update(Request $request, Grade $grade): RedirectResponse
    {
        $user = $request->user();

        // Check teacher authorization: teacher can only update grades for their assigned subject
        if ($user->isTeacher()) {
            $teacher = $user->teacher;
            if (!$teacher || $grade->teacher_id !== $teacher->id) {
                abort(403, 'Unauthorized. You can only enter or update grades for your assigned subjects.');
            }
        }

        // Students cannot update grades
        if ($user->isStudent()) {
            abort(403, 'Students are not authorized to update grades.');
        }

        $validated = $request->validate([
            'prelim_grade' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'midterm_grade' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'final_grade' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'teacher_id' => ['nullable', 'exists:teachers,id'],
        ]);

        $grade->prelim_grade = $validated['prelim_grade'] ?? null;
        $grade->midterm_grade = $validated['midterm_grade'] ?? null;
        $grade->final_grade = $validated['final_grade'] ?? null;

        if (isset($validated['teacher_id']) && ($user->isAdmin() || $user->isRegistrar())) {
            $grade->teacher_id = $validated['teacher_id'];
        }

        // Automatically compute rating and remarks
        $grade->computeGrade();
        $grade->save();

        ActivityLog::log('Recorded Grade', "Updated grade for Student #{$grade->student_id} in {$grade->subject?->code}: Final Rating {$grade->final_rating} ({$grade->remarks}).");

        return back()->with('success', 'Grade updated successfully.');
    }

    /**
     * Batch save grades for a class / subject section.
     */
    public function batchUpdate(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->isStudent()) {
            abort(403, 'Students are not authorized to record grades.');
        }

        $validated = $request->validate([
            'grades' => ['required', 'array', 'min:1'],
            'grades.*.id' => ['required', 'exists:grades,id'],
            'grades.*.prelim_grade' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'grades.*.midterm_grade' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'grades.*.final_grade' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $teacher = $user->isTeacher() ? $user->teacher : null;

        DB::transaction(function () use ($validated, $user, $teacher) {
            foreach ($validated['grades'] as $item) {
                $grade = Grade::find($item['id']);
                if (!$grade) continue;

                // Authorization check per item
                if ($user->isTeacher() && (!$teacher || $grade->teacher_id !== $teacher->id)) {
                    continue; // skip unauthorized record
                }

                $grade->prelim_grade = $item['prelim_grade'] !== '' && $item['prelim_grade'] !== null ? (float) $item['prelim_grade'] : null;
                $grade->midterm_grade = $item['midterm_grade'] !== '' && $item['midterm_grade'] !== null ? (float) $item['midterm_grade'] : null;
                $grade->final_grade = $item['final_grade'] !== '' && $item['final_grade'] !== null ? (float) $item['final_grade'] : null;

                $grade->computeGrade();
                $grade->save();
            }

            ActivityLog::log('Batch Grade Entry', "Batch updated " . count($validated['grades']) . " grade entries.");
        });

        return back()->with('success', 'Grades updated successfully.');
    }
}

