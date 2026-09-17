import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { Printer, Filter, FileSpreadsheet, Download, GraduationCap } from 'lucide-react';

interface ReportsProps {
    reportType: string;
    reportData: any;
    filters: {
        academic_year_id?: string;
        semester_id?: string;
        program_id?: string;
        year_level?: string;
        section_id?: string;
        student_id?: string;
    };
    academicYears: Array<{ id: number; name: string }>;
    semesters: Array<{ id: number; name: string }>;
    programs: Array<{ id: number; code: string; name: string }>;
    sections: Array<{ id: number; name: string }>;
    students: Array<{ id: number; student_id: string; first_name: string; last_name: string }>;
}

export default function ReportsIndex({
    reportType,
    reportData,
    filters,
    academicYears,
    semesters,
    programs,
    sections,
    students,
}: ReportsProps) {
    const [selectedType, setSelectedType] = useState(reportType);
    const [ayId, setAyId] = useState(filters.academic_year_id || '');
    const [semId, setSemId] = useState(filters.semester_id || '');
    const [progId, setProgId] = useState(filters.program_id || '');
    const [yearLevel, setYearLevel] = useState(filters.year_level || '');
    const [secId, setSecId] = useState(filters.section_id || '');
    const [studId, setStudId] = useState(filters.student_id || '');

    const reportOptions = [
        { id: 'student_list', name: 'Student Master List' },
        { id: 'grade_report', name: 'Grade Summary Report' },
        { id: 'class_grade_report', name: 'Class Grade Sheet' },
        { id: 'enrollment_report', name: 'Enrollment Statistics Report' },
        { id: 'subject_list', name: 'Subject Curriculum List' },
        { id: 'teacher_list', name: 'Faculty & Teacher List' },
    ];

    const handleGenerate = () => {
        router.get('/reports', {
            report_type: selectedType,
            academic_year_id: ayId,
            semester_id: semId,
            program_id: progId,
            year_level: yearLevel,
            section_id: secId,
            student_id: studId,
        }, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout title="Reports Center">
            <div className="space-y-6">
                {/* Header (hidden in print) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reports Center</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Generate, filter, and print official institutional reports</p>
                    </div>

                    <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                        <Printer className="w-4 h-4" />
                        <span>Print Report</span>
                    </Button>
                </div>

                {/* Report Configuration & Filters Card (hidden in print) */}
                <Card className="p-5 print:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Select Report Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500"
                            >
                                {reportOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
                            <select
                                value={ayId}
                                onChange={(e) => setAyId(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Academic Years</option>
                                {academicYears.map((ay) => (
                                    <option key={ay.id} value={ay.id}>{ay.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                            <select
                                value={semId}
                                onChange={(e) => setSemId(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Semesters</option>
                                {semesters.map((sem) => (
                                    <option key={sem.id} value={sem.id}>{sem.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Program</label>
                            <select
                                value={progId}
                                onChange={(e) => setProgId(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Programs</option>
                                {programs.map((p) => (
                                    <option key={p.id} value={p.id}>{p.code}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Year Level</label>
                            <select
                                value={yearLevel}
                                onChange={(e) => setYearLevel(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Year Levels</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 mb-1">Section</label>
                            <select
                                value={secId}
                                onChange={(e) => setSecId(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Sections</option>
                                {sections.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2 flex items-end">
                            <Button onClick={handleGenerate} className="w-full py-2 gap-1.5 font-semibold text-xs">
                                <Filter className="w-4 h-4" />
                                <span>Generate Report</span>
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Printable Report Output Sheet */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs print:border-none print:shadow-none print:p-0 space-y-6">
                    {/* Official Letterhead */}
                    <div className="text-center border-b border-slate-200 pb-5">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white mb-2 shadow-xs">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h1 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
                            AcadEase Higher Education System
                        </h1>
                        <p className="text-xs text-slate-500">Official Institutional Report • Generated on {new Date().toLocaleDateString()}</p>
                        <h2 className="text-sm font-bold text-blue-700 uppercase mt-2">
                            {reportOptions.find((r) => r.id === selectedType)?.name}
                        </h2>
                    </div>

                    {/* Report Table Display */}
                    <div className="overflow-x-auto">
                        {selectedType === 'student_list' && Array.isArray(reportData) && (
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                                    <tr>
                                        <th className="px-4 py-2.5">#</th>
                                        <th className="px-4 py-2.5">Student ID</th>
                                        <th className="px-4 py-2.5">Full Name</th>
                                        <th className="px-4 py-2.5">Program</th>
                                        <th className="px-4 py-2.5">Year Level</th>
                                        <th className="px-4 py-2.5">Section</th>
                                        <th className="px-4 py-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reportData.map((st: any, i: number) => (
                                        <tr key={st.id}>
                                            <td className="px-4 py-2 text-slate-400 font-mono">{i + 1}</td>
                                            <td className="px-4 py-2 font-mono font-bold text-blue-600">{st.student_id}</td>
                                            <td className="px-4 py-2 font-semibold text-slate-900">{st.first_name} {st.last_name}</td>
                                            <td className="px-4 py-2">{st.program?.code}</td>
                                            <td className="px-4 py-2">{st.year_level}</td>
                                            <td className="px-4 py-2">{st.section?.name ?? 'N/A'}</td>
                                            <td className="px-4 py-2"><StatusBadge status={st.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {(selectedType === 'grade_report' || selectedType === 'class_grade_report') && Array.isArray(reportData) && (
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                                    <tr>
                                        <th className="px-4 py-2.5">Student</th>
                                        <th className="px-4 py-2.5">Subject</th>
                                        <th className="px-4 py-2.5">Units</th>
                                        <th className="px-4 py-2.5">Prelim</th>
                                        <th className="px-4 py-2.5">Midterm</th>
                                        <th className="px-4 py-2.5">Final</th>
                                        <th className="px-4 py-2.5 font-bold text-center">Rating</th>
                                        <th className="px-4 py-2.5 text-center">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reportData.map((g: any) => (
                                        <tr key={g.id}>
                                            <td className="px-4 py-2">
                                                <span className="font-semibold text-slate-900">{g.student?.first_name} {g.student?.last_name}</span>
                                                <span className="font-mono text-[10px] text-blue-600 block">{g.student?.student_id}</span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className="font-mono font-bold text-slate-800">{g.subject?.code}</span> - {g.subject?.name}
                                            </td>
                                            <td className="px-4 py-2">{g.subject?.units}</td>
                                            <td className="px-4 py-2 font-mono">{g.prelim_grade ?? '-'}</td>
                                            <td className="px-4 py-2 font-mono">{g.midterm_grade ?? '-'}</td>
                                            <td className="px-4 py-2 font-mono">{g.final_grade ?? '-'}</td>
                                            <td className="px-4 py-2 font-mono font-bold text-center">{g.final_rating !== null ? `${g.final_rating}%` : '-'}</td>
                                            <td className="px-4 py-2 text-center"><StatusBadge status={g.remarks} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {selectedType === 'enrollment_report' && Array.isArray(reportData) && (
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                                    <tr>
                                        <th className="px-4 py-2.5">Student</th>
                                        <th className="px-4 py-2.5">Program & Year</th>
                                        <th className="px-4 py-2.5">Academic Term</th>
                                        <th className="px-4 py-2.5">Section</th>
                                        <th className="px-4 py-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reportData.map((enr: any) => (
                                        <tr key={enr.id}>
                                            <td className="px-4 py-2">
                                                <span className="font-semibold text-slate-900">{enr.student?.first_name} {enr.student?.last_name}</span>
                                                <span className="font-mono text-[10px] text-blue-600 block">{enr.student?.student_id}</span>
                                            </td>
                                            <td className="px-4 py-2">{enr.student?.program?.code} • {enr.year_level}</td>
                                            <td className="px-4 py-2">{enr.academic_year?.name} - {enr.semester?.name}</td>
                                            <td className="px-4 py-2">{enr.section?.name ?? 'Unassigned'}</td>
                                            <td className="px-4 py-2"><StatusBadge status={enr.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {selectedType === 'subject_list' && Array.isArray(reportData) && (
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                                    <tr>
                                        <th className="px-4 py-2.5">Code</th>
                                        <th className="px-4 py-2.5">Subject Name</th>
                                        <th className="px-4 py-2.5">Units</th>
                                        <th className="px-4 py-2.5">Program</th>
                                        <th className="px-4 py-2.5">Year & Term</th>
                                        <th className="px-4 py-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reportData.map((sub: any) => (
                                        <tr key={sub.id}>
                                            <td className="px-4 py-2 font-mono font-bold text-blue-600">{sub.code}</td>
                                            <td className="px-4 py-2 font-semibold text-slate-900">{sub.name}</td>
                                            <td className="px-4 py-2">{sub.units} units</td>
                                            <td className="px-4 py-2">{sub.program?.code ?? 'General'}</td>
                                            <td className="px-4 py-2">{sub.year_level} • {sub.semester}</td>
                                            <td className="px-4 py-2"><StatusBadge status={sub.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {selectedType === 'teacher_list' && Array.isArray(reportData) && (
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                                    <tr>
                                        <th className="px-4 py-2.5">Teacher ID</th>
                                        <th className="px-4 py-2.5">Name</th>
                                        <th className="px-4 py-2.5">Email</th>
                                        <th className="px-4 py-2.5">Department</th>
                                        <th className="px-4 py-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reportData.map((t: any) => (
                                        <tr key={t.id}>
                                            <td className="px-4 py-2 font-mono font-bold text-blue-600">{t.teacher_id}</td>
                                            <td className="px-4 py-2 font-semibold text-slate-900">{t.first_name} {t.last_name}</td>
                                            <td className="px-4 py-2 text-slate-600">{t.email}</td>
                                            <td className="px-4 py-2">{t.department}</td>
                                            <td className="px-4 py-2"><StatusBadge status={t.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Report Footer */}
                    <div className="pt-8 border-t border-slate-200 text-xs flex justify-between items-center text-slate-400">
                        <p>Total Records: {Array.isArray(reportData) ? reportData.length : 0}</p>
                        <p>AcadEase Academic Records System</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

