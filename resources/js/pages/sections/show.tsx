import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Layers, Users, GraduationCap } from 'lucide-react';

interface SectionShowProps {
    section: {
        id: number;
        name: string;
        year_level: string;
        max_students: number;
        status: string;
        program?: { code: string; name: string } | null;
        academic_year?: { name: string } | null;
        adviser?: { first_name: string; last_name: string; email: string } | null;
    };
    students: Array<{
        id: number;
        studentId: string;
        name: string;
        email: string;
        gender: string | null;
        status: string;
    }>;
}

export default function SectionShow({ section, students }: SectionShowProps) {
    return (
        <AppLayout title={`Section ${section.name}`}>
            <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/sections" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-amber-500/20 uppercase">
                            <Layers className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900">{section.name}</h2>
                                <StatusBadge status={section.status} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {section.program?.code} - {section.program?.name} • {section.year_level}
                                {section.academic_year && ` • A.Y. ${section.academic_year.name}`}
                            </p>
                        </div>
                    </div>

                    <Link href={`/sections/${section.id}/edit`}>
                        <Button size="sm" className="gap-1.5">
                            <Edit className="w-4 h-4" />
                            <span>Edit Section</span>
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Section Information</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-4 text-xs">
                            <div>
                                <p className="text-slate-400 uppercase font-semibold text-[10px]">Academic Program</p>
                                <p className="font-semibold text-slate-800 mt-1">{section.program?.name} ({section.program?.code})</p>
                            </div>
                            <div>
                                <p className="text-slate-400 uppercase font-semibold text-[10px]">Class Adviser</p>
                                <p className="font-semibold text-slate-800 mt-1">
                                    {section.adviser ? `${section.adviser.first_name} ${section.adviser.last_name}` : 'Unassigned'}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400 uppercase font-semibold text-[10px]">Student Capacity</p>
                                <p className="font-semibold text-slate-800 mt-1">
                                    {students.length} / {section.max_students} students
                                    <span className="text-slate-400 font-normal ml-1">
                                        ({Math.max(0, section.max_students - students.length)} slots remaining)
                                    </span>
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span>Students Assigned to {section.name} ({students.length})</span>
                            </CardTitle>
                            <Link href={`/enrollments/create`}>
                                <Button size="sm" variant="outline">Enroll Student</Button>
                            </Link>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                    <tr>
                                        <th className="px-5 py-3">Student ID</th>
                                        <th className="px-5 py-3">Name</th>
                                        <th className="px-5 py-3">Email</th>
                                        <th className="px-5 py-3">Gender</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.length > 0 ? (
                                        students.map((st) => (
                                            <tr key={st.id} className="hover:bg-slate-50">
                                                <td className="px-5 py-3 font-mono font-semibold text-blue-600">{st.studentId}</td>
                                                <td className="px-5 py-3 font-semibold text-slate-900">{st.name}</td>
                                                <td className="px-5 py-3 text-slate-500">{st.email}</td>
                                                <td className="px-5 py-3 text-slate-600">{st.gender || '-'}</td>
                                                <td className="px-5 py-3"><StatusBadge status={st.status} /></td>
                                                <td className="px-5 py-3 text-right">
                                                    <Link
                                                        href={`/students/${st.id}`}
                                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                                                    >
                                                        Profile
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                                                No students currently assigned to this section.
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

