import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Printer, Award, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';

interface AcademicRecordShowProps {
    student: {
        id: number;
        studentId: string;
        name: string;
        program: string;
        programCode: string;
        yearLevel: string;
        section: string;
        status: string;
        email: string;
    };
    termRecords: Array<{
        term: string;
        academicYear?: string;
        semester?: string;
        totalUnits: number;
        passedUnits: number;
        gpa: number | null;
        averageGrade: number | null;
        subjects: Array<{
            id: number;
            code: string;
            name: string;
            units: number;
            prelim: number | null;
            midterm: number | null;
            final: number | null;
            rating: number | null;
            remarks: string;
            teacher?: string;
        }>;
    }>;
    summary: {
        totalSubjects: number;
        passedSubjects: number;
        failedSubjects: number;
        incompleteSubjects: number;
        totalUnits: number;
        earnedUnits: number;
        generalAverage: number | null;
        cumulativeGpa: number | null;
    };
}

export default function AcademicRecordShow({ student, termRecords, summary }: AcademicRecordShowProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout title={`Official Academic Record - ${student.name}`}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Action Bar (hidden in print) */}
                <div className="flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-3">
                        <Link href={`/students/${student.id}`} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Academic Record</h2>
                            <p className="text-xs text-slate-500">Official scholastic transcript and curriculum grading summary</p>
                        </div>
                    </div>

                    <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                        <Printer className="w-4 h-4" />
                        <span>Print Transcript</span>
                    </Button>
                </div>

                {/* Printable Academic Record Sheet */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs print:border-none print:shadow-none print:p-0 space-y-8">
                    {/* Header Seal */}
                    <div className="text-center border-b border-slate-200 pb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-2 shadow-xs">
                            <GraduationCap className="w-7 h-7" />
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-900 uppercase tracking-wide">
                            AcadEase Higher Education Institution
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">Office of the University Registrar • Official Academic Transcript</p>
                    </div>

                    {/* Student Information Section */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
                        <div>
                            <p className="text-slate-400 uppercase font-semibold text-[10px]">Student ID</p>
                            <p className="font-mono font-bold text-blue-600 mt-0.5 text-sm">{student.studentId}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 uppercase font-semibold text-[10px]">Student Name</p>
                            <p className="font-bold text-slate-900 mt-0.5 text-sm">{student.name}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 uppercase font-semibold text-[10px]">Degree / Program</p>
                            <p className="font-semibold text-slate-800 mt-0.5">{student.programCode} - {student.program}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 uppercase font-semibold text-[10px]">Year & Section</p>
                            <p className="font-semibold text-slate-800 mt-0.5">{student.yearLevel} ({student.section})</p>
                        </div>
                    </div>

                    {/* Academic Record organized by Academic Year and Semester */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                            Scholastic Grading Record
                        </h3>

                        {termRecords.length > 0 ? (
                            termRecords.map((term, index) => (
                                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="px-5 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <h4 className="text-xs font-bold text-slate-800">
                                            {term.term}
                                        </h4>
                                        <div className="flex items-center gap-4 text-xs text-slate-600">
                                            <span>Units: <strong className="text-slate-900">{term.totalUnits}</strong></span>
                                            <span>Term Average: <strong className="text-slate-900">{term.averageGrade ? `${term.averageGrade}%` : 'N/A'}</strong></span>
                                            {term.gpa && <span>Term GPA: <strong className="text-blue-600">{term.gpa}</strong></span>}
                                        </div>
                                    </div>

                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[11px]">
                                            <tr>
                                                <th className="px-5 py-2.5 w-28">Subject Code</th>
                                                <th className="px-5 py-2.5">Subject Description</th>
                                                <th className="px-5 py-2.5 text-center w-20">Units</th>
                                                <th className="px-5 py-2.5 text-center w-24">Grade</th>
                                                <th className="px-5 py-2.5 text-center w-28">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {term.subjects.map((sub) => (
                                                <tr key={sub.id} className="hover:bg-slate-50/50">
                                                    <td className="px-5 py-2.5 font-mono font-bold text-slate-800">
                                                        {sub.code}
                                                    </td>
                                                    <td className="px-5 py-2.5 font-medium text-slate-800">
                                                        {sub.name}
                                                    </td>
                                                    <td className="px-5 py-2.5 text-center font-medium text-slate-700">
                                                        {sub.units}
                                                    </td>
                                                    <td className="px-5 py-2.5 text-center font-mono font-bold text-slate-900">
                                                        {sub.rating !== null ? `${sub.rating}%` : '-'}
                                                    </td>
                                                    <td className="px-5 py-2.5 text-center">
                                                        <StatusBadge status={sub.remarks} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400 text-center py-6">No grading records found for this student.</p>
                        )}
                    </div>

                    {/* Cumulative Summary Box */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full sm:w-auto">
                            <div>
                                <p className="text-slate-400 text-[10px] font-semibold uppercase">Total Units Enrolled</p>
                                <p className="font-bold text-slate-900 text-sm mt-0.5">{summary.totalUnits}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] font-semibold uppercase">Units Earned (Passed)</p>
                                <p className="font-bold text-emerald-600 text-sm mt-0.5">{summary.earnedUnits}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] font-semibold uppercase">General Weighted Avg</p>
                                <p className="font-bold text-slate-900 text-sm mt-0.5">
                                    {summary.generalAverage ? `${summary.generalAverage}%` : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] font-semibold uppercase">Cumulative GPA</p>
                                <p className="font-bold text-blue-600 text-sm mt-0.5">
                                    {summary.cumulativeGpa ?? 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="text-right text-[11px] text-slate-400">
                            <p>Status: <strong className="text-slate-700 capitalize">{student.status}</strong></p>
                            <p className="mt-0.5">Generated: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Signatures Section for Official Transcript */}
                    <div className="grid grid-cols-2 gap-12 pt-12 text-center text-xs">
                        <div>
                            <div className="border-b border-slate-400 w-48 mx-auto pb-1 mb-1 font-semibold text-slate-800">
                                College Dean
                            </div>
                            <p className="text-slate-500 text-[11px]">Academic Affairs Department</p>
                        </div>
                        <div>
                            <div className="border-b border-slate-400 w-48 mx-auto pb-1 mb-1 font-semibold text-slate-800">
                                University Registrar
                            </div>
                            <p className="text-slate-500 text-[11px]">Official University Seal</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

