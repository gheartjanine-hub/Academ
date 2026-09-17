import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Mail, Phone, BookOpen, Layers } from 'lucide-react';

interface TeacherShowProps {
    teacher: {
        id: number;
        teacher_id: string;
        first_name: string;
        middle_name: string | null;
        last_name: string;
        full_name: string;
        email: string;
        contact_number: string | null;
        department: string | null;
        status: string;
    };
    assignedSubjects: Array<{
        subjectId: number;
        subjectCode: string;
        subjectName: string;
        units: number;
        enrolledCount: number;
    }>;
    advisedSections: Array<{
        id: number;
        name: string;
        year_level: string;
        program?: { code: string; name: string } | null;
    }>;
}

export default function TeacherShow({ teacher, assignedSubjects, advisedSections }: TeacherShowProps) {
    return (
        <AppLayout title={`${teacher.full_name} (${teacher.teacher_id})`}>
            <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/teachers" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-emerald-500/20 uppercase">
                            {teacher.first_name[0]}{teacher.last_name[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900">{teacher.full_name}</h2>
                                <StatusBadge status={teacher.status} />
                            </div>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                                ID: <strong className="text-emerald-600">{teacher.teacher_id}</strong>
                                {teacher.department && ` • ${teacher.department}`}
                            </p>
                        </div>
                    </div>

                    <Link href={`/teachers/${teacher.id}/edit`}>
                        <Button size="sm" className="gap-1.5">
                            <Edit className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Teacher Details</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-4 text-xs">
                            <div>
                                <p className="text-slate-400 uppercase font-semibold text-[10px]">Department</p>
                                <p className="font-semibold text-slate-800 mt-1">{teacher.department || 'Not assigned'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 uppercase font-semibold text-[10px]">Email Address</p>
                                <p className="font-medium text-slate-800 mt-1 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{teacher.email}</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400 uppercase font-semibold text-[10px]">Contact Number</p>
                                <p className="font-medium text-slate-800 mt-1 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{teacher.contact_number || 'No contact provided'}</span>
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span>Assigned Teaching Load</span>
                            </CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                    <tr>
                                        <th className="px-5 py-3">Code</th>
                                        <th className="px-5 py-3">Subject Name</th>
                                        <th className="px-5 py-3">Units</th>
                                        <th className="px-5 py-3">Enrolled Students</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {assignedSubjects.length > 0 ? (
                                        assignedSubjects.map((sub) => (
                                            <tr key={sub.subjectId} className="hover:bg-slate-50">
                                                <td className="px-5 py-3 font-mono font-semibold text-blue-600">
                                                    {sub.subjectCode}
                                                </td>
                                                <td className="px-5 py-3 font-medium text-slate-800">
                                                    {sub.subjectName}
                                                </td>
                                                <td className="px-5 py-3 text-slate-600">{sub.units} units</td>
                                                <td className="px-5 py-3 font-semibold text-slate-700">
                                                    {sub.enrolledCount} students
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                                                No subjects currently assigned to this teacher.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Advised Sections */}
                        {advisedSections.length > 0 && (
                            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                                <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                                    <Layers className="w-4 h-4 text-amber-600" />
                                    <span>Class Advisory Sections</span>
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {advisedSections.map((sec) => (
                                        <span
                                            key={sec.id}
                                            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 shadow-2xs"
                                        >
                                            {sec.name} ({sec.program?.code} - {sec.year_level})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

