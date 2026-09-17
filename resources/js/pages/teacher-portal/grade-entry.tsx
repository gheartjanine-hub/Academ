import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';

interface GradeEntryProps {
    subject: {
        id: number;
        code: string;
        name: string;
        units: number;
    };
    grades: Array<{
        id: number;
        studentId: string;
        studentName: string;
        section: string;
        prelim_grade: number | null;
        midterm_grade: number | null;
        final_grade: number | null;
        final_rating: number | null;
        remarks: string;
    }>;
    academicYear?: string;
    semester?: string;
}

export default function TeacherGradeEntry({ subject, grades, academicYear, semester }: GradeEntryProps) {
    const [localGrades, setLocalGrades] = useState<Record<number, { prelim: string; midterm: string; final: string }>>(() => {
        const initial: Record<number, { prelim: string; midterm: string; final: string }> = {};
        grades.forEach((g) => {
            initial[g.id] = {
                prelim: g.prelim_grade !== null ? String(g.prelim_grade) : '',
                midterm: g.midterm_grade !== null ? String(g.midterm_grade) : '',
                final: g.final_grade !== null ? String(g.final_grade) : '',
            };
        });
        return initial;
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleGradeChange = (gradeId: number, field: 'prelim' | 'midterm' | 'final', value: string) => {
        setLocalGrades((prev) => ({
            ...prev,
            [gradeId]: {
                ...prev[gradeId],
                [field]: value,
            },
        }));
    };

    const handleSaveAll = () => {
        setIsSaving(true);
        const payload = Object.entries(localGrades).map(([id, val]) => ({
            id: Number(id),
            prelim_grade: val.prelim !== '' ? Number(val.prelim) : null,
            midterm_grade: val.midterm !== '' ? Number(val.midterm) : null,
            final_grade: val.final !== '' ? Number(val.final) : null,
        }));

        router.post('/grades/batch-update', { grades: payload }, {
            onFinish: () => setIsSaving(false),
        });
    };

    return (
        <AppLayout title={`Grade Entry - ${subject.code}`}>
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/teacher/classes" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    {subject.code}
                                </span>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{subject.name}</h2>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Term: {academicYear ?? 'Current AY'} - {semester ?? 'Current Term'} • {subject.units} Units
                            </p>
                        </div>
                    </div>

                    <Button onClick={handleSaveAll} isLoading={isSaving} className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-xs">
                        <Save className="w-4 h-4" />
                        <span>Save All Marks</span>
                    </Button>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
                                <tr>
                                    <th className="px-5 py-3">Student</th>
                                    <th className="px-5 py-3">Section</th>
                                    <th className="px-5 py-3 w-28 text-center">Prelim (30%)</th>
                                    <th className="px-5 py-3 w-28 text-center">Midterm (30%)</th>
                                    <th className="px-5 py-3 w-28 text-center">Final (40%)</th>
                                    <th className="px-5 py-3 text-center">Current Rating</th>
                                    <th className="px-5 py-3 text-center">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {grades.length > 0 ? (
                                    grades.map((g) => {
                                        const entry = localGrades[g.id] || { prelim: '', midterm: '', final: '' };

                                        return (
                                            <tr key={g.id} className="hover:bg-slate-50">
                                                <td className="px-5 py-3">
                                                    <div className="font-semibold text-slate-900">{g.studentName}</div>
                                                    <div className="font-mono text-[11px] text-blue-600">{g.studentId}</div>
                                                </td>

                                                <td className="px-5 py-3 text-slate-600">{g.section}</td>

                                                <td className="px-5 py-2 text-center">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                        value={entry.prelim}
                                                        onChange={(e) => handleGradeChange(g.id, 'prelim', e.target.value)}
                                                        className="w-20 font-mono text-xs px-2 py-1.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-500 text-center font-semibold"
                                                        placeholder="-"
                                                    />
                                                </td>

                                                <td className="px-5 py-2 text-center">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                        value={entry.midterm}
                                                        onChange={(e) => handleGradeChange(g.id, 'midterm', e.target.value)}
                                                        className="w-20 font-mono text-xs px-2 py-1.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-500 text-center font-semibold"
                                                        placeholder="-"
                                                    />
                                                </td>

                                                <td className="px-5 py-2 text-center">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                        value={entry.final}
                                                        onChange={(e) => handleGradeChange(g.id, 'final', e.target.value)}
                                                        className="w-20 font-mono text-xs px-2 py-1.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-500 text-center font-semibold"
                                                        placeholder="-"
                                                    />
                                                </td>

                                                <td className="px-5 py-3 font-mono font-bold text-sm text-center text-slate-900">
                                                    {g.final_rating !== null ? `${g.final_rating}%` : '-'}
                                                </td>

                                                <td className="px-5 py-3 text-center">
                                                    <StatusBadge status={g.remarks} />
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                                            No students enrolled in this course for the current term.
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

