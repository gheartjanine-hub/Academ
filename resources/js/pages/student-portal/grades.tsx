import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

interface StudentGradesProps {
    grades: Array<{
        id: number;
        code: string;
        name: string;
        units: number;
        teacher: string;
        prelim: number | null;
        midterm: number | null;
        final: number | null;
        rating: number | null;
        remarks: string;
    }>;
    academicYear?: string;
    semester?: string;
}

export default function StudentGrades({ grades, academicYear, semester }: StudentGradesProps) {
    return (
        <AppLayout title="My Grades">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Term Grades</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Academic Period: <strong>{academicYear ?? 'Current AY'}</strong> — <strong>{semester ?? 'Current Term'}</strong>
                    </p>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                <tr>
                                    <th className="px-5 py-3.5">Code</th>
                                    <th className="px-5 py-3.5">Subject Title</th>
                                    <th className="px-5 py-3.5">Units</th>
                                    <th className="px-5 py-3.5">Prelim</th>
                                    <th className="px-5 py-3.5">Midterm</th>
                                    <th className="px-5 py-3.5">Final</th>
                                    <th className="px-5 py-3.5 font-bold text-center">Rating</th>
                                    <th className="px-5 py-3.5 text-center">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {grades.length > 0 ? (
                                    grades.map((g) => (
                                        <tr key={g.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-mono font-bold text-blue-600">{g.code}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-800">{g.name}</td>
                                            <td className="px-5 py-3 text-slate-600">{g.units}</td>
                                            <td className="px-5 py-3 font-mono">{g.prelim ?? '-'}</td>
                                            <td className="px-5 py-3 font-mono">{g.midterm ?? '-'}</td>
                                            <td className="px-5 py-3 font-mono">{g.final ?? '-'}</td>
                                            <td className="px-5 py-3 font-mono font-bold text-center text-slate-900">
                                                {g.rating !== null ? `${g.rating}%` : '-'}
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <StatusBadge status={g.remarks} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                                            No grades available for this semester yet.
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

