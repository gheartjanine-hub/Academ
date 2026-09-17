import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    Award,
    User,
    FileCheck2,
    BookOpen,
    History,
    GraduationCap,
    Calendar,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentShowProps {
    student: {
        id: number;
        student_id: string;
        first_name: string;
        middle_name: string | null;
        last_name: string;
        suffix: string | null;
        full_name: string;
        email: string;
        contact_number: string | null;
        gender: string | null;
        date_of_birth: string | null;
        address: string | null;
        year_level: string | null;
        status: string;
        program?: { id: number; code: string; name: string; department: string } | null;
        section?: { id: number; name: string } | null;
        academic_year?: { id: number; name: string } | null;
        user?: { id: number; name: string; email: string; role: string } | null;
    };
    enrollments: Array<{
        id: number;
        status: string;
        year_level: string;
        enrollment_date: string;
        academic_year?: { id: number; name: string } | null;
        semester?: { id: number; name: string } | null;
        program?: { id: number; code: string; name: string } | null;
        section?: { id: number; name: string } | null;
        enrollment_subjects: Array<{
            id: number;
            subject?: { id: number; code: string; name: string; units: number } | null;
            teacher?: { id: number; full_name: string } | null;
        }>;
    }>;
    groupedGrades: Record<
        string,
        {
            term: string;
            totalUnits: number;
            averageGrade: number | null;
            grades: Array<{
                id: number;
                subjectCode?: string;
                subjectName?: string;
                units?: number;
                teacher?: string;
                prelim?: number | null;
                midterm?: number | null;
                final?: number | null;
                rating?: number | null;
                remarks: string;
            }>;
        }
    >;
    academicSummary: {
        totalSubjects: number;
        totalPassed: number;
        totalFailed: number;
        totalEarnedUnits: number;
        overallAverage: number | null;
    };
}

