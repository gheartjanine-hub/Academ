import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';

interface EditEnrollmentProps {
    enrollment: {
        id: number;
        student_id: number;
        program_id: number;
        section_id: number | null;
        status: string;
        remarks: string | null;
        enrollment_subjects: Array<{
            subject_id: number;
            teacher_id: number | null;
        }>;
    };
    programs: Array<{ id: number; code: string; name: string }>;
    sections: Array<{ id: number; name: string; program_id: number; year_level: string }>;
    subjects: Array<{ id: number; code: string; name: string; units: number }>;
    teachers: Array<{ id: number; first_name: string; last_name: string }>;
}

export default function EditEnrollment({
    enrollment,
    programs,
    sections,
    subjects,
    teachers,
}: EditEnrollmentProps) {
    const { data, setData, put, processing, errors } = useForm({
        section_id: enrollment.section_id ? String(enrollment.section_id) : '',
        status: enrollment.status,
        remarks: enrollment.remarks || '',
        subjects: enrollment.enrollment_subjects.map((es) => ({
            subject_id: es.subject_id,
            teacher_id: es.teacher_id,
        })),
    });

    const toggleSubject = (subjectId: number) => {
        const exists = data.subjects.some((s) => s.subject_id === subjectId);
        if (exists) {
            setData('subjects', data.subjects.filter((s) => s.subject_id !== subjectId));
        } else {
            setData('subjects', [
                ...data.subjects,
                { subject_id: subjectId, teacher_id: null },
            ]);
        }
    };

    const handleTeacherSelect = (subjectId: number, teacherId: string) => {
        setData('subjects', data.subjects.map((s) => {
            if (s.subject_id === subjectId) {
                return { ...s, teacher_id: teacherId ? Number(teacherId) : null };
            }
            return s;
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/enrollments/${enrollment.id}`);
    };

    return (
        <AppLayout title={`Edit Enrollment #${enrollment.id}`}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href={`/enrollments/${enrollment.id}`} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Enrollment #{enrollment.id}</h2>
                        <p className="text-xs text-slate-500">Update assigned section, enrollment status, or adjust subjects</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Enrollment Details</CardTitle>
                        </CardHeader>
                        <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Section</label>
                                <select
                                    value={data.section_id}
                                    onChange={(e) => setData('section_id', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">No Section</option>
                                    {sections.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.year_level})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="enrolled">Enrolled</option>
                                    <option value="pending">Pending</option>
                                    <option value="dropped">Dropped</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks / Notes</label>
                                <textarea
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                    rows={2}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span>Enrolled Subjects ({data.subjects.length})</span>
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-3">
                            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                                {subjects.map((sub) => {
                                    const selectedItem = data.subjects.find((s) => s.subject_id === sub.id);
                                    const isSelected = !!selectedItem;

                                    return (
                                        <div
                                            key={sub.id}
                                            className={`p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                                                isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id={`edit-sub-${sub.id}`}
                                                    checked={isSelected}
                                                    onChange={() => toggleSubject(sub.id)}
                                                    className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor={`edit-sub-${sub.id}`} className="cursor-pointer">
                                                    <span className="font-mono font-bold text-xs text-blue-700 mr-2">{sub.code}</span>
                                                    <span className="text-xs font-semibold text-slate-900">{sub.name}</span>
                                                    <span className="text-xs text-slate-500 ml-2">({sub.units} units)</span>
                                                </label>
                                            </div>

                                            {isSelected && (
                                                <div className="w-full sm:w-64 pl-7 sm:pl-0">
                                                    <select
                                                        value={selectedItem.teacher_id ?? ''}
                                                        onChange={(e) => handleTeacherSelect(sub.id, e.target.value)}
                                                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Assign Teacher</option>
                                                        {teachers.map((t) => (
                                                            <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={`/enrollments/${enrollment.id}`}>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </Link>
                        <Button type="submit" isLoading={processing} className="gap-2">
                            <Save className="w-4 h-4" />
                            <span>Update Enrollment</span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

