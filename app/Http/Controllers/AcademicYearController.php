<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ActivityLog;
use App\Models\Semester;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicYearController extends Controller
{
    public function index(): Response
    {
        $academicYears = AcademicYear::with('semesters')
            ->withCount(['enrollments', 'sections'])
            ->latest()
            ->get();

        return Inertia::render('academic-years/index', [
            'academicYears' => $academicYears,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
            'semesters' => ['nullable', 'array'],
        ]);

        if ($request->boolean('is_active')) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        $ay = AcademicYear::create([
            'name' => $validated['name'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'is_active' => $request->boolean('is_active'),
        ]);

        // Default semesters
        $semNames = ['1st Semester', '2nd Semester', 'Summer'];
        foreach ($semNames as $index => $sName) {
            Semester::create([
                'academic_year_id' => $ay->id,
                'name' => $sName,
                'is_active' => $index === 0 && $ay->is_active,
            ]);
        }

        ActivityLog::log('Created Academic Year', "Created academic year {$ay->name}.");

        return redirect()->route('academic-years.index')->with('success', 'Academic Year created successfully.');
    }

    public function update(Request $request, AcademicYear $academicYear): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        $academicYear->update($validated);

        ActivityLog::log('Updated Academic Year', "Updated academic year {$academicYear->name}.");

        return redirect()->route('academic-years.index')->with('success', 'Academic Year updated successfully.');
    }

    public function setActive(AcademicYear $academicYear): RedirectResponse
    {
        AcademicYear::where('is_active', true)->update(['is_active' => false]);
        $academicYear->update(['is_active' => true]);

        ActivityLog::log('Set Active Academic Year', "Set {$academicYear->name} as active academic year.");

        return back()->with('success', "{$academicYear->name} is now the active academic year.");
    }

    public function setActiveSemester(Semester $semester): RedirectResponse
    {
        // Deactivate all semesters under this AY
        Semester::where('academic_year_id', $semester->academic_year_id)->update(['is_active' => false]);
        $semester->update(['is_active' => true]);

        ActivityLog::log('Set Active Semester', "Set {$semester->name} as active semester.");

        return back()->with('success', "{$semester->name} is now the active semester.");
    }
}

