import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface EditTeacherProps {
    teacher: {
        id: number;
        teacher_id: string;
        first_name: string;
        middle_name: string | null;
        last_name: string;
        email: string;
        contact_number: string | null;
        department: string | null;
        status: string;
    };
}

export default function EditTeacher({ teacher }: EditTeacherProps) {
    const { data, setData, put, processing, errors } = useForm({
        teacher_id: teacher.teacher_id,
        first_name: teacher.first_name,
        middle_name: teacher.middle_name || '',
        last_name: teacher.last_name,
        email: teacher.email,
        contact_number: teacher.contact_number || '',
        department: teacher.department || '',
        status: teacher.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/teachers/${teacher.id}`);
    };

    return (
        <AppLayout title={`Edit Teacher - ${teacher.first_name} ${teacher.last_name}`}>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href={`/teachers/${teacher.id}`} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Teacher</h2>
                        <p className="text-xs text-slate-500">Update teacher credentials and department</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Teacher Details</CardTitle>
                        </CardHeader>
                        <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Teacher ID <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.teacher_id}
                                    onChange={(e) => setData('teacher_id', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.teacher_id && <p className="text-xs text-rose-500 mt-1">{errors.teacher_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

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
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
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
                                />
                            </div>
                        </CardBody>
                    </Card>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={`/teachers/${teacher.id}`}>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </Link>
                        <Button type="submit" isLoading={processing} className="gap-2">
                            <Save className="w-4 h-4" />
                            <span>Update Teacher</span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

