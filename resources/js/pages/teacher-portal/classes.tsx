import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { BookMarked, Award, Users } from 'lucide-react';

interface ClassItem {
    subjectId: number;
    subjectCode: string;
    subjectName: string;
    units: number;
    totalStudents: number;
    students: Array<{
        enrollmentId: number;
        studentId: string;
        name: string;
        section: string;
        yearLevel: string;
    }>;
}

interface TeacherClassesProps {
    classes: ClassItem[];
    activeAcademicYear?: string;
    activeSemester?: string;
}

export default function TeacherClasses({ classes, activeAcademicYear, activeSemester }: TeacherClassesProps) {
    return (
        <AppLayout title="My Assigned Classes">
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Teaching Load</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Academic Period: {activeAcademicYear ?? 'Current AY'} — {activeSemester ?? 'Current Term'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {classes.map((cls) => (
                        <Card key={cls.subjectId}>
                            <CardHeader className="flex items-center justify-between bg-slate-50/70">
                                <div>
                                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                        {cls.subjectCode}
                                    </span>
                                    <CardTitle className="text-sm font-bold text-slate-900 mt-1">
                                        {cls.subjectName}
                                    </CardTitle>
                                    <p className="text-[11px] text-slate-500">{cls.units} Units • {cls.totalStudents} Enrolled</p>
                                </div>

                                <Link href={`/teacher/grades/subject/${cls.subjectId}`}>
                                    <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs">
                                        <Award className="w-3.5 h-3.5" />
                                        <span>Enter Grades</span>
                                    </Button>
                                </Link>
                            </CardHeader>

                            <CardBody className="p-4">
                                <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Class Roster Preview</p>
                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                    {cls.students.map((st, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs">
                                            <div>
                                                <span className="font-semibold text-slate-800">{st.name}</span>
                                                <span className="font-mono text-[10px] text-slate-400 block">{st.studentId}</span>
                                            </div>
                                            <span className="text-slate-500 text-[11px]">{st.section}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

