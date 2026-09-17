import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle, StatCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { BookMarked, Layers, Award, Calendar, ArrowRight } from 'lucide-react';

interface TeacherDashboardProps {
    teacher: {
        id: number;
        teacherId: string;
        name: string;
        department: string | null;
        status: string;
    };
    stats: {
        assignedSubjectsCount: number;
        sectionsAdvisedCount: number;
        activeAcademicYear: string;
        activeSemester: string;
    };
    sectionsAdvised: Array<{
        id: number;
        name: string;
        program: string;
        yearLevel: string;
        studentCount: number;
    }>;
}

export default function TeacherDashboard({ teacher, stats, sectionsAdvised }: TeacherDashboardProps) {
    return (
        <AppLayout title="Faculty Portal Dashboard">
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Teacher Portal</span>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">Welcome, {teacher.name}!</h2>
                        <p className="text-xs text-emerald-100 mt-1">
                            Faculty ID: <span className="font-mono font-bold text-white">{teacher.teacherId}</span> • {teacher.department || 'Academic Faculty'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/teacher/classes"
                            className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-50 transition-colors"
                        >
                            View Assigned Classes
                        </Link>
                        <Link
                            href="/grades"
                            className="px-4 py-2 bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-400/30 text-white font-bold text-xs rounded-xl transition-colors"
                        >
                            Enter Grades
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        title="Assigned Subjects"
                        value={`${stats.assignedSubjectsCount} Courses`}
                        icon={<BookMarked className="w-5 h-5" />}
                        color="emerald"
                    />
                    <StatCard
                        title="Advised Sections"
                        value={`${stats.sectionsAdvisedCount} Sections`}
                        icon={<Layers className="w-5 h-5" />}
                        color="blue"
                    />
                    <StatCard
                        title="Active Term"
                        value={stats.activeSemester}
                        subtitle={`AY ${stats.activeAcademicYear}`}
                        icon={<Calendar className="w-5 h-5" />}
                        color="violet"
                    />
                </div>

                {/* Advised Sections */}
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Layers className="w-4 h-4 text-emerald-600" />
                            <span>My Advisory Sections</span>
                        </CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                <tr>
                                    <th className="px-5 py-3">Section Name</th>
                                    <th className="px-5 py-3">Program</th>
                                    <th className="px-5 py-3">Year Level</th>
                                    <th className="px-5 py-3">Students</th>
                                    <th className="px-5 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sectionsAdvised.length > 0 ? (
                                    sectionsAdvised.map((sec) => (
                                        <tr key={sec.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-semibold text-slate-900">{sec.name}</td>
                                            <td className="px-5 py-3 text-slate-700">{sec.program}</td>
                                            <td className="px-5 py-3 text-slate-600">{sec.yearLevel}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-700">{sec.studentCount} students</td>
                                            <td className="px-5 py-3 text-right">
                                                <Link
                                                    href={`/sections/${sec.id}`}
                                                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                                                >
                                                    View Class List
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-6 text-center text-slate-400">
                                            No advisory sections assigned.
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

