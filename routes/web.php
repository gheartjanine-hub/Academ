<?php

use App\Http\Controllers\AcademicRecordController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\GradingSettingController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentPortalController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherPortalController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - AcadEase Academic Record Management System
|--------------------------------------------------------------------------
*/

// Authentication
Route::get('/', [AuthController::class, 'showLogin'])->name('home');
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    // Universal Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Administrator & Registrar Shared Modules
    Route::middleware(['role:admin,administrator,registrar'])->group(function () {
        // Student Management
        Route::resource('students', StudentController::class);

        // Teacher Management
        Route::resource('teachers', TeacherController::class);

        // Subject Management
        Route::resource('subjects', SubjectController::class);

        // Program Management
        Route::resource('programs', ProgramController::class)->except(['show']);

        // Section Management
        Route::resource('sections', SectionController::class);

        // Enrollment Management
        Route::resource('enrollments', EnrollmentController::class);

        // Reports
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

        // Academic Year & Semester
        Route::get('/academic-years', [AcademicYearController::class, 'index'])->name('academic-years.index');
        Route::post('/academic-years', [AcademicYearController::class, 'store'])->name('academic-years.store');
        Route::put('/academic-years/{academicYear}', [AcademicYearController::class, 'update'])->name('academic-years.update');
        Route::post('/academic-years/{academicYear}/set-active', [AcademicYearController::class, 'setActive'])->name('academic-years.set-active');
        Route::post('/semesters/{semester}/set-active', [AcademicYearController::class, 'setActiveSemester'])->name('semesters.set-active');
    });

    // Academic Records / Grades (Admin, Registrar, Teacher)
    Route::middleware(['role:admin,administrator,registrar,teacher'])->group(function () {
        Route::get('/grades', [GradeController::class, 'index'])->name('grades.index');
        Route::put('/grades/{grade}', [GradeController::class, 'update'])->name('grades.update');
        Route::post('/grades/batch-update', [GradeController::class, 'batchUpdate'])->name('grades.batch-update');
    });

    // Student Academic Record (Admin, Registrar, or the student viewing own record)
    Route::get('/students/{student}/academic-record', [AcademicRecordController::class, 'show'])->name('academic-records.show');

    // Administrator-Only Modules
    Route::middleware(['role:admin,administrator'])->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
        Route::get('/settings/grading', [GradingSettingController::class, 'edit'])->name('settings.grading');
        Route::post('/settings/grading', [GradingSettingController::class, 'update'])->name('settings.grading.update');
    });

    // Student Portal Routes (Protected to Student role)
    Route::middleware(['role:student'])->prefix('student')->name('student.')->group(function () {
        Route::get('/profile', [StudentPortalController::class, 'profile'])->name('profile');
        Route::get('/subjects', [StudentPortalController::class, 'subjects'])->name('subjects');
        Route::get('/grades', [StudentPortalController::class, 'grades'])->name('grades');
        Route::get('/history', [StudentPortalController::class, 'history'])->name('history');
    });

    // Teacher Portal Routes (Protected to Teacher role)
    Route::middleware(['role:teacher'])->prefix('teacher')->name('teacher.')->group(function () {
        Route::get('/classes', [TeacherPortalController::class, 'classes'])->name('classes');
        Route::get('/grades/subject/{subjectId}', [TeacherPortalController::class, 'gradeEntry'])->name('grade-entry');
    });
});
