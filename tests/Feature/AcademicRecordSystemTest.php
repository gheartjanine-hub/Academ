<?php

use App\Models\AcademicYear;
use App\Models\Enrollment;
use App\Models\EnrollmentSubject;
use App\Models\Grade;
use App\Models\GradingSetting;
use App\Models\Program;
use App\Models\Section;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

use Illuminate\Foundation\Testing\RefreshDatabase;

beforeEach(function () {
    // Run seeders for in-memory testing
    $this->seed();
    GradingSetting::getSettings();
});

test('guest is redirected to login from protected dashboard', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('administrator can login and view dashboard', function () {
    $admin = User::where('email', 'admin@acadease.com')->first();
    if (!$admin) {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@acadease.com',
            'password' => Hash::make('password'),
            'role' => 'administrator',
            'status' => 'active',
        ]);
    }

    $response = $this->actingAs($admin)->get(route('dashboard'));
    $response->assertOk();
});

test('grade model computes correct rating and remarks based on grading settings', function () {
    $setting = GradingSetting::getSettings();
    $setting->update([
        'passing_grade' => 75.00,
        'prelim_weight' => 30.00,
        'midterm_weight' => 30.00,
        'final_weight' => 40.00,
    ]);

    $student = Student::first();
    $subject = Subject::first();
    $ay = AcademicYear::first();
    $sem = Semester::first();

    $grade = new Grade([
        'student_id' => $student->id,
        'subject_id' => $subject->id,
        'academic_year_id' => $ay->id,
        'semester_id' => $sem->id,
        'prelim_grade' => 80.00,
        'midterm_grade' => 85.00,
        'final_grade' => 90.00,
    ]);

    // 80*0.3 + 85*0.3 + 90*0.4 = 24 + 25.5 + 36 = 85.5
    $grade->computeGrade();

    expect((float)$grade->final_rating)->toEqual(85.5)
        ->and($grade->remarks)->toBe('Passed');

    // Test failing condition
    $grade->prelim_grade = 60.00;
    $grade->midterm_grade = 65.00;
    $grade->final_grade = 70.00;
    // 60*0.3 + 65*0.3 + 70*0.4 = 18 + 19.5 + 28 = 65.5
    $grade->computeGrade();

    expect((float)$grade->final_rating)->toEqual(65.5)
        ->and($grade->remarks)->toBe('Failed');
});

test('student cannot view another student academic record', function () {
    $students = Student::with('user')->get();
    if ($students->count() >= 2) {
        $student1 = $students[0];
        $student2 = $students[1];

        if ($student1->user) {
            $response = $this->actingAs($student1->user)->get(route('academic-records.show', $student2->id));
            $response->assertForbidden();
        }
    }
});

test('student can view their own academic record', function () {
    $student = Student::with('user')->first();
    if ($student && $student->user) {
        $response = $this->actingAs($student->user)->get(route('academic-records.show', $student->id));
        $response->assertOk();
    }
});

test('administrator can access student management and reports', function () {
    $admin = User::where('role', 'administrator')->first();
    if ($admin) {
        $response = $this->actingAs($admin)->get(route('students.index'));
        $response->assertOk();

        $response = $this->actingAs($admin)->get(route('reports.index'));
        $response->assertOk();

        $response = $this->actingAs($admin)->get(route('academic-years.index'));
        $response->assertOk();
    }
});
