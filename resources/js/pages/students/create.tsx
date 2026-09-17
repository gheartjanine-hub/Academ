import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, UserCheck } from 'lucide-react';

interface CreateStudentProps {
    programs: Array<{ id: number; code: string; name: string }>;
    sections: Array<{ id: number; name: string; program_id: number; year_level: string }>;
    academicYears: Array<{ id: number; name: string; is_active: boolean }>;
}

export default function CreateStudent({ programs, sections, academicYears }: CreateStudentProps) {
    const activeAy = academicYears.find((ay) => ay.is_active);

    const { data, setData, post, processing, errors } = useForm({
        student_id: `STD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        date_of_birth: '',
        gender: 'Male',
        address: '',
        contact_number: '',
        email: '',
        program_id: programs[0]?.id ? String(programs[0].id) : '',
        year_level: '1st Year',
        section_id: '',
        academic_year_id: activeAy ? String(activeAy.id) : '',
        status: 'active',
        create_user_account: true,
        password: 'password123',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/students');
    };

    // Filter sections by selected program
    const filteredSections = sections.filter(
        (s) => !data.program_id || String(s.program_id) === String(data.program_id)
    );

    return (
        <AppLayout title="Add New Student">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/students" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Add New Student</h2>
                            <p className="text-xs text-slate-500">Register student details, program assignment, and portal credentials</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Identification & Academic Placement */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Academic Information</CardTitle>
                        </CardHeader>
                        <CardBody className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Student ID <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.student_id && <p className="text-xs text-rose-500 mt-1">{errors.student_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Program / Course <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.program_id}
                                    onChange={(e) => setData('program_id', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Program</option>
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.code} - {p.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.program_id && <p className="text-xs text-rose-500 mt-1">{errors.program_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Year Level <span className="text-rose-500">*</span>
                                </label>
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
                                {errors.year_level && <p className="text-xs text-rose-500 mt-1">{errors.year_level}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
                                <select
                                    value={data.section_id}
                                    onChange={(e) => setData('section_id', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">No Section</option>
                                    {filteredSections.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.year_level})
                                        </option>
                                    ))}
                                </select>
                                {errors.section_id && <p className="text-xs text-rose-500 mt-1">{errors.section_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
                                <select
                                    value={data.academic_year_id}
                                    onChange={(e) => setData('academic_year_id', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Academic Year</option>
                                    {academicYears.map((ay) => (
                                        <option key={ay.id} value={ay.id}>
                                            {ay.name} {ay.is_active ? '(Active)' : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.academic_year_id && <p className="text-xs text-rose-500 mt-1">{errors.academic_year_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="graduated">Graduated</option>
                                    <option value="dropped">Dropped</option>
                                </select>
                                {errors.status && <p className="text-xs text-rose-500 mt-1">{errors.status}</p>}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Personal Information</CardTitle>
                        </CardHeader>
                        <CardBody className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    First Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.first_name && <p className="text-xs text-rose-500 mt-1">{errors.first_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Middle Name</label>
                                <input
                                    type="text"
                                    value={data.middle_name}
                                    onChange={(e) => setData('middle_name', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Last Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.last_name && <p className="text-xs text-rose-500 mt-1">{errors.last_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Suffix (e.g. Jr, III)</label>
                                <input
                                    type="text"
                                    value={data.suffix}
                                    onChange={(e) => setData('suffix', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.date_of_birth && <p className="text-xs text-rose-500 mt-1">{errors.date_of_birth}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Email Address <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    value={data.contact_number}
                                    onChange={(e) => setData('contact_number', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="+63 900 000 0000"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Complete Address</label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={2}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Street, Barangay, City, Province, Postal Code"
                                />
                            </div>
                        </CardBody>
                    </Card>

                    {/* Student Portal Account Creation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <span>Student Portal Account</span>
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={data.create_user_account}
                                    onChange={(e) => setData('create_user_account', e.target.checked)}
                                    className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Create user login for student portal with role <strong>Student</strong></span>
                            </label>

                            {data.create_user_account && (
                                <div className="max-w-xs pt-2">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Initial Password
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="password123"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">Default is password123</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href="/students">
                            <Button type="button" variant="secondary">Cancel</Button>
                        </Link>
                        <Button type="submit" isLoading={processing} className="gap-2">
                            <Save className="w-4 h-4" />
                            <span>Save Student</span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

