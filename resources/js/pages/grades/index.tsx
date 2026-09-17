import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/badge';
import { Pagination, PaginationLink } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { router, useForm } from '@inertiajs/react';
import { Save, Filter, Award, CheckCircle2, AlertCircle } from 'lucide-react';

interface GradeItem {
    id: number;
    student_id: number;
    subject_id: number;
    prelim_grade: number | null;
    midterm_grade: number | null;
    final_grade: number | null;
    final_rating: number | null;
    remarks: string;
    student?: { id: number; student_id: string; first_name: string; last_name: string; section?: { name: string } } | null;
    subject?: { id: number; code: string; name: string; units: number } | null;
    teacher?: { id: number; first_name: string; last_name: string } | null;
    academic_year?: { id: number; name: string } | null;
    semester?: { id: number; name: string } | null;
}

interface GradesIndexProps {
    grades: {
        data: GradeItem[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        academic_year_id?: string;
        semester_id?: string;
        subject_id?: string;
        section_id?: string;
        search?: string;
    };
    academicYears: Array<{ id: number; name: string; is_active: boolean }>;
    semesters: Array<{ id: number; name: string; academic_year_id: number }>;
    subjects: Array<{ id: number; code: string; name: string }>;
    sections: Array<{ id: number; name: string }>;
    teachers: Array<{ id: number; first_name: string; last_name: string }>;
    gradingSetting: {
        passing_grade: number;
        prelim_weight: number;
        midterm_weight: number;
        final_weight: number;
    };
    canEdit: boolean;
}

export default function GradesIndex({
    grades,
    filters,
    academicYears,
    semesters,
    subjects,
    sections,
    gradingSetting,
    canEdit,
}: GradesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [ayId, setAyId] = useState(filters.academic_year_id || '');
    const [semId, setSemId] = useState(filters.semester_id || '');
    const [subjectId, setSubjectId] = useState(filters.subject_id || '');
    const [sectionId, setSectionId] = useState(filters.section_id || '');

    // Local state for inline grade entries to support batch update
    const [localGrades, setLocalGrades] = useState<Record<number, { prelim: string; midterm: string; final: string }>>(() => {
        const initial: Record<number, { prelim: string; midterm: string; final: string }> = {};
        grades.data.forEach((g) => {
            initial[g.id] = {
                prelim: g.prelim_grade !== null ? String(g.prelim_grade) : '',
                midterm: g.midterm_grade !== null ? String(g.midterm_grade) : '',
                final: g.final_grade !== null ? String(g.final_grade) : '',
            };
        });
        return initial;
    });

    const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);

    const handleFilter = (updates: Record<string, string>) => {
        router.get('/grades', {
            search,
            academic_year_id: ayId,
            semester_id: semId,
            subject_id: subjectId,
            section_id: sectionId,
            ...updates,
        }, { preserveState: true });
    };

    const handleGradeChange = (gradeId: number, field: 'prelim' | 'midterm' | 'final', value: string) => {
        setLocalGrades((prev) => ({
            ...prev,
            [gradeId]: {
                ...prev[gradeId],
                [field]: value,
            },
        }));
    };

    // Calculate preview of final rating and remarks based on grading settings
    const calculatePreview = (gradeId: number) => {
        const entry = localGrades[gradeId];
        if (!entry) return { rating: null, remarks: 'Pending' };

        const p = parseFloat(entry.prelim);
        const m = parseFloat(entry.midterm);
        const f = parseFloat(entry.final);

        if (!isNaN(p) && !isNaN(m) && !isNaN(f)) {
            const pw = gradingSetting.prelim_weight / 100;
            const mw = gradingSetting.midterm_weight / 100;
            const fw = gradingSetting.final_weight / 100;
            const rating = Math.round(((p * pw) + (m * mw) + (f * fw)) * 100) / 100;
            const remarks = rating >= gradingSetting.passing_grade ? 'Passed' : 'Failed';
            return { rating, remarks };
        } else if (!isNaN(p) || !isNaN(m) || !isNaN(f)) {
            return { rating: null, remarks: 'Incomplete' };
        }
        return { rating: null, remarks: 'Pending' };
    };

    const handleBatchSave = () => {
        setIsSubmittingBatch(true);
        const payload = Object.entries(localGrades).map(([id, values]) => ({
            id: Number(id),
            prelim_grade: values.prelim !== '' ? Number(values.prelim) : null,
            midterm_grade: values.midterm !== '' ? Number(values.midterm) : null,
            final_grade: values.final !== '' ? Number(values.final) : null,
        }));

        router.post('/grades/batch-update', { grades: payload }, {
            onFinish: () => setIsSubmittingBatch(false),
        });
    };

