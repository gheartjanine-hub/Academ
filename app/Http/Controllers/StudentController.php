<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ActivityLog;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Program;
use App\Models\Section;
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $programId = $request->input('program_id');
        $yearLevel = $request->input('year_level');
        $status = $request->input('status');
        $sectionId = $request->input('section_id');

        $students = Student::with(['program', 'section', 'academicYear'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('student_id', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($programId, fn ($q) => $q->where('program_id', $programId))
            ->when($yearLevel, fn ($q) => $q->where('year_level', $yearLevel))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($sectionId, fn ($q) => $q->where('section_id', $sectionId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $programs = Program::where('status', 'active')->get(['id', 'code', 'name']);
        $sections = Section::where('status', 'active')->get(['id', 'name', 'program_id', 'year_level']);

        return Inertia::render('students/index', [
            'students' => $students,
            'filters' => [
                'search' => $search,
                'program_id' => $programId,
                'year_level' => $yearLevel,
                'status' => $status,
                'section_id' => $sectionId,
            ],
            'programs' => $programs,
            'sections' => $sections,
        ]);
    }

    public function create(): Response
    {
        $programs = Program::where('status', 'active')->get();
        $sections = Section::where('status', 'active')->get();
        $academicYears = AcademicYear::latest()->get();

        return Inertia::render('students/create', [
            'programs' => $programs,
            'sections' => $sections,
            'academicYears' => $academicYears,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'string', 'max:50', 'unique:students,student_id'],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'suffix' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:Male,Female,Other'],
            'address' => ['nullable', 'string'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255', 'unique:students,email', 'unique:users,email'],
            'program_id' => ['nullable', 'exists:programs,id'],
            'year_level' => ['nullable', 'string'],
            'section_id' => ['nullable', 'exists:sections,id'],
            'academic_year_id' => ['nullable', 'exists:academic_years,id'],
            'status' => ['required', 'string', 'in:active,inactive,graduated,dropped'],
            'create_user_account' => ['nullable', 'boolean'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        DB::transaction(function () use ($validated, $request) {
            $userId = null;

            if ($request->boolean('create_user_account')) {
                $user = User::create([
                    'name' => trim("{$validated['first_name']} {$validated['last_name']}"),
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password'] ?? 'student123'),
                    'role' => 'student',
                    'status' => $validated['status'] === 'active' ? 'active' : 'inactive',
                ]);
                $userId = $user->id;
            }

            $validated['user_id'] = $userId;
            unset($validated['create_user_account'], $validated['password']);

            $student = Student::create($validated);

            ActivityLog::log('Added Student', "Created student record for {$student->full_name} ({$student->student_id}).");
        });

        return redirect()->route('students.index')->with('success', 'Student created successfully.');
    }

    public function show(Student $student): Response
    {
        $student->load(['program', 'section', 'academicYear', 'user']);

        // Tab: Enrollment Information
        $enrollments = Enrollment::with(['academicYear', 'semester', 'program', 'section', 'enrollmentSubjects.subject', 'enrollmentSubjects.teacher'])
            ->where('student_id', $student->id)
            ->latest()
            ->get();

        // Tab: Grades & Academic History
        $grades = Grade::with(['subject', 'teacher', 'academicYear', 'semester'])
            ->where('student_id', $student->id)
            ->get();

        // Organize grades by academic year and semester
        $groupedGrades = $grades->groupBy(function ($grade) {
            return "{$grade->academicYear?->name} - {$grade->semester?->name}";
        })->map(function ($items, $term) {
            $totalUnits = $items->sum(fn ($g) => $g->subject?->units ?? 0);
            $gradedItems = $items->filter(fn ($g) => $g->final_rating !== null);
            $avgGrade = $gradedItems->count() > 0 
                ? round($gradedItems->avg('final_rating'), 2) 
                : null;

            return [
                'term' => $term,
                'totalUnits' => $totalUnits,
                'averageGrade' => $avgGrade,
                'grades' => $items->map(fn ($g) => [
                    'id' => $g->id,
                    'subjectCode' => $g->subject?->code,
                    'subjectName' => $g->subject?->name,
                    'units' => $g->subject?->units,
                    'teacher' => $g->teacher?->full_name ?? 'N/A',
                    'prelim' => $g->prelim_grade,
                    'midterm' => $g->midterm_grade,
                    'final' => $g->final_grade,
                    'rating' => $g->final_rating,
                    'remarks' => $g->remarks,
                ]),
            ];
        });

        // Calculate Overall GPA / General Average
        $allGraded = $grades->filter(fn ($g) => $g->final_rating !== null);
        $totalEarnedUnits = $grades->where('remarks', 'Passed')->sum(fn ($g) => $g->subject?->units ?? 0);
        $overallAverage = $allGraded->count() > 0 ? round($allGraded->avg('final_rating'), 2) : null;

        return Inertia::render('students/show', [
            'student' => [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'first_name' => $student->first_name,
                'middle_name' => $student->middle_name,
                'last_name' => $student->last_name,
                'suffix' => $student->suffix,
                'full_name' => $student->full_name,
                'email' => $student->email,
                'contact_number' => $student->contact_number,
                'gender' => $student->gender,
                'date_of_birth' => $student->date_of_birth?->format('Y-m-d'),
                'address' => $student->address,
                'year_level' => $student->year_level,
                'status' => $student->status,
                'program' => $student->program,
                'section' => $student->section,
                'academic_year' => $student->academicYear,
                'user' => $student->user,
            ],
            'enrollments' => $enrollments,
            'groupedGrades' => $groupedGrades,
            'academicSummary' => [
                'totalSubjects' => $grades->count(),
                'totalPassed' => $grades->where('remarks', 'Passed')->count(),
                'totalFailed' => $grades->where('remarks', 'Failed')->count(),
                'totalEarnedUnits' => $totalEarnedUnits,
                'overallAverage' => $overallAverage,
            ],
        ]);
    }

    public function edit(Student $student): Response
    {
        $programs = Program::where('status', 'active')->get();
        $sections = Section::where('status', 'active')->get();
        $academicYears = AcademicYear::latest()->get();

        return Inertia::render('students/edit', [
            'student' => $student,
            'programs' => $programs,
            'sections' => $sections,
            'academicYears' => $academicYears,
        ]);
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'string', 'max:50', Rule::unique('students')->ignore($student->id)],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'suffix' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:Male,Female,Other'],
            'address' => ['nullable', 'string'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255', Rule::unique('students')->ignore($student->id)],
            'program_id' => ['nullable', 'exists:programs,id'],
            'year_level' => ['nullable', 'string'],
            'section_id' => ['nullable', 'exists:sections,id'],
            'academic_year_id' => ['nullable', 'exists:academic_years,id'],
            'status' => ['required', 'string', 'in:active,inactive,graduated,dropped'],
        ]);

        $student->update($validated);

        if ($student->user) {
            $student->user->update([
                'name' => trim("{$student->first_name} {$student->last_name}"),
                'email' => $student->email,
                'status' => $student->status === 'active' ? 'active' : 'inactive',
            ]);
        }

        ActivityLog::log('Updated Student', "Updated student profile for {$student->full_name} ({$student->student_id}).");

        return redirect()->route('students.show', $student->id)->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student): RedirectResponse
    {
        $name = $student->full_name;
        $id = $student->student_id;

        // Toggle status to inactive or delete
        $student->update(['status' => 'inactive']);

        if ($student->user) {
            $student->user->update(['status' => 'inactive']);
        }

        ActivityLog::log('Deactivated Student', "Deactivated student {$name} ({$id}).");

        return redirect()->route('students.index')->with('success', "Student {$name} deactivated successfully.");
    }
}

