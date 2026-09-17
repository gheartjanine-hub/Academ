<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProgramController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $programs = Program::withCount(['students', 'subjects', 'sections'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('department', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderBy('code')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('programs/index', [
            'programs' => $programs,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('programs/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:programs,code'],
            'name' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $program = Program::create($validated);

        ActivityLog::log('Added Program', "Created program {$program->code} ({$program->name}).");

        return redirect()->route('programs.index')->with('success', 'Program created successfully.');
    }

    public function edit(Program $program): Response
    {
        return Inertia::render('programs/edit', [
            'program' => $program,
        ]);
    }

    public function update(Request $request, Program $program): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', Rule::unique('programs')->ignore($program->id)],
            'name' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ]);

        $program->update($validated);

        ActivityLog::log('Updated Program', "Updated program {$program->code}.");

        return redirect()->route('programs.index')->with('success', 'Program updated successfully.');
    }

    public function destroy(Program $program): RedirectResponse
    {
        $program->update(['status' => 'inactive']);

        ActivityLog::log('Deactivated Program', "Deactivated program {$program->code}.");

        return redirect()->route('programs.index')->with('success', "Program {$program->code} deactivated successfully.");
    }
}

