import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle, StatCard } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { GraduationCap, BookOpen, Award, Clock, ArrowRight } from 'lucide-react';

interface StudentDashboardProps {
    student: {
        id: number;
        studentId: string;
        name: string;
        program?: string;
        programCode?: string;
        yearLevel?: string;
        section?: string;
        status: string;
    };
    currentEnrollment: {
        id: number;
        status: string;
        academicYear?: string;
        semester?: string;
        section?: string;
        subjectsCount: number;
        totalUnits: number;
    } | null;
    recentGrades: Array<{
        id: number;
        subjectCode: string;
        subjectName: string;
        units: number;
        rating: number | null;
        remarks: string;
        term: string;
    }>;
}

export default function StudentDashboard({ student, currentEnrollment, recentGrades }: StudentDashboardProps) {
    return (
        <AppLayout title="Student Portal Dashboard">
            <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">Student Portal</span>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">Welcome, {student.name}!</h2>
                        <p className="text-xs text-blue-100 mt-1">
                            Student ID: <span className="font-mono font-bold text-white">{student.studentId}</span> • {student.programCode} - {student.program} ({student.yearLevel})
                        </p>
                    </div>

                    <Link
                        href={`/students/${student.id}/academic-record`}
                        className="px-4 py-2 bg-white text-blue-800 font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-colors"
                    >
                        View Full Transcript
                    </Link>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        title="Enrolled Subjects"
                        value={currentEnrollment ? `${currentEnrollment.subjectsCount} Subjects` : 'Not Enrolled'}
                        subtitle={currentEnrollment ? `${currentEnrollment.totalUnits} Credit Units` : undefined}
                        icon={<BookOpen className="w-5 h-5" />}
                        color="blue"
                    />
                    <StatCard
                        title="Enrolled Section"
                        value={student.section || 'Unassigned'}
                        subtitle={student.yearLevel || undefined}
                        icon={<GraduationCap className="w-5 h-5" />}
                        color="emerald"
                    />
                    <StatCard
                        title="Current Standing"
                        value={student.status}
                        subtitle={currentEnrollment?.semester || 'Term pending'}
                        icon={<Award className="w-5 h-5" />}
                        color="violet"
                    />
                </div>

                {/* Recent Grades Table */}
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Award className="w-4 h-4 text-blue-600" />
                            <span>Recent Academic Marks</span>
                        </CardTitle>
                        <Link href="/student/grades" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                            View All Grades
                        </Link>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                <tr>
                                    <th className="px-5 py-3">Code</th>
                                    <th className="px-5 py-3">Subject Name</th>
                                    <th className="px-5 py-3">Units</th>
                                    <th className="px-5 py-3 font-bold text-center">Final Rating</th>
                                    <th className="px-5 py-3 text-center">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentGrades.length > 0 ? (
                                    recentGrades.map((g) => (
                                        <tr key={g.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-mono font-bold text-blue-600">{g.subjectCode}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-800">{g.subjectName}</td>
                                            <td className="px-5 py-3 text-slate-600">{g.units} units</td>
                                            <td className="px-5 py-3 font-mono font-bold text-center">{g.rating !== null ? `${g.rating}%` : 'Pending'}</td>
                                            <td className="px-5 py-3 text-center"><StatusBadge status={g.remarks} /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-6 text-center text-slate-400">
                                            No recent grades published yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

