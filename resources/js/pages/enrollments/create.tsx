import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, BookOpen, Check } from 'lucide-react';

interface CreateEnrollmentProps {
    students: Array<{ id: number; student_id: string; first_name: string; last_name: string; program_id: number; year_level: string; section_id: number | null }>;
    academicYears: Array<{ id: number; name: string; is_active: boolean }>;
    semesters: Array<{ id: number; name: string; academic_year_id: number; is_active: boolean }>;
    programs: Array<{ id: number; code: string; name: string }>;
    sections: Array<{ id: number; name: string; program_id: number; year_level: string }>;
    subjects: Array<{ id: number; code: string; name: string; units: number; program_id: number | null; year_level: string | null; semester: string | null }>;
    teachers: Array<{ id: number; first_name: string; last_name: string }>;
    preselectedStudentId?: string;
}

export default function CreateEnrollment({
    students,
    academicYears,
    semesters,
    programs,
    sections,
    subjects,
    teachers,
    preselectedStudentId,
}: CreateEnrollmentProps) {
    const activeAy = academicYears.find((ay) => ay.is_active);
    const activeSem = semesters.find((s) => s.is_active);

    const initialStudent = students.find((s) => String(s.id) === String(preselectedStudentId));

    const { data, setData, post, processing, errors } = useForm({
        student_id: initialStudent?.id ? String(initialStudent.id) : '',
        academic_year_id: activeAy ? String(activeAy.id) : (academicYears[0]?.id ? String(academicYears[0].id) : ''),
        semester_id: activeSem ? String(activeSem.id) : (semesters[0]?.id ? String(semesters[0].id) : ''),
        program_id: initialStudent?.program_id ? String(initialStudent.program_id) : (programs[0]?.id ? String(programs[0].id) : ''),
        year_level: initialStudent?.year_level || '1st Year',
        section_id: initialStudent?.section_id ? String(initialStudent.section_id) : '',
        status: 'enrolled',
        enrollment_date: new Date().toISOString().split('T')[0],
        remarks: '',
        subjects: [] as Array<{ subject_id: number; teacher_id: number | null }>,
    });

    // Auto-populate when student changes
    const handleStudentChange = (stId: string) => {
        const st = students.find((s) => String(s.id) === String(stId));
        setData({
            ...data,
            student_id: stId,
            program_id: st?.program_id ? String(st.program_id) : data.program_id,
            year_level: st?.year_level || data.year_level,
            section_id: st?.section_id ? String(st.section_id) : '',
        });
    };

    // Filter available subjects based on selected program and year level
    const relevantSubjects = subjects.filter(
        (sub) => !sub.program_id || String(sub.program_id) === String(data.program_id)
    );

    const filteredSections = sections.filter(
        (sec) => !data.program_id || String(sec.program_id) === String(data.program_id)
    );

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

    const totalSelectedUnits = data.subjects.reduce((sum, item) => {
        const sub = subjects.find((s) => s.id === item.subject_id);
        return sum + (sub?.units || 0);
    }, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/enrollments');
    };

    return (
        <AppLayout title="Enroll Student">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/enrollments" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Enroll Student</h2>
                        <p className="text-xs text-slate-500">Register student for academic term, section, and assign coursework subjects</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Enrollment & Student Details</CardTitle>
                        </CardHeader>
                        <CardBody className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-3">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Select Student <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.student_id}
                                    onChange={(e) => handleStudentChange(e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Student to Enroll</option>
                                    {students.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.student_id} - {st.first_name} {st.last_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.student_id && <p className="text-xs text-rose-500 mt-1">{errors.student_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Academic Year <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.academic_year_id}
                                    onChange={(e) => setData('academic_year_id', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    {academicYears.map((ay) => (
                                        <option key={ay.id} value={ay.id}>
                                            {ay.name} {ay.is_active ? '(Active)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Semester <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.semester_id}
                                    onChange={(e) => setData('semester_id', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    {semesters.map((sem) => (
                                        <option key={sem.id} value={sem.id}>
                                            {sem.name} {sem.is_active ? '(Active)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Program / Course <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.program_id}
                                    onChange={(e) => setData('program_id', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Year Level</label>
                                <select
                                    value={data.year_level}
                                    onChange={(e) => setData('year_level', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
                                <select
                                    value={data.section_id}
                                    onChange={(e) => setData('section_id', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Section</option>
                                    {filteredSections.map((sec) => (
                                        <option key={sec.id} value={sec.id}>
                                            {sec.name} ({sec.year_level})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Enrollment Status</label>
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
                        </CardBody>
                    </Card>

                    {/* Subject Selection Checklist */}
                    <Card>
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span>Subject Load Selection</span>
                            </CardTitle>
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                {data.subjects.length} subject(s) • {totalSelectedUnits} Total Units
                            </span>
                        </CardHeader>
                        <CardBody className="space-y-3">
                            {errors.subjects && (
                                <p className="text-xs text-rose-600 font-medium">
                                    Please select at least 1 subject to complete enrollment.
                                </p>
                            )}

                            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                                {relevantSubjects.map((sub) => {
                                    const selectedItem = data.subjects.find((s) => s.subject_id === sub.id);
                                    const isSelected = !!selectedItem;

                                    return (
                                        <div
                                            key={sub.id}
                                            className={`p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                                                isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id={`sub-${sub.id}`}
                                                    checked={isSelected}
                                                    onChange={() => toggleSubject(sub.id)}
                                                    className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                                <label htmlFor={`sub-${sub.id}`} className="cursor-pointer">
                                                    <span className="font-mono font-bold text-xs text-blue-700 mr-2">
                                                        {sub.code}
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-900">
                                                        {sub.name}
                                                    </span>
                                                    <span className="text-xs text-slate-500 ml-2">
                                                        ({sub.units} units)
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Teacher selection when subject is selected */}
                                            {isSelected && (
                                                <div className="w-full sm:w-64 pl-7 sm:pl-0">
                                                    <select
                                                        value={selectedItem.teacher_id ?? ''}
                                                        onChange={(e) => handleTeacherSelect(sub.id, e.target.value)}
                                                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Assign Teacher (Optional)</option>
                                                        {teachers.map((t) => (
                                                            <option key={t.id} value={t.id}>
                                                                {t.first_name} {t.last_name}
                                                            </option>
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
                        <Link href="/enrollments">
                            <Button type="button" variant="secondary">Cancel</Button>
                        </Link>
                        <Button type="submit" isLoading={processing} className="gap-2">
                            <Save className="w-4 h-4" />
                            <span>Confirm Enrollment</span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