export default function StudentShow({ student, enrollments, groupedGrades, academicSummary }: StudentShowProps) {
    const [activeTab, setActiveTab] = useState<'personal' | 'enrollment' | 'subjects' | 'grades' | 'history'>('personal');

    const tabs = [
        { id: 'personal', name: 'Personal Information', icon: User },
        { id: 'enrollment', name: 'Enrollment Information', icon: FileCheck2 },
        { id: 'subjects', name: 'Subjects', icon: BookOpen },
        { id: 'grades', name: 'Grades', icon: Award },
        { id: 'history', name: 'Academic History', icon: History },
    ];

    // Current subjects from the latest active enrollment
    const latestEnrollment = enrollments[0];
    const currentSubjects = latestEnrollment ? latestEnrollment.enrollment_subjects : [];

    return (
        <AppLayout title={`${student.full_name} (${student.student_id})`}>
            <div className="space-y-6">
                {/* Profile Header Banner */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/students" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-blue-500/20 uppercase">
                            {student.first_name[0]}{student.last_name[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900">{student.full_name}</h2>
                                <StatusBadge status={student.status} />
                            </div>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                                ID: <strong className="text-blue-600">{student.student_id}</strong>
                                {student.program && ` • ${student.program.code} - ${student.program.name}`}
                                {student.year_level && ` • ${student.year_level}`}
                                {student.section && ` (${student.section.name})`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/students/${student.id}/academic-record`}>
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <Award className="w-4 h-4 text-emerald-600" />
                                <span>Academic Record</span>
                            </Button>
                        </Link>
                        <Link href={`/students/${student.id}/edit`}>
                            <Button size="sm" className="gap-1.5">
                                <Edit className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-slate-200">
                    <nav className="flex space-x-6 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        'py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer',
                                        isActive
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content 1: Personal Information */}
                {activeTab === 'personal' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold">Personal Details</CardTitle>
                            </CardHeader>
                            <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <p className="text-slate-400 uppercase font-semibold text-[10px]">Full Name</p>
                                    <p className="font-semibold text-slate-800 mt-1">{student.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 uppercase font-semibold text-[10px]">Gender</p>
                                    <p className="font-semibold text-slate-800 mt-1">{student.gender || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 uppercase font-semibold text-[10px]">Date of Birth</p>
                                    <p className="font-semibold text-slate-800 mt-1">{student.date_of_birth || 'Not recorded'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 uppercase font-semibold text-[10px]">Account Status</p>
                                    <div className="mt-1"><StatusBadge status={student.status} /></div>
                                </div>
                                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                                    <p className="text-slate-400 uppercase font-semibold text-[10px]">Address</p>
                                    <p className="font-medium text-slate-800 mt-1 flex items-start gap-1.5">
                                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                        <span>{student.address || 'No address provided.'}</span>
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold">Contact & Credentials</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-4 text-xs">
                                <div>
                                    <p className="text-slate-400 uppercase font-semibold text-[10px]">Email Address</p>
                                    <p className="font-medium text-slate-800 mt-1 flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{student.email}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400 uppercase font-semibold text-[10px]">Phone Number</p>
                                    <p className="font-medium text-slate-800 mt-1 flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{student.contact_number || 'No contact number'}</span>
                                    </p>
                                </div>
                                <div className="pt-3 border-t border-slate-100">
                                    <p className="text-slate-400 uppercase font-semibold text-[10px]">Portal Account</p>
                                    <p className="font-semibold text-slate-800 mt-1">
                                        {student.user ? 'Linked Active User' : 'No user account'}
                                    </p>
                                    {student.user && (
                                        <p className="text-[11px] text-slate-500 mt-0.5">Role: {student.user.role}</p>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}

                {/* Tab Content 2: Enrollment Information */}
                {activeTab === 'enrollment' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Enrollment History</CardTitle>
                            <Link href={`/enrollments/create?student_id=${student.id}`}>
                                <Button size="sm">Enroll in New Term</Button>
                            </Link>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                    <tr>
                                        <th className="px-5 py-3">Academic Year</th>
                                        <th className="px-5 py-3">Semester</th>
                                        <th className="px-5 py-3">Program / Year</th>
                                        <th className="px-5 py-3">Section</th>
                                        <th className="px-5 py-3">Subjects</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {enrollments.length > 0 ? (
                                        enrollments.map((enr) => (
                                            <tr key={enr.id} className="hover:bg-slate-50">
                                                <td className="px-5 py-3 font-semibold text-slate-800">
                                                    {enr.academic_year?.name}
                                                </td>
                                                <td className="px-5 py-3 font-medium text-slate-700">
                                                    {enr.semester?.name}
                                                </td>
                                                <td className="px-5 py-3 text-slate-600">
                                                    {enr.program?.code} • {enr.year_level}
                                                </td>
                                                <td className="px-5 py-3 text-slate-600">
                                                    {enr.section?.name ?? 'Unassigned'}
                                                </td>
                                                <td className="px-5 py-3 text-slate-600">
                                                    {enr.enrollment_subjects.length} subject(s)
                                                </td>
                                                <td className="px-5 py-3">
                                                    <StatusBadge status={enr.status} />
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <Link
                                                        href={`/enrollments/${enr.id}`}
                                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                                                No enrollment records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Tab Content 3: Enrolled Subjects */}
                {activeTab === 'subjects' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">
                                Current Enrolled Subjects
                                {latestEnrollment && ` (${latestEnrollment.academic_year?.name} - ${latestEnrollment.semester?.name})`}
                            </CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                    <tr>
                                        <th className="px-5 py-3">Subject Code</th>
                                        <th className="px-5 py-3">Subject Description</th>
                                        <th className="px-5 py-3">Units</th>
                                        <th className="px-5 py-3">Assigned Teacher</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentSubjects.length > 0 ? (
                                        currentSubjects.map((es) => (
                                            <tr key={es.id} className="hover:bg-slate-50">
                                                <td className="px-5 py-3 font-mono font-semibold text-blue-600">
                                                    {es.subject?.code}
                                                </td>
                                                <td className="px-5 py-3 font-medium text-slate-800">
                                                    {es.subject?.name}
                                                </td>
                                                <td className="px-5 py-3 text-slate-600">
                                                    {es.subject?.units} units
                                                </td>
                                                <td className="px-5 py-3 text-slate-600">
                                                    {es.teacher?.full_name ?? 'To be assigned'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                                                No enrolled subjects in current term.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Tab Content 4: Grades */}
                {activeTab === 'grades' && (
                    <div className="space-y-6">
                        {Object.keys(groupedGrades).length > 0 ? (
                            Object.entries(groupedGrades).map(([term, group]) => (
                                <Card key={term}>
                                    <CardHeader className="bg-slate-50/70 flex justify-between">
                                        <div>
                                            <CardTitle className="text-sm font-bold text-slate-800">{term}</CardTitle>
                                            <p className="text-[11px] text-slate-500">
                                                Total Units: {group.totalUnits} • Term Average: {group.averageGrade ?? 'Pending'}%
                                            </p>
                                        </div>
                                    </CardHeader>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                                <tr>
                                                    <th className="px-5 py-3">Code</th>
                                                    <th className="px-5 py-3">Subject Name</th>
                                                    <th className="px-5 py-3">Units</th>
                                                    <th className="px-5 py-3">Teacher</th>
                                                    <th className="px-5 py-3">Prelim</th>
                                                    <th className="px-5 py-3">Midterm</th>
                                                    <th className="px-5 py-3">Final</th>
                                                    <th className="px-5 py-3">Rating</th>
                                                    <th className="px-5 py-3">Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {group.grades.map((g) => (
                                                    <tr key={g.id} className="hover:bg-slate-50">
                                                        <td className="px-5 py-3 font-mono font-semibold text-blue-600">{g.subjectCode}</td>
                                                        <td className="px-5 py-3 font-medium text-slate-800">{g.subjectName}</td>
                                                        <td className="px-5 py-3 text-slate-600">{g.units}</td>
                                                        <td className="px-5 py-3 text-slate-500">{g.teacher}</td>
                                                        <td className="px-5 py-3 font-mono">{g.prelim ?? '-'}</td>
                                                        <td className="px-5 py-3 font-mono">{g.midterm ?? '-'}</td>
                                                        <td className="px-5 py-3 font-mono">{g.final ?? '-'}</td>
                                                        <td className="px-5 py-3 font-bold font-mono text-slate-900">{g.rating ?? '-'}</td>
                                                        <td className="px-5 py-3"><StatusBadge status={g.remarks} /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <EmptyState
                                title="No grades recorded"
                                description="No grade records found for this student."
                            />
                        )}
                    </div>
                )}

                {/* Tab Content 5: Academic History */}
                {activeTab === 'history' && (
                    <div className="space-y-6">
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Card className="p-4 text-center">
                                <p className="text-xs text-slate-500 font-medium">Total Subjects Taken</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{academicSummary.totalSubjects}</p>
                            </Card>
                            <Card className="p-4 text-center">
                                <p className="text-xs text-slate-500 font-medium">Passed Subjects</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">{academicSummary.totalPassed}</p>
                            </Card>
                            <Card className="p-4 text-center">
                                <p className="text-xs text-slate-500 font-medium">Total Units Earned</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">{academicSummary.totalEarnedUnits}</p>
                            </Card>
                            <Card className="p-4 text-center">
                                <p className="text-xs text-slate-500 font-medium">General Weighted Average</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {academicSummary.overallAverage ? `${academicSummary.overallAverage}%` : 'N/A'}
                                </p>
                            </Card>
                        </div>

                        {/* Complete Chronological Record */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold">Transcript History</CardTitle>
                                <Link href={`/students/${student.id}/academic-record`}>
                                    <Button size="sm" variant="outline">View Official Transcript</Button>
                                </Link>
                            </CardHeader>
                            <div className="p-6 space-y-6">
                                {Object.entries(groupedGrades).map(([term, group]) => (
                                    <div key={term} className="border-l-2 border-blue-500 pl-4 py-1">
                                        <h4 className="text-sm font-bold text-slate-800">{term}</h4>
                                        <p className="text-xs text-slate-500 mb-2">
                                            {group.totalUnits} Units Total • Average: {group.averageGrade ?? 'N/A'}%
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                            {group.grades.map((g) => (
                                                <div key={g.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                                                    <div className="flex items-center justify-between font-semibold">
                                                        <span className="text-blue-600 font-mono">{g.subjectCode}</span>
                                                        <span className="font-bold">{g.rating ?? 'Pending'}</span>
                                                    </div>
                                                    <p className="text-slate-700 truncate mt-0.5">{g.subjectName}</p>
                                                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                                                        <span>{g.units} units</span>
                                                        <StatusBadge status={g.remarks} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

