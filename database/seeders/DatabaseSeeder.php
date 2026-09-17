<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ActivityLog;
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
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Grading Configuration
        $gradingSetting = GradingSetting::firstOrCreate([], [
            'passing_grade' => 75.00,
            'prelim_weight' => 30.00,
            'midterm_weight' => 30.00,
            'final_weight' => 40.00,
            'grading_system' => 'percentage',
        ]);

        // 2. Admin User
        $admin = User::firstOrCreate(['email' => 'admin@acadease.com'], [
            'name' => 'System Administrator',
            'password' => Hash::make('password'),
            'role' => 'administrator',
            'status' => 'active',
        ]);

        // 3. Registrar User
        $registrar = User::firstOrCreate(['email' => 'registrar@acadease.com'], [
            'name' => 'Jane Miller (Registrar)',
            'password' => Hash::make('password'),
            'role' => 'registrar',
            'status' => 'active',
        ]);

        // 4. Academic Year & Semesters
        $ay2026 = AcademicYear::firstOrCreate(['name' => '2026-2027'], [
            'start_date' => '2026-08-01',
            'end_date' => '2027-05-31',
            'is_active' => true,
        ]);

        $sem1 = Semester::firstOrCreate(['academic_year_id' => $ay2026->id, 'name' => '1st Semester'], [
            'is_active' => true,
        ]);
        $sem2 = Semester::firstOrCreate(['academic_year_id' => $ay2026->id, 'name' => '2nd Semester'], [
            'is_active' => false,
        ]);
        $semSummer = Semester::firstOrCreate(['academic_year_id' => $ay2026->id, 'name' => 'Summer'], [
            'is_active' => false,
        ]);

        // 5. Academic Programs
        $programsData = [
            [
                'code' => 'BSIT',
                'name' => 'Bachelor of Science in Information Technology',
                'department' => 'College of Computer Studies',
                'description' => 'Focuses on the study of computer systems, networks, database systems, and web and software development.',
                'status' => 'active',
            ],
            [
                'code' => 'BSCS',
                'name' => 'Bachelor of Science in Computer Science',
                'department' => 'College of Computer Studies',
                'description' => 'Emphasizes mathematical algorithms, data structures, software architecture, and artificial intelligence.',
                'status' => 'active',
            ],
            [
                'code' => 'BSIS',
                'name' => 'Bachelor of Science in Information Systems',
                'department' => 'College of Computer Studies',
                'description' => 'Combines technology, business management, systems analysis, and enterprise resource planning.',
                'status' => 'active',
            ],
            [
                'code' => 'BSBA',
                'name' => 'Bachelor of Science in Business Administration',
                'department' => 'College of Business and Accountancy',
                'description' => 'Prepares graduates for corporate leadership, finance, operations, and marketing management.',
                'status' => 'active',
            ],
        ];

        $programs = [];
        foreach ($programsData as $p) {
            $programs[$p['code']] = Program::firstOrCreate(['code' => $p['code']], $p);
        }

        // 6. Teachers with User Accounts
        $teachersData = [
            [
                'teacher_id' => 'TCH-2026-001',
                'first_name' => 'Robert',
                'middle_name' => 'Alexander',
                'last_name' => 'Santos',
                'email' => 'robert.santos@acadease.com',
                'contact_number' => '+63 917 123 4567',
                'department' => 'College of Computer Studies',
            ],
            [
                'teacher_id' => 'TCH-2026-002',
                'first_name' => 'Maria',
                'middle_name' => 'Elena',
                'last_name' => 'Cruz',
                'email' => 'maria.cruz@acadease.com',
                'contact_number' => '+63 918 234 5678',
                'department' => 'College of Computer Studies',
            ],
            [
                'teacher_id' => 'TCH-2026-003',
                'first_name' => 'David',
                'middle_name' => 'James',
                'last_name' => 'Reyes',
                'email' => 'david.reyes@acadease.com',
                'contact_number' => '+63 919 345 6789',
                'department' => 'College of Computer Studies',
            ],
            [
                'teacher_id' => 'TCH-2026-004',
                'first_name' => 'Sarah',
                'middle_name' => 'Grace',
                'last_name' => 'Fernandez',
                'email' => 'sarah.fernandez@acadease.com',
                'contact_number' => '+63 920 456 7890',
                'department' => 'College of Business and Accountancy',
            ],
        ];

        $teachers = [];
        foreach ($teachersData as $tData) {
            $user = User::firstOrCreate(['email' => $tData['email']], [
                'name' => trim("{$tData['first_name']} {$tData['last_name']}"),
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'status' => 'active',
            ]);

            $teachers[] = Teacher::firstOrCreate(['teacher_id' => $tData['teacher_id']], [
                'user_id' => $user->id,
                'first_name' => $tData['first_name'],
                'middle_name' => $tData['middle_name'],
                'last_name' => $tData['last_name'],
                'email' => $tData['email'],
                'contact_number' => $tData['contact_number'],
                'department' => $tData['department'],
                'status' => 'active',
            ]);
        }

        // 7. Sections
        $sectionsData = [
            [
                'name' => 'BSIT-1A',
                'program_id' => $programs['BSIT']->id,
                'year_level' => '1st Year',
                'academic_year_id' => $ay2026->id,
                'adviser_id' => $teachers[0]->id,
                'max_students' => 40,
                'status' => 'active',
            ],
            [
                'name' => 'BSIT-2A',
                'program_id' => $programs['BSIT']->id,
                'year_level' => '2nd Year',
                'academic_year_id' => $ay2026->id,
                'adviser_id' => $teachers[1]->id,
                'max_students' => 40,
                'status' => 'active',
            ],
            [
                'name' => 'BSCS-1A',
                'program_id' => $programs['BSCS']->id,
                'year_level' => '1st Year',
                'academic_year_id' => $ay2026->id,
                'adviser_id' => $teachers[2]->id,
                'max_students' => 35,
                'status' => 'active',
            ],
        ];

        $sections = [];
        foreach ($sectionsData as $sData) {
            $sections[$sData['name']] = Section::firstOrCreate(['name' => $sData['name'], 'academic_year_id' => $ay2026->id], $sData);
        }

        // 8. Subjects
        $subjectsData = [
            [
                'code' => 'IT101',
                'name' => 'Introduction to Computing',
                'description' => 'Fundamental concepts of computer systems, architecture, and technology.',
                'units' => 3,
                'program_id' => $programs['BSIT']->id,
                'department' => 'College of Computer Studies',
                'year_level' => '1st Year',
                'semester' => '1st Semester',
                'status' => 'active',
            ],
            [
                'code' => 'IT102',
                'name' => 'Computer Programming 1',
                'description' => 'Problem solving, procedural programming logic, syntax, and control structures.',
                'units' => 3,
                'program_id' => $programs['BSIT']->id,
                'department' => 'College of Computer Studies',
                'year_level' => '1st Year',
                'semester' => '1st Semester',
                'status' => 'active',
            ],
            [
                'code' => 'IT103',
                'name' => 'Discrete Mathematics',
                'description' => 'Sets, functions, relations, propositional logic, and proof techniques.',
                'units' => 3,
                'program_id' => $programs['BSIT']->id,
                'department' => 'College of Computer Studies',
                'year_level' => '1st Year',
                'semester' => '1st Semester',
                'status' => 'active',
            ],
            [
                'code' => 'GE101',
                'name' => 'Understanding the Self',
                'description' => 'Nature of identity, factors and forces that affect personal development.',
                'units' => 3,
                'program_id' => $programs['BSIT']->id,
                'department' => 'General Education',
                'year_level' => '1st Year',
                'semester' => '1st Semester',
                'status' => 'active',
            ],
            [
                'code' => 'IT201',
                'name' => 'Data Structures and Algorithms',
                'description' => 'Arrays, linked lists, stacks, queues, trees, graphs, sorting, and search.',
                'units' => 3,
                'program_id' => $programs['BSIT']->id,
                'department' => 'College of Computer Studies',
                'year_level' => '2nd Year',
                'semester' => '1st Semester',
                'status' => 'active',
            ],
            [
                'code' => 'IT202',
                'name' => 'Database Management Systems 1',
                'description' => 'Relational database design, normalization, SQL queries, and integrity constraints.',
                'units' => 3,
                'program_id' => $programs['BSIT']->id,
                'department' => 'College of Computer Studies',
                'year_level' => '2nd Year',
                'semester' => '1st Semester',
                'status' => 'active',
            ],
            [
                'code' => 'CS101',
                'name' => 'Object-Oriented Programming',
                'description' => 'Classes, inheritance, encapsulation, polymorphism, and design patterns.',
                'units' => 3,
                'program_id' => $programs['BSCS']->id,
                'department' => 'College of Computer Studies',
                'year_level' => '1st Year',
                'semester' => '1st Semester',
                'status' => 'active',
            ],
        ];

        $subjects = [];
        foreach ($subjectsData as $sub) {
            $subjects[$sub['code']] = Subject::firstOrCreate(['code' => $sub['code']], $sub);
        }

        // 9. Students with User Accounts
        $studentsData = [
            [
                'student_id' => 'STD-2026-0001',
                'first_name' => 'John',
                'middle_name' => 'Michael',
                'last_name' => 'Doe',
                'suffix' => null,
                'date_of_birth' => '2005-04-12',
                'gender' => 'Male',
                'address' => '123 Rizal St., Manila, Metro Manila',
                'contact_number' => '+63 912 345 6789',
                'email' => 'john.doe@acadease.com',
                'program_id' => $programs['BSIT']->id,
                'year_level' => '1st Year',
                'section_id' => $sections['BSIT-1A']->id,
                'academic_year_id' => $ay2026->id,
                'status' => 'active',
            ],
            [
                'student_id' => 'STD-2026-0002',
                'first_name' => 'Emily',
                'middle_name' => 'Rose',
                'last_name' => 'Smith',
                'suffix' => null,
                'date_of_birth' => '2005-07-25',
                'gender' => 'Female',
                'address' => '456 Bonifacio Ave., Quezon City',
                'contact_number' => '+63 921 456 7890',
                'email' => 'emily.smith@acadease.com',
                'program_id' => $programs['BSIT']->id,
                'year_level' => '1st Year',
                'section_id' => $sections['BSIT-1A']->id,
                'academic_year_id' => $ay2026->id,
                'status' => 'active',
            ],
            [
                'student_id' => 'STD-2026-0003',
                'first_name' => 'Carlos',
                'middle_name' => 'Manuel',
                'last_name' => 'Mendoza',
                'suffix' => 'Jr.',
                'date_of_birth' => '2004-11-10',
                'gender' => 'Male',
                'address' => '789 Magsaysay Blvd., Pasig City',
                'contact_number' => '+63 932 567 8901',
                'email' => 'carlos.mendoza@acadease.com',
                'program_id' => $programs['BSIT']->id,
                'year_level' => '2nd Year',
                'section_id' => $sections['BSIT-2A']->id,
                'academic_year_id' => $ay2026->id,
                'status' => 'active',
            ],
            [
                'student_id' => 'STD-2026-0004',
                'first_name' => 'Angela',
                'middle_name' => 'Claire',
                'last_name' => 'Velasco',
                'suffix' => null,
                'date_of_birth' => '2005-01-18',
                'gender' => 'Female',
                'address' => '321 Taft Ave., Pasay City',
                'contact_number' => '+63 945 678 9012',
                'email' => 'angela.velasco@acadease.com',
                'program_id' => $programs['BSCS']->id,
                'year_level' => '1st Year',
                'section_id' => $sections['BSCS-1A']->id,
                'academic_year_id' => $ay2026->id,
                'status' => 'active',
            ],
        ];

        $students = [];
        foreach ($studentsData as $sData) {
            $user = User::firstOrCreate(['email' => $sData['email']], [
                'name' => trim("{$sData['first_name']} {$sData['last_name']}"),
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'active',
            ]);

            $sData['user_id'] = $user->id;
            $students[] = Student::firstOrCreate(['student_id' => $sData['student_id']], $sData);
        }

        // 10. Enrollments & Subjects & Grades for Students
        // John Doe (1st Year BSIT)
        $enr1 = Enrollment::firstOrCreate([
            'student_id' => $students[0]->id,
            'academic_year_id' => $ay2026->id,
            'semester_id' => $sem1->id,
        ], [
            'program_id' => $programs['BSIT']->id,
            'year_level' => '1st Year',
            'section_id' => $sections['BSIT-1A']->id,
            'status' => 'enrolled',
            'enrollment_date' => '2026-08-05',
        ]);

        $firstYearSubjects = [$subjects['IT101'], $subjects['IT102'], $subjects['IT103'], $subjects['GE101']];
        foreach ($firstYearSubjects as $idx => $subj) {
            $teacher = $teachers[$idx % count($teachers)];
            EnrollmentSubject::firstOrCreate([
                'enrollment_id' => $enr1->id,
                'subject_id' => $subj->id,
            ], [
                'teacher_id' => $teacher->id,
            ]);

            $grade = Grade::firstOrCreate([
                'student_id' => $students[0]->id,
                'subject_id' => $subj->id,
                'academic_year_id' => $ay2026->id,
                'semester_id' => $sem1->id,
            ], [
                'enrollment_id' => $enr1->id,
                'teacher_id' => $teacher->id,
                'prelim_grade' => 88.00 + ($idx * 2),
                'midterm_grade' => 90.00 + ($idx * 1.5),
                'final_grade' => 89.00 + ($idx * 1),
            ]);
            $grade->computeGrade();
            $grade->save();
        }

        // Emily Smith (1st Year BSIT)
        $enr2 = Enrollment::firstOrCreate([
            'student_id' => $students[1]->id,
            'academic_year_id' => $ay2026->id,
            'semester_id' => $sem1->id,
        ], [
            'program_id' => $programs['BSIT']->id,
            'year_level' => '1st Year',
            'section_id' => $sections['BSIT-1A']->id,
            'status' => 'enrolled',
            'enrollment_date' => '2026-08-06',
        ]);

        foreach ($firstYearSubjects as $idx => $subj) {
            $teacher = $teachers[$idx % count($teachers)];
            EnrollmentSubject::firstOrCreate([
                'enrollment_id' => $enr2->id,
                'subject_id' => $subj->id,
            ], [
                'teacher_id' => $teacher->id,
            ]);

            $grade = Grade::firstOrCreate([
                'student_id' => $students[1]->id,
                'subject_id' => $subj->id,
                'academic_year_id' => $ay2026->id,
                'semester_id' => $sem1->id,
            ], [
                'enrollment_id' => $enr2->id,
                'teacher_id' => $teacher->id,
                'prelim_grade' => 92.00,
                'midterm_grade' => 94.00,
                'final_grade' => 95.00,
            ]);
            $grade->computeGrade();
            $grade->save();
        }

        // Carlos Mendoza (2nd Year BSIT)
        $enr3 = Enrollment::firstOrCreate([
            'student_id' => $students[2]->id,
            'academic_year_id' => $ay2026->id,
            'semester_id' => $sem1->id,
        ], [
            'program_id' => $programs['BSIT']->id,
            'year_level' => '2nd Year',
            'section_id' => $sections['BSIT-2A']->id,
            'status' => 'enrolled',
            'enrollment_date' => '2026-08-04',
        ]);

        $secondYearSubjects = [$subjects['IT201'], $subjects['IT202']];
        foreach ($secondYearSubjects as $idx => $subj) {
            $teacher = $teachers[$idx % count($teachers)];
            EnrollmentSubject::firstOrCreate([
                'enrollment_id' => $enr3->id,
                'subject_id' => $subj->id,
            ], [
                'teacher_id' => $teacher->id,
            ]);

            $grade = Grade::firstOrCreate([
                'student_id' => $students[2]->id,
                'subject_id' => $subj->id,
                'academic_year_id' => $ay2026->id,
                'semester_id' => $sem1->id,
            ], [
                'enrollment_id' => $enr3->id,
                'teacher_id' => $teacher->id,
                'prelim_grade' => 85.00,
                'midterm_grade' => 86.50,
                'final_grade' => 88.00,
            ]);
            $grade->computeGrade();
            $grade->save();
        }

        // 11. Activity Logs
        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'System Initialized',
            'description' => 'System configuration, academic year 2026-2027, and base programs initialized.',
            'ip_address' => '127.0.0.1',
        ]);
        ActivityLog::create([
            'user_id' => $registrar->id,
            'action' => 'Enrolled Students',
            'description' => 'Processed 1st Semester AY 2026-2027 enrollments for BSIT-1A and BSIT-2A.',
            'ip_address' => '127.0.0.1',
        ]);
        ActivityLog::create([
            'user_id' => $teachers[0]->user_id,
            'action' => 'Recorded Grades',
            'description' => 'Submitted midterm and final marks for IT101 - Introduction to Computing.',
            'ip_address' => '127.0.0.1',
        ]);
    }
}
