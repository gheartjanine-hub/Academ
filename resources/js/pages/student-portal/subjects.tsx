import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface StudentSubjectsProps {
    enrollment: {
        id: number;
        academic_year?: { name: string } | null;
        semester?: { name: string } | null;
        program?: { code: string } | null;
        section?: { name: string } | null;
        year_level: string;
    } | null;
    subjects: Array<{
        code: string;
        name: string;
        units: number;
        teacher: string;
        department: string | null;
    }>;
}

export default function StudentSubjects({ enrollment, subjects }: StudentSubjectsProps) {
    const totalUnits = subjects.reduce((sum, s) => sum + s.units, 0);

    return (
        <AppLayout title="Enrolled Subjects">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Current Subjects</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {enrollment
                                ? `${enrollment.academic_year?.name} - ${enrollment.semester?.name} • Section: ${enrollment.section?.name ?? 'None'}`
                                : 'No active enrollment for this term'}
                        </p>
                    </div>

                    {enrollment && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            {totalUnits} Credit Units
                        </span>
                    )}
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                <tr>
                                    <th className="px-5 py-3.5">Subject Code</th>
                                    <th className="px-5 py-3.5">Subject Name</th>
                                    <th className="px-5 py-3.5">Units</th>
                                    <th className="px-5 py-3.5">Instructor</th>
                                    <th className="px-5 py-3.5">Department</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {subjects.length > 0 ? (
                                    subjects.map((sub, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-mono font-bold text-blue-600">{sub.code}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-800">{sub.name}</td>
                                            <td className="px-5 py-3 text-slate-600">{sub.units} units</td>
                                            <td className="px-5 py-3 text-slate-700 font-medium">{sub.teacher}</td>
                                            <td className="px-5 py-3 text-slate-500">{sub.department || 'General'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                                            No enrolled subjects found for the current academic period.
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

