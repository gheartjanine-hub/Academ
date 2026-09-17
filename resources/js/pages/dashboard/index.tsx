import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { StatCard, Card, CardHeader, CardTitle, CardBody } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import {
    GraduationCap,
    Users,
    BookOpen,
    Layers,
    FileCheck2,
    Calendar,
    Activity,
    ArrowUpRight,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface DashboardProps {
    stats: {
        totalStudents: number;
        totalTeachers: number;
        totalSubjects: number;
        totalSections: number;
        totalPrograms: number;
        totalEnrolled: number;
        activeAcademicYear: string;
        activeSemester: string;
    };
    recentActivities: Array<{
        id: number;
        action: string;
        description: string;
        userName: string;
        userRole: string;
        createdAt: string;
    }>;
    recentEnrollments: Array<{
        id: number;
        studentId: string;
        studentName: string;
        program: string;
        yearLevel: string;
        section: string;
        status: string;
        date: string;
    }>;
}

export default function Dashboard({ stats, recentActivities, recentEnrollments }: DashboardProps) {
    return (
        <AppLayout title="Administrator Dashboard">
            <div className="space-y-6">
                {/* Header Welcome banner */}
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Academic Overview</h2>
                        <p className="text-blue-100 text-xs sm:text-sm mt-1">
                            Current Period: <span className="font-semibold text-white">A.Y. {stats.activeAcademicYear}</span> — <span className="font-semibold text-white">{stats.activeSemester}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/enrollments/create"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-700 font-semibold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-colors"
                        >
                            <FileCheck2 className="w-4 h-4" />
                            <span>Enroll Student</span>
                        </Link>
                        <Link
                            href="/reports"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-800/60 hover:bg-blue-800 border border-blue-400/30 text-white font-semibold text-xs rounded-xl transition-colors"
                        >
                            <span>Reports</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <StatCard
                        title="Total Students"
                        value={stats.totalStudents}
                        icon={<GraduationCap className="w-5 h-5" />}
                        color="blue"
                    />
                    <StatCard
                        title="Total Teachers"
                        value={stats.totalTeachers}
                        icon={<Users className="w-5 h-5" />}
                        color="emerald"
                    />
                    <StatCard
                        title="Total Subjects"
                        value={stats.totalSubjects}
                        icon={<BookOpen className="w-5 h-5" />}
                        color="violet"
                    />
                    <StatCard
                        title="Total Sections"
                        value={stats.totalSections}
                        icon={<Layers className="w-5 h-5" />}
                        color="amber"
                    />
                    <StatCard
                        title="Enrolled"
                        value={stats.totalEnrolled}
                        subtitle="This term"
                        icon={<FileCheck2 className="w-5 h-5" />}
                        color="rose"
                    />
                    <StatCard
                        title="Current Term"
                        value={stats.activeSemester}
                        subtitle={`AY ${stats.activeAcademicYear}`}
                        icon={<Calendar className="w-5 h-5" />}
                        color="blue"
                    />
                </div>

                {/* Tables Grid: Recent Enrollments & Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Enrollments (2 cols on large screen) */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                                    <span>Recent Enrollments</span>
                                </CardTitle>
                                <Link
                                    href="/enrollments"
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                                >
                                    View All
                                </Link>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                                        <tr>
                                            <th className="px-5 py-3">Student ID</th>
                                            <th className="px-5 py-3">Name</th>
                                            <th className="px-5 py-3">Program / Year</th>
                                            <th className="px-5 py-3">Section</th>
                                            <th className="px-5 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recentEnrollments.length > 0 ? (
                                            recentEnrollments.map((enr) => (
                                                <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-5 py-3 font-mono font-medium text-slate-600">{enr.studentId}</td>
                                                    <td className="px-5 py-3 font-medium text-slate-900">{enr.studentName}</td>
                                                    <td className="px-5 py-3 text-slate-600">
                                                        {enr.program} • {enr.yearLevel}
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-600">{enr.section}</td>
                                                    <td className="px-5 py-3">
                                                        <StatusBadge status={enr.status} />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                                                    No recent enrollments found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Activities Feed */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <Activity className="w-4 h-4 text-emerald-600" />
                                    <span>Recent Activities</span>
                                </CardTitle>
                            </CardHeader>
                            <CardBody className="p-4 divide-y divide-slate-100">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((log) => (
                                        <div key={log.id} className="py-3 first:pt-0 last:pb-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-semibold text-xs text-slate-800">{log.action}</span>
                                                <span className="text-[10px] text-slate-400">{log.createdAt}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{log.description}</p>
                                            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
                                                <span>by</span>
                                                <span className="font-medium text-slate-600">{log.userName}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="capitalize text-slate-500">{log.userRole}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 text-center py-6">No activity logs recorded yet.</p>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

