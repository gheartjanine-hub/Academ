import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap } from 'lucide-react';

interface StudentProfileProps {
    student: {
        id: number;
        student_id: string;
        full_name: string;
        gender: string | null;
        date_of_birth: string | null;
        email: string;
        contact_number: string | null;
        address: string | null;
        year_level: string | null;
        status: string;
        program?: { code: string; name: string; department: string } | null;
        section?: { name: string } | null;
        academic_year?: { name: string } | null;
    };
}

export default function StudentProfile({ student }: StudentProfileProps) {
    return (
        <AppLayout title="My Student Profile">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Profile</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Your official academic and personal record on file</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center uppercase shadow-md shadow-blue-500/20">
                        {student.full_name[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">{student.full_name}</h3>
                            <StatusBadge status={student.status} />
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                            Student ID: <strong className="text-blue-600">{student.student_id}</strong>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Academic Program Placement</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-3 text-xs">
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Program</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.program?.code} - {student.program?.name}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Department</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.program?.department}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Year Level & Section</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.year_level} ({student.section?.name ?? 'Unassigned'})</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Personal Information</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-3 text-xs">
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Email Address</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.email}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Contact Number</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.contact_number || 'None provided'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Gender & Date of Birth</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.gender || 'N/A'} • {student.date_of_birth || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-semibold uppercase text-[10px]">Address</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.address || 'No address on file'}</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

