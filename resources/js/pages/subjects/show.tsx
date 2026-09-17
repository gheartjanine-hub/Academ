import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit, BookOpen, Users } from 'lucide-react';

interface SubjectShowProps {
    subject: {
        id: number;
        code: string;
        name: string;
        description: string | null;
        units: number;
        department: string | null;
        year_level: string | null;
        semester: string | null;
        status: string;
        program?: { code: string; name: string } | null;
    };
    enrolledStudents: Array<{
        studentId: string;
        name: string;
        section: string;
        teacher: string;
        status: string;
    }>;
}

export default function SubjectShow({ subject, enrolledStudents }: SubjectShowProps) {
    return (
        <AppLayout title={`${subject.code} - ${subject.name}`}>
            <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/subjects" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-violet-500/20 uppercase">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
                                    {subject.code}
                                </span>
                                <h2 className="text-xl font-bold text-slate-900">{subject.name}</h2>
                                <StatusBadge status={subject.status} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {subject.units} Units • {subject.program ? `${subject.program.code} - ${subject.program.name}` : 'General Curriculum'}
                                {subject.year_level && ` • ${subject.year_level}`}
                                {subject.semester && ` • ${subject.semester}`}
                            </p>
                        </div>
                    </div>

                    <Link href={`/subjects/${subject.id}/edit`}>
                        <Button size="sm" className="gap-1.5">
                            <Edit className="w-4 h-4" />
                            <span>Edit Subject</span>
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Subject Information</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-4 text-xs">
                            <div>
                                <p className="text-slate-400 uppercase font-semibold text-[10px]">Description</p>
                                <p className="text-slate-700 mt-1 leading-relaxed">{subject.description || 'No description provided.'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 uppercase font-semibold text-[10px]">Academic Department</p>
                                <p className="font-semibold text-slate-800 mt-1">{subject.department || 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 uppercase font-semibold text-[10px]">Credit Units</p>
                                <p className="font-semibold text-slate-800 mt-1">{subject.units} Units</p>
                            </div>
                            <div>
                                <p className="text-slate-400 uppercase font-semibold text-[10px]">Placement</p>
                                <p className="font-semibold text-slate-800 mt-1">
                                    {subject.year_level || 'Any Year'} — {subject.semester || 'Any Semester'}
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span>Currently Enrolled Students ({enrolledStudents.length})</span>
                            </CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                    <tr>
                                        <th className="px-5 py-3">Student ID</th>
                                        <th className="px-5 py-3">Name</th>
                                        <th className="px-5 py-3">Section</th>
                                        <th className="px-5 py-3">Teacher</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {enrolledStudents.length > 0 ? (
                                        enrolledStudents.map((st, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="px-5 py-3 font-mono font-semibold text-blue-600">{st.studentId}</td>
                                                <td className="px-5 py-3 font-medium text-slate-900">{st.name}</td>
                                                <td className="px-5 py-3 text-slate-600">{st.section}</td>
                                                <td className="px-5 py-3 text-slate-600">{st.teacher}</td>
                                                <td className="px-5 py-3"><StatusBadge status={st.status} /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                                                No students currently enrolled in this subject.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

