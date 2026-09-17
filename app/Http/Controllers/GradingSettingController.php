<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\GradingSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GradingSettingController extends Controller
{
    public function edit(): Response
    {
        $settings = GradingSetting::getSettings();

        return Inertia::render('settings/grading', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'passing_grade' => ['required', 'numeric', 'min:50', 'max:100'],
            'prelim_weight' => ['required', 'numeric', 'min:0', 'max:100'],
            'midterm_weight' => ['required', 'numeric', 'min:0', 'max:100'],
            'final_weight' => ['required', 'numeric', 'min:0', 'max:100'],
            'grading_system' => ['required', 'string', 'in:percentage,point'],
        ]);

        $totalWeight = $validated['prelim_weight'] + $validated['midterm_weight'] + $validated['final_weight'];
        if (abs($totalWeight - 100) > 0.01) {
            return back()->withErrors([
                'weights' => 'The sum of prelim, midterm, and final weights must equal 100%. Current sum: ' . $totalWeight . '%.',
            ])->withInput();
        }

        $settings = GradingSetting::getSettings();
        $settings->update($validated);

        ActivityLog::log('Updated Grading Settings', "Passing grade updated to {$settings->passing_grade}%. Prelim: {$settings->prelim_weight}%, Midterm: {$settings->midterm_weight}%, Final: {$settings->final_weight}%.");

        return back()->with('success', 'Grading configuration saved successfully.');
    }
}

