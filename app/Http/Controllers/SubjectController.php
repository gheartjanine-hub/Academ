<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Program;
use App\Models\Subject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $programId = $request->input('program_id');
        $yearLevel = $request->input('year_level');
        $semester = $request->input('semester');
        $status = $request->input('status');

        $subjects = Subject::with('program')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($programId, fn ($q) => $q->where('program_id', $programId))
            ->when($yearLevel, fn ($q) => $q->where('year_level', $yearLevel))
            ->when($semester, fn ($q) => $q->where('semester', $semester))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderBy('code')
            ->paginate(10)
            ->withQueryString();

        $programs = Program::where('status', 'active')->get(['id', 'code', 'name']);

        return Inertia::render('subjects/index', [
            'subjects' => $subjects,
            'filters' => [
                'search' => $search,
                'program_id' => $programId,
                'year_level' => $yearLevel,
                'semester' => $semester,
                'status' => $status,
            ],
            'programs' => $programs,
        ]);
    }

    public function create(): Response
    {
        $programs = Program::where('status', 'active')->get(['id', 'code', 'name', 'department']);
        return Inertia::render('subjects/create', [
            'programs' => $programs,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:subjects,code'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'units' => ['required', 'integer', 'min:1', 'max:12'],
            'program_id' => ['nullable', 'exists:programs,id'],
            'department' => ['nullable', 'string', 'max:100'],
            'year_level' => ['nullable', 'string', 'max:50'],
            'semester' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $subject = Subject::create($validated);

        ActivityLog::log('Added Subject', "Created subject {$subject->code} - {$subject->name}.");

        return redirect()->route('subjects.index')->with('success', 'Subject created successfully.');
    }

    public function show(Subject $subject): Response
    {
        $subject->load(['program', 'enrollmentSubjects.enrollment.student', 'enrollmentSubjects.teacher']);

        return Inertia::render('subjects/show', [
            'subject' => $subject,
            'enrolledStudents' => $subject->enrollmentSubjects->map(fn ($es) => [
                'studentId' => $es->enrollment?->student?->student_id,
                'name' => $es->enrollment?->student?->full_name,
                'section' => $es->enrollment?->section?->name ?? 'N/A',
                'teacher' => $es->teacher?->full_name ?? 'Unassigned',
                'status' => $es->enrollment?->status,
            ]),
        ]);
    }

    public function edit(Subject $subject): Response
    {
        $programs = Program::where('status', 'active')->get(['id', 'code', 'name', 'department']);

        return Inertia::render('subjects/edit', [
            'subject' => $subject,
            'programs' => $programs,
        ]);
    }

    public function update(Request $request, Subject $subject): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', Rule::unique('subjects')->ignore($subject->id)],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'units' => ['required', 'integer', 'min:1', 'max:12'],
            'program_id' => ['nullable', 'exists:programs,id'],
            'department' => ['nullable', 'string', 'max:100'],
            'year_level' => ['nullable', 'string', 'max:50'],
            'semester' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $subject->update($validated);

        ActivityLog::log('Updated Subject', "Updated subject {$subject->code} - {$subject->name}.");

        return redirect()->route('subjects.index')->with('success', 'Subject updated successfully.');
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $subject->update(['status' => 'inactive']);

        ActivityLog::log('Deactivated Subject', "Deactivated subject {$subject->code} - {$subject->name}.");

        return redirect()->route('subjects.index')->with('success', "Subject {$subject->code} deactivated successfully.");
    }
}

