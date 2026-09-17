<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ActivityLog;
use App\Models\Program;
use App\Models\Section;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $programId = $request->input('program_id');
        $yearLevel = $request->input('year_level');

        $sections = Section::with(['program', 'academicYear', 'adviser'])
            ->withCount('students')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($programId, fn ($q) => $q->where('program_id', $programId))
            ->when($yearLevel, fn ($q) => $q->where('year_level', $yearLevel))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $programs = Program::where('status', 'active')->get(['id', 'code', 'name']);

        return Inertia::render('sections/index', [
            'sections' => $sections,
            'filters' => [
                'search' => $search,
                'program_id' => $programId,
                'year_level' => $yearLevel,
            ],
            'programs' => $programs,
        ]);
    }

    public function create(): Response
    {
        $programs = Program::where('status', 'active')->get();
        $academicYears = AcademicYear::latest()->get();
        $teachers = Teacher::where('status', 'active')->get();

        return Inertia::render('sections/create', [
            'programs' => $programs,
            'academicYears' => $academicYears,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'program_id' => ['required', 'exists:programs,id'],
            'year_level' => ['required', 'string', 'max:50'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'adviser_id' => ['nullable', 'exists:teachers,id'],
            'max_students' => ['required', 'integer', 'min:5', 'max:100'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $section = Section::create($validated);

        ActivityLog::log('Added Section', "Created section {$section->name}.");

        return redirect()->route('sections.index')->with('success', 'Section created successfully.');
    }

    public function show(Section $section): Response
    {
        $section->load(['program', 'academicYear', 'adviser', 'students' => function ($q) {
            $q->orderBy('last_name');
        }]);

        return Inertia::render('sections/show', [
            'section' => $section,
            'students' => $section->students->map(fn ($s) => [
                'id' => $s->id,
                'studentId' => $s->student_id,
                'name' => $s->full_name,
                'email' => $s->email,
                'gender' => $s->gender,
                'status' => $s->status,
            ]),
        ]);
    }

    public function edit(Section $section): Response
    {
        $programs = Program::where('status', 'active')->get();
        $academicYears = AcademicYear::latest()->get();
        $teachers = Teacher::where('status', 'active')->get();

        return Inertia::render('sections/edit', [
            'section' => $section,
            'programs' => $programs,
            'academicYears' => $academicYears,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Section $section): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'program_id' => ['required', 'exists:programs,id'],
            'year_level' => ['required', 'string', 'max:50'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'adviser_id' => ['nullable', 'exists:teachers,id'],
            'max_students' => ['required', 'integer', 'min:5', 'max:100'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $section->update($validated);

        ActivityLog::log('Updated Section', "Updated section {$section->name}.");

        return redirect()->route('sections.index')->with('success', 'Section updated successfully.');
    }

    public function destroy(Section $section): RedirectResponse
    {
        $section->update(['status' => 'inactive']);

        ActivityLog::log('Deactivated Section', "Deactivated section {$section->name}.");

        return redirect()->route('sections.index')->with('success', "Section {$section->name} deactivated successfully.");
    }
}

