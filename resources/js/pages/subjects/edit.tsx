import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface EditSubjectProps {
    subject: {
        id: number;
        code: string;
        name: string;
        description: string | null;
        units: number;
        program_id: number | null;
        department: string | null;
        year_level: string | null;
        semester: string | null;
        status: string;
    };
    programs: Array<{ id: number; code: string; name: string; department: string }>;
}

export default function EditSubject({ subject, programs }: EditSubjectProps) {
    const { data, setData, put, processing, errors } = useForm({
        code: subject.code,
        name: subject.name,
        description: subject.description || '',
        units: subject.units,
        program_id: subject.program_id ? String(subject.program_id) : '',
        department: subject.department || '',
        year_level: subject.year_level || '1st Year',
        semester: subject.semester || '1st Semester',
        status: subject.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/subjects/${subject.id}`);
    };

    return (
        <AppLayout title={`Edit Subject - ${subject.code}`}>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href={`/subjects/${subject.id}`} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Subject</h2>
                        <p className="text-xs text-slate-500">Update details for course {subject.code}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Subject Information</CardTitle>
                        </CardHeader>
                        <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Subject Code <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                                {errors.code && <p className="text-xs text-rose-500 mt-1">{errors.code}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Credit Units <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={data.units}
                                    onChange={(e) => setData('units', Number(e.target.value))}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.units && <p className="text-xs text-rose-500 mt-1">{errors.units}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Subject Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Program</label>
                                <select
                                    value={data.program_id}
                                    onChange={(e) => setData('program_id', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">General Education</option>
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                                    ))}
                                </select>
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
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                                <select
                                    value={data.semester}
                                    onChange={(e) => setData('semester', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1st Semester">1st Semester</option>
                                    <option value="2nd Semester">2nd Semester</option>
                                    <option value="Summer">Summer</option>
                                </select>
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
                        </CardBody>
                    </Card>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href={`/subjects/${subject.id}`}>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </Link>
                        <Button type="submit" isLoading={processing} className="gap-2">
                            <Save className="w-4 h-4" />
                            <span>Update Subject</span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

