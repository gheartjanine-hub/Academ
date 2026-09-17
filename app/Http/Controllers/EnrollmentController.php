<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ActivityLog;
use App\Models\Enrollment;
use App\Models\EnrollmentSubject;
use App\Models\Grade;
use App\Models\Program;
use App\Models\Section;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $academicYearId = $request->input('academic_year_id');
        $semesterId = $request->input('semester_id');
        $programId = $request->input('program_id');
        $status = $request->input('status');

        $enrollments = Enrollment::with(['student', 'program', 'section', 'academicYear', 'semester'])
            ->withCount('enrollmentSubjects')
            ->when($search, function ($query, $search) {
                $query->whereHas('student', function ($q) use ($search) {
                    $q->where('student_id', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                });
            })
            ->when($academicYearId, fn ($q) => $q->where('academic_year_id', $academicYearId))
            ->when($semesterId, fn ($q) => $q->where('semester_id', $semesterId))
            ->when($programId, fn ($q) => $q->where('program_id', $programId))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $academicYears = AcademicYear::latest()->get(['id', 'name', 'is_active']);
        $semesters = Semester::get(['id', 'name', 'academic_year_id', 'is_active']);
        $programs = Program::where('status', 'active')->get(['id', 'code', 'name']);

        return Inertia::render('enrollments/index', [
            'enrollments' => $enrollments,
            'filters' => [
                'search' => $search,
                'academic_year_id' => $academicYearId,
                'semester_id' => $semesterId,
                'program_id' => $programId,
                'status' => $status,
            ],
            'academicYears' => $academicYears,
            'semesters' => $semesters,
            'programs' => $programs,
        ]);
    }

    public function create(Request $request): Response
    {
        $students = Student::where('status', 'active')->get(['id', 'student_id', 'first_name', 'last_name', 'program_id', 'year_level', 'section_id']);
        $academicYears = AcademicYear::latest()->get();
        $semesters = Semester::get();
        $programs = Program::where('status', 'active')->get();
        $sections = Section::where('status', 'active')->get();
        $subjects = Subject::where('status', 'active')->get();
        $teachers = Teacher::where('status', 'active')->get();

        $preselectedStudentId = $request->input('student_id');

        return Inertia::render('enrollments/create', [
            'students' => $students,
            'academicYears' => $academicYears,
            'semesters' => $semesters,
            'programs' => $programs,
            'sections' => $sections,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'preselectedStudentId' => $preselectedStudentId,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'semester_id' => ['required', 'exists:semesters,id'],
            'program_id' => ['required', 'exists:programs,id'],
            'year_level' => ['required', 'string', 'max:50'],
            'section_id' => ['nullable', 'exists:sections,id'],
            'status' => ['required', 'string', 'in:enrolled,pending,dropped,completed'],
            'enrollment_date' => ['nullable', 'date'],
            'remarks' => ['nullable', 'string'],
            'subjects' => ['required', 'array', 'min:1'],
            'subjects.*.subject_id' => ['required', 'exists:subjects,id', 'distinct'],
            'subjects.*.teacher_id' => ['nullable', 'exists:teachers,id'],
        ]);

        // Prevent duplicate enrollment for same student, academic year, and semester
        $exists = Enrollment::where('student_id', $validated['student_id'])
            ->where('academic_year_id', $validated['academic_year_id'])
            ->where('semester_id', $validated['semester_id'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'student_id' => 'This student is already enrolled for the selected Academic Year and Semester.',
            ])->withInput();
        }

        DB::transaction(function () use ($validated) {
            $enrollment = Enrollment::create([
                'student_id' => $validated['student_id'],
                'academic_year_id' => $validated['academic_year_id'],
                'semester_id' => $validated['semester_id'],
                'program_id' => $validated['program_id'],
                'year_level' => $validated['year_level'],
                'section_id' => $validated['section_id'] ?? null,
                'status' => $validated['status'],
                'enrollment_date' => $validated['enrollment_date'] ?? now(),
                'remarks' => $validated['remarks'] ?? null,
            ]);

            // Update student's current program, year level, and section
            $student = Student::find($validated['student_id']);
            $student->update([
                'program_id' => $validated['program_id'],
                'year_level' => $validated['year_level'],
                'section_id' => $validated['section_id'] ?? $student->section_id,
                'academic_year_id' => $validated['academic_year_id'],
            ]);

            // Create enrollment subjects and prepare grade slots
            foreach ($validated['subjects'] as $subItem) {
                EnrollmentSubject::create([
                    'enrollment_id' => $enrollment->id,
                    'subject_id' => $subItem['subject_id'],
                    'teacher_id' => $subItem['teacher_id'] ?? null,
                ]);

                // Create initial grade record if not exists
                Grade::firstOrCreate([
                    'student_id' => $student->id,
                    'subject_id' => $subItem['subject_id'],
                    'academic_year_id' => $validated['academic_year_id'],
                    'semester_id' => $validated['semester_id'],
                ], [
                    'enrollment_id' => $enrollment->id,
                    'teacher_id' => $subItem['teacher_id'] ?? null,
                    'remarks' => 'Pending',
                ]);
            }

            ActivityLog::log('Enrolled Student', "Enrolled student {$student->full_name} ({$student->student_id}) with " . count($validated['subjects']) . " subject(s).");
        });

        return redirect()->route('enrollments.index')->with('success', 'Enrollment completed successfully.');
    }

    public function show(Enrollment $enrollment): Response
    {
        $enrollment->load([
            'student.user',
            'academicYear',
            'semester',
            'program',
            'section',
            'enrollmentSubjects.subject',
            'enrollmentSubjects.teacher',
        ]);

        return Inertia::render('enrollments/show', [
            'enrollment' => $enrollment,
        ]);
    }

    public function edit(Enrollment $enrollment): Response
    {
        $enrollment->load(['enrollmentSubjects']);

        $academicYears = AcademicYear::latest()->get();
        $semesters = Semester::get();
        $programs = Program::where('status', 'active')->get();
        $sections = Section::where('status', 'active')->get();
        $subjects = Subject::where('status', 'active')->get();
        $teachers = Teacher::where('status', 'active')->get();

        return Inertia::render('enrollments/edit', [
            'enrollment' => $enrollment,
            'academicYears' => $academicYears,
            'semesters' => $semesters,
            'programs' => $programs,
            'sections' => $sections,
            'subjects' => $subjects,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Enrollment $enrollment): RedirectResponse
    {
        $validated = $request->validate([
            'section_id' => ['nullable', 'exists:sections,id'],
            'status' => ['required', 'string', 'in:enrolled,pending,dropped,completed'],
            'remarks' => ['nullable', 'string'],
            'subjects' => ['required', 'array', 'min:1'],
            'subjects.*.subject_id' => ['required', 'exists:subjects,id', 'distinct'],
            'subjects.*.teacher_id' => ['nullable', 'exists:teachers,id'],
        ]);

        DB::transaction(function () use ($validated, $enrollment) {
            $enrollment->update([
                'section_id' => $validated['section_id'] ?? null,
                'status' => $validated['status'],
                'remarks' => $validated['remarks'] ?? null,
            ]);

            // Sync enrollment subjects
            $existingSubjects = $enrollment->enrollmentSubjects->pluck('subject_id')->toArray();
            $newSubjectIds = collect($validated['subjects'])->pluck('subject_id')->toArray();

            // Remove unselected subjects
            $toDelete = array_diff($existingSubjects, $newSubjectIds);
            EnrollmentSubject::where('enrollment_id', $enrollment->id)->whereIn('subject_id', $toDelete)->delete();

            // Insert or update subjects
            foreach ($validated['subjects'] as $subItem) {
                EnrollmentSubject::updateOrCreate(
                    [
                        'enrollment_id' => $enrollment->id,
                        'subject_id' => $subItem['subject_id'],
                    ],
                    [
                        'teacher_id' => $subItem['teacher_id'] ?? null,
                    ]
                );

                // Ensure grade record exists
                Grade::firstOrCreate([
                    'student_id' => $enrollment->student_id,
                    'subject_id' => $subItem['subject_id'],
                    'academic_year_id' => $enrollment->academic_year_id,
                    'semester_id' => $enrollment->semester_id,
                ], [
                    'enrollment_id' => $enrollment->id,
                    'teacher_id' => $subItem['teacher_id'] ?? null,
                    'remarks' => 'Pending',
                ]);
            }

            ActivityLog::log('Updated Enrollment', "Updated enrollment #{$enrollment->id} for student #{$enrollment->student_id}.");
        });

        return redirect()->route('enrollments.show', $enrollment->id)->with('success', 'Enrollment updated successfully.');
    }

    public function destroy(Enrollment $enrollment): RedirectResponse
    {
        $enrollment->update(['status' => 'dropped']);
        ActivityLog::log('Dropped Enrollment', "Marked enrollment #{$enrollment->id} as dropped.");

        return redirect()->route('enrollments.index')->with('success', 'Enrollment marked as dropped.');
    }
}

