<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ActivityLog;
use App\Models\Enrollment;
use App\Models\Program;
use App\Models\Section;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // If student, forward to student-portal dashboard or include student-specific props
        if ($user->isStudent() && $user->student) {
            return $this->studentDashboard($user->student);
        }

        // If teacher, forward to teacher dashboard
        if ($user->isTeacher() && $user->teacher) {
            return $this->teacherDashboard($user->teacher);
        }

        // Administrator and Registrar Dashboard
        $activeAy = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        $stats = [
            'totalStudents' => Student::count(),
            'totalTeachers' => Teacher::count(),
            'totalSubjects' => Subject::count(),
            'totalSections' => Section::count(),
            'totalPrograms' => Program::count(),
            'totalEnrolled' => $activeAy && $activeSem 
                ? Enrollment::where('academic_year_id', $activeAy->id)
                    ->where('semester_id', $activeSem->id)
                    ->where('status', 'enrolled')
                    ->count()
                : Enrollment::where('status', 'enrolled')->count(),
            'activeAcademicYear' => $activeAy?->name ?? 'None Set',
            'activeSemester' => $activeSem?->name ?? 'None Set',
        ];

        $recentActivities = ActivityLog::with('user:id,name,role')
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'userName' => $log->user?->name ?? 'System',
                'userRole' => $log->user?->role ?? 'admin',
                'createdAt' => $log->created_at->diffForHumans(),
            ]);

        $recentEnrollments = Enrollment::with(['student', 'program', 'section', 'academicYear', 'semester'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($enr) => [
                'id' => $enr->id,
                'studentId' => $enr->student?->student_id,
                'studentName' => $enr->student?->full_name,
                'program' => $enr->program?->code,
                'yearLevel' => $enr->year_level,
                'section' => $enr->section?->name ?? 'Unassigned',
                'status' => $enr->status,
                'date' => $enr->created_at->format('M d, Y'),
            ]);

        return Inertia::render('dashboard/index', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'recentEnrollments' => $recentEnrollments,
        ]);
    }

    private function studentDashboard(Student $student): Response
    {
        $activeAy = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        $currentEnrollment = Enrollment::with(['section', 'academicYear', 'semester', 'enrollmentSubjects.subject', 'enrollmentSubjects.teacher'])
            ->where('student_id', $student->id)
            ->when($activeAy, fn ($q) => $q->where('academic_year_id', $activeAy->id))
            ->when($activeSem, fn ($q) => $q->where('semester_id', $activeSem->id))
            ->first();

        $enrolledSubjectsCount = $currentEnrollment ? $currentEnrollment->enrollmentSubjects->count() : 0;
        $totalUnits = $currentEnrollment ? $currentEnrollment->enrollmentSubjects->sum(fn ($es) => $es->subject?->units ?? 0) : 0;

        $grades = $student->grades()
            ->with(['subject', 'academicYear', 'semester'])
            ->latest()
            ->take(6)
            ->get()
            ->map(fn ($g) => [
                'id' => $g->id,
                'subjectCode' => $g->subject?->code,
                'subjectName' => $g->subject?->name,
                'units' => $g->subject?->units,
                'prelim' => $g->prelim_grade,
                'midterm' => $g->midterm_grade,
                'final' => $g->final_grade,
                'rating' => $g->final_rating,
                'remarks' => $g->remarks,
                'term' => "{$g->academicYear?->name} - {$g->semester?->name}",
            ]);

        return Inertia::render('student-portal/dashboard', [
            'student' => [
                'id' => $student->id,
                'studentId' => $student->student_id,
                'name' => $student->full_name,
                'program' => $student->program?->name,
                'programCode' => $student->program?->code,
                'yearLevel' => $student->year_level,
                'section' => $student->section?->name,
                'status' => $student->status,
            ],
            'currentEnrollment' => $currentEnrollment ? [
                'id' => $currentEnrollment->id,
                'status' => $currentEnrollment->status,
                'academicYear' => $currentEnrollment->academicYear?->name,
                'semester' => $currentEnrollment->semester?->name,
                'section' => $currentEnrollment->section?->name,
                'subjectsCount' => $enrolledSubjectsCount,
                'totalUnits' => $totalUnits,
            ] : null,
            'recentGrades' => $grades,
        ]);
    }

    private function teacherDashboard(Teacher $teacher): Response
    {
        $activeAy = AcademicYear::where('is_active', true)->first();
        $activeSem = Semester::where('is_active', true)->first();

        $assignedSubjects = $teacher->enrollmentSubjects()
            ->with(['subject', 'enrollment.section', 'enrollment.student'])
            ->get()
            ->groupBy('subject_id');

        $sectionsAdvised = $teacher->sections()
            ->with('program')
            ->get()
            ->map(fn ($sec) => [
                'id' => $sec->id,
                'name' => $sec->name,
                'program' => $sec->program?->code,
                'yearLevel' => $sec->year_level,
                'studentCount' => $sec->students()->count(),
            ]);

        return Inertia::render('teacher-portal/dashboard', [
            'teacher' => [
                'id' => $teacher->id,
                'teacherId' => $teacher->teacher_id,
                'name' => $teacher->full_name,
                'department' => $teacher->department,
                'status' => $teacher->status,
            ],
            'stats' => [
                'assignedSubjectsCount' => $assignedSubjects->count(),
                'sectionsAdvisedCount' => $sectionsAdvised->count(),
                'activeAcademicYear' => $activeAy?->name ?? 'None Set',
                'activeSemester' => $activeSem?->name ?? 'None Set',
            ],
            'sectionsAdvised' => $sectionsAdvised,
        ]);
    }
}

