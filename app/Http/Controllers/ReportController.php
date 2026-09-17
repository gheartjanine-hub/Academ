<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Program;
use App\Models\Section;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $reportType = $request->input('report_type', 'student_list');
        $academicYearId = $request->input('academic_year_id');
        $semesterId = $request->input('semester_id');
        $programId = $request->input('program_id');
        $yearLevel = $request->input('year_level');
        $sectionId = $request->input('section_id');
        $studentId = $request->input('student_id');

        $reportData = [];

        switch ($reportType) {
            case 'student_list':
                $reportData = Student::with(['program', 'section', 'academicYear'])
                    ->when($programId, fn ($q) => $q->where('program_id', $programId))
                    ->when($yearLevel, fn ($q) => $q->where('year_level', $yearLevel))
                    ->when($sectionId, fn ($q) => $q->where('section_id', $sectionId))
                    ->orderBy('last_name')
                    ->get();
                break;

            case 'subject_list':
                $reportData = Subject::with('program')
                    ->when($programId, fn ($q) => $q->where('program_id', $programId))
                    ->when($yearLevel, fn ($q) => $q->where('year_level', $yearLevel))
                    ->orderBy('code')
                    ->get();
                break;

            case 'teacher_list':
                $reportData = Teacher::withCount(['sections', 'enrollmentSubjects'])
                    ->orderBy('last_name')
                    ->get();
                break;

            case 'enrollment_report':
                $reportData = Enrollment::with(['student.program', 'section', 'academicYear', 'semester'])
                    ->when($academicYearId, fn ($q) => $q->where('academic_year_id', $academicYearId))
                    ->when($semesterId, fn ($q) => $q->where('semester_id', $semesterId))
                    ->when($programId, fn ($q) => $q->where('program_id', $programId))
                    ->when($yearLevel, fn ($q) => $q->where('year_level', $yearLevel))
                    ->when($sectionId, fn ($q) => $q->where('section_id', $sectionId))
                    ->latest()
                    ->get();
                break;

            case 'grade_report':
            case 'class_grade_report':
                $reportData = Grade::with(['student.program', 'subject', 'teacher', 'academicYear', 'semester'])
                    ->when($academicYearId, fn ($q) => $q->where('academic_year_id', $academicYearId))
                    ->when($semesterId, fn ($q) => $q->where('semester_id', $semesterId))
                    ->when($studentId, fn ($q) => $q->where('student_id', $studentId))
                    ->when($sectionId, function ($q) use ($sectionId) {
                        $q->whereHas('student', fn ($sq) => $sq->where('section_id', $sectionId));
                    })
                    ->when($programId, function ($q) use ($programId) {
                        $q->whereHas('student', fn ($sq) => $sq->where('program_id', $programId));
                    })
                    ->latest()
                    ->get();
                break;

            case 'academic_record':
                if ($studentId) {
                    $student = Student::with(['program', 'section', 'academicYear'])->find($studentId);
                    $grades = Grade::with(['subject', 'academicYear', 'semester', 'teacher'])
                        ->where('student_id', $studentId)
                        ->get();
                    $reportData = [
                        'student' => $student,
                        'grades' => $grades,
                    ];
                }
                break;
        }

        $academicYears = AcademicYear::latest()->get();
        $semesters = Semester::get();
        $programs = Program::where('status', 'active')->get();
        $sections = Section::where('status', 'active')->get();
        $students = Student::where('status', 'active')->get(['id', 'student_id', 'first_name', 'last_name']);

        return Inertia::render('reports/index', [
            'reportType' => $reportType,
            'reportData' => $reportData,
            'filters' => [
                'academic_year_id' => $academicYearId,
                'semester_id' => $semesterId,
                'program_id' => $programId,
                'year_level' => $yearLevel,
                'section_id' => $sectionId,
                'student_id' => $studentId,
            ],
            'academicYears' => $academicYears,
            'semesters' => $semesters,
            'programs' => $programs,
            'sections' => $sections,
            'students' => $students,
        ]);
    }

    public function printView(Request $request)
    {
        $reportType = $request->input('report_type', 'student_list');
        // printable view helper
        return $this->index($request);
    }
}

