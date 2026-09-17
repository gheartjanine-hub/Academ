import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit, FileCheck2, User, BookOpen } from 'lucide-react';

interface EnrollmentShowProps {
    enrollment: {
        id: number;
        status: string;
        year_level: string;
        enrollment_date: string;
        remarks: string | null;
        student?: {
            id: number;
            student_id: string;
            full_name: string;
            email: string;
            contact_number: string | null;
        } | null;
        academic_year?: { name: string } | null;
        semester?: { name: string } | null;
        program?: { code: string; name: string } | null;
        section?: { name: string } | null;
        enrollment_subjects: Array<{
            id: number;
            subject?: { code: string; name: string; units: number } | null;
            teacher?: { full_name: string } | null;
        }>;
    };
}

export default function EnrollmentShow({ enrollment }: EnrollmentShowProps) {
    const totalUnits = enrollment.enrollment_subjects.reduce(
        (sum, es) => sum + (es.subject?.units || 0),
        0
    );

    return (
        <AppLayout title={`Enrollment #${enrollment.id}`}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/enrollments" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-blue-500/20 uppercase">
                            <FileCheck2 className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Enrollment #{enrollment.id}
                                </h2>
                                <StatusBadge status={enrollment.status} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {enrollment.student?.full_name} ({enrollment.student?.student_id}) • {enrollment.academic_year?.name} - {enrollment.semester?.name}
                            </p>
                        </div>
                    </div>

                    <Link href={`/enrollments/${enrollment.id}/edit`}>
                        <Button size="sm" className="gap-1.5">
                            <Edit className="w-4 h-4" />
                            <span>Edit Enrollment</span>
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Academic Period</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-3 text-xs">
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Academic Year</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{enrollment.academic_year?.name}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Semester</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{enrollment.semester?.name}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Program & Year</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{enrollment.program?.code} • {enrollment.year_level}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Assigned Section</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{enrollment.section?.name ?? 'Unassigned'}</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="sm:col-span-2">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span>Enrolled Subjects ({enrollment.enrollment_subjects.length})</span>
                            </CardTitle>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                {totalUnits} Total Credit Units
                            </span>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                    <tr>
                                        <th className="px-5 py-3">Code</th>
                                        <th className="px-5 py-3">Subject Title</th>
                                        <th className="px-5 py-3">Units</th>
                                        <th className="px-5 py-3">Instructor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {enrollment.enrollment_subjects.map((es) => (
                                        <tr key={es.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-mono font-bold text-blue-600">{es.subject?.code}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-800">{es.subject?.name}</td>
                                            <td className="px-5 py-3 text-slate-600 font-medium">{es.subject?.units} units</td>
                                            <td className="px-5 py-3 text-slate-700">{es.teacher?.full_name ?? 'To be announced'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

