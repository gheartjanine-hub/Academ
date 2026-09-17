<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $department = $request->input('department');
        $status = $request->input('status');

        $teachers = Teacher::withCount(['sections', 'enrollmentSubjects'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('teacher_id', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('department', 'like', "%{$search}%");
                });
            })
            ->when($department, fn ($q) => $q->where('department', $department))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $departments = Teacher::whereNotNull('department')->distinct()->pluck('department');

        return Inertia::render('teachers/index', [
            'teachers' => $teachers,
            'filters' => [
                'search' => $search,
                'department' => $department,
                'status' => $status,
            ],
            'departments' => $departments,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('teachers/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'teacher_id' => ['required', 'string', 'max:50', 'unique:teachers,teacher_id'],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:teachers,email', 'unique:users,email'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'department' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'string', 'in:active,inactive'],
            'create_user_account' => ['nullable', 'boolean'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        DB::transaction(function () use ($validated, $request) {
            $userId = null;

            if ($request->boolean('create_user_account')) {
                $user = User::create([
                    'name' => trim("{$validated['first_name']} {$validated['last_name']}"),
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password'] ?? 'teacher123'),
                    'role' => 'teacher',
                    'status' => $validated['status'] === 'active' ? 'active' : 'inactive',
                ]);
                $userId = $user->id;
            }

            $validated['user_id'] = $userId;
            unset($validated['create_user_account'], $validated['password']);

            $teacher = Teacher::create($validated);

            ActivityLog::log('Added Teacher', "Created teacher {$teacher->full_name} ({$teacher->teacher_id}).");
        });

        return redirect()->route('teachers.index')->with('success', 'Teacher added successfully.');
    }

    public function show(Teacher $teacher): Response
    {
        $teacher->load(['sections.program', 'enrollmentSubjects.subject', 'enrollmentSubjects.enrollment.section']);

        $assignedSubjects = $teacher->enrollmentSubjects
            ->groupBy('subject_id')
            ->map(function ($items) {
                $first = $items->first();
                return [
                    'subjectId' => $first->subject_id,
                    'subjectCode' => $first->subject?->code,
                    'subjectName' => $first->subject?->name,
                    'units' => $first->subject?->units,
                    'enrolledCount' => $items->count(),
                ];
            })
            ->values();

        return Inertia::render('teachers/show', [
            'teacher' => $teacher,
            'assignedSubjects' => $assignedSubjects,
            'advisedSections' => $teacher->sections,
        ]);
    }

    public function edit(Teacher $teacher): Response
    {
        return Inertia::render('teachers/edit', [
            'teacher' => $teacher,
        ]);
    }

    public function update(Request $request, Teacher $teacher): RedirectResponse
    {
        $validated = $request->validate([
            'teacher_id' => ['required', 'string', 'max:50', Rule::unique('teachers')->ignore($teacher->id)],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', Rule::unique('teachers')->ignore($teacher->id)],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'department' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $teacher->update($validated);

        if ($teacher->user) {
            $teacher->user->update([
                'name' => trim("{$teacher->first_name} {$teacher->last_name}"),
                'email' => $teacher->email,
                'status' => $teacher->status === 'active' ? 'active' : 'inactive',
            ]);
        }

        ActivityLog::log('Updated Teacher', "Updated teacher record for {$teacher->full_name} ({$teacher->teacher_id}).");

        return redirect()->route('teachers.show', $teacher->id)->with('success', 'Teacher updated successfully.');
    }

    public function destroy(Teacher $teacher): RedirectResponse
    {
        $teacher->update(['status' => 'inactive']);
        if ($teacher->user) {
            $teacher->user->update(['status' => 'inactive']);
        }

        ActivityLog::log('Deactivated Teacher', "Deactivated teacher {$teacher->full_name} ({$teacher->teacher_id}).");

        return redirect()->route('teachers.index')->with('success', "Teacher {$teacher->full_name} deactivated successfully.");
    }
}