    return (
        <AppLayout title="Academic Records & Grade Recording">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Grades & Academic Records</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Passing Criteria: <strong className="text-slate-800">{gradingSetting.passing_grade}%</strong> (Prelim: {gradingSetting.prelim_weight}%, Midterm: {gradingSetting.midterm_weight}%, Final: {gradingSetting.final_weight}%)
                        </p>
                    </div>

                    {canEdit && (
                        <Button
                            onClick={handleBatchSave}
                            isLoading={isSubmittingBatch}
                            className="font-semibold text-xs gap-1.5 shadow-xs bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save All Grades</span>
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <Card className="p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <SearchInput
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handleFilter({ search: e.target.value });
                            }}
                            onClear={() => {
                                setSearch('');
                                handleFilter({ search: '' });
                            }}
                            placeholder="Search student or subject..."
                            className="w-full sm:w-56"
                        />

                        <select
                            value={ayId}
                            onChange={(e) => {
                                setAyId(e.target.value);
                                handleFilter({ academic_year_id: e.target.value });
                            }}
                            aria-label="Filter by Academic Year"
                            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                            <option value="">All Academic Years</option>
                            {academicYears.map((ay) => (
                                <option key={ay.id} value={ay.id}>{ay.name}</option>
                            ))}
                        </select>

                        <select
                            value={semId}
                            onChange={(e) => {
                                setSemId(e.target.value);
                                handleFilter({ semester_id: e.target.value });
                            }}
                            aria-label="Filter by Semester"
                            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                            <option value="">All Semesters</option>
                            {semesters.map((sem) => (
                                <option key={sem.id} value={sem.id}>{sem.name}</option>
                            ))}
                        </select>

                        <select
                            value={subjectId}
                            onChange={(e) => {
                                setSubjectId(e.target.value);
                                handleFilter({ subject_id: e.target.value });
                            }}
                            aria-label="Filter by Subject"
                            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                            <option value="">All Subjects</option>
                            {subjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>
                            ))}
                        </select>

                        <select
                            value={sectionId}
                            onChange={(e) => {
                                setSectionId(e.target.value);
                                handleFilter({ section_id: e.target.value });
                            }}
                            aria-label="Filter by Section"
                            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                            <option value="">All Sections</option>
                            {sections.map((sec) => (
                                <option key={sec.id} value={sec.id}>{sec.name}</option>
                            ))}
                        </select>
                    </div>
                </Card>

                {/* Grade Sheet Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Student</th>
                                    <th className="px-5 py-3.5">Subject</th>
                                    <th className="px-5 py-3.5">Section</th>
                                    <th className="px-5 py-3.5 w-24">Prelim ({gradingSetting.prelim_weight}%)</th>
                                    <th className="px-5 py-3.5 w-24">Midterm ({gradingSetting.midterm_weight}%)</th>
                                    <th className="px-5 py-3.5 w-24">Final ({gradingSetting.final_weight}%)</th>
                                    <th className="px-5 py-3.5 text-center">Rating</th>
                                    <th className="px-5 py-3.5 text-center">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {grades.data.length > 0 ? (
                                    grades.data.map((grade) => {
                                        const preview = calculatePreview(grade.id);
                                        const entry = localGrades[grade.id] || { prelim: '', midterm: '', final: '' };

                                        return (
                                            <tr key={grade.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-5 py-3">
                                                    <div className="font-semibold text-slate-900">
                                                        {grade.student?.first_name} {grade.student?.last_name}
                                                    </div>
                                                    <div className="font-mono text-[11px] text-blue-600">
                                                        {grade.student?.student_id}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-3">
                                                    <div className="font-mono font-bold text-slate-800">
                                                        {grade.subject?.code}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                                                        {grade.subject?.name} ({grade.subject?.units} units)
                                                    </div>
                                                </td>

                                                <td className="px-5 py-3 text-slate-600">
                                                    {grade.student?.section?.name ?? 'Unassigned'}
                                                </td>

                                                {/* Prelim Input */}
                                                <td className="px-5 py-2">
                                                    {canEdit ? (
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="100"
                                                            value={entry.prelim}
                                                            onChange={(e) => handleGradeChange(grade.id, 'prelim', e.target.value)}
                                                            className="w-20 font-mono text-xs px-2 py-1 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 text-center font-semibold"
                                                            placeholder="-"
                                                        />
                                                    ) : (
                                                        <span className="font-mono font-semibold">{grade.prelim_grade ?? '-'}</span>
                                                    )}
                                                </td>

                                                {/* Midterm Input */}
                                                <td className="px-5 py-2">
                                                    {canEdit ? (
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="100"
                                                            value={entry.midterm}
                                                            onChange={(e) => handleGradeChange(grade.id, 'midterm', e.target.value)}
                                                            className="w-20 font-mono text-xs px-2 py-1 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 text-center font-semibold"
                                                            placeholder="-"
                                                        />
                                                    ) : (
                                                        <span className="font-mono font-semibold">{grade.midterm_grade ?? '-'}</span>
                                                    )}
                                                </td>

                                                {/* Final Input */}
                                                <td className="px-5 py-2">
                                                    {canEdit ? (
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="100"
                                                            value={entry.final}
                                                            onChange={(e) => handleGradeChange(grade.id, 'final', e.target.value)}
                                                            className="w-20 font-mono text-xs px-2 py-1 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 text-center font-semibold"
                                                            placeholder="-"
                                                        />
                                                    ) : (
                                                        <span className="font-mono font-semibold">{grade.final_grade ?? '-'}</span>
                                                    )}
                                                </td>

                                                {/* Rating */}
                                                <td className="px-5 py-3 text-center">
                                                    <span className="font-mono font-bold text-sm text-slate-900">
                                                        {preview.rating !== null ? `${preview.rating}%` : (grade.final_rating !== null ? `${grade.final_rating}%` : '-')}
                                                    </span>
                                                </td>

                                                {/* Remarks */}
                                                <td className="px-5 py-3 text-center">
                                                    <StatusBadge status={preview.remarks !== 'Pending' ? preview.remarks : grade.remarks} />
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8}>
                                            <EmptyState
                                                title="No grade records found"
                                                description="Enroll students into classes and subjects to initialize grade records."
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={grades.links}
                        from={grades.from}
                        to={grades.to}
                        total={grades.total}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}

