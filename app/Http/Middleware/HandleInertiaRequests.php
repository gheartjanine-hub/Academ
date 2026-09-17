<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $activeAy = \App\Models\AcademicYear::where('is_active', true)->first();
        $activeSem = \App\Models\Semester::where('is_active', true)->first();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'name' => config('app.name', 'AcadEase'),
            'auth' => [
                'user' => $request->user(),
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'avatar' => $user->avatar,
                    'student_id' => $user->student?->id,
                    'teacher_id' => $user->teacher?->id,
                ] : null,
            ],
            'activeAcademicYear' => $activeAy ? [
                'id' => $activeAy->id,
                'name' => $activeAy->name,
            ] : null,
            'activeSemester' => $activeSem ? [
                'id' => $activeSem->id,
                'name' => $activeSem->name,
            ] : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
