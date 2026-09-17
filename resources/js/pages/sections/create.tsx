import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface CreateSectionProps {
    programs: Array<{ id: number; code: string; name: string }>;
    academicYears: Array<{ id: number; name: string; is_active: boolean }>;
    teachers: Array<{ id: number; first_name: string; last_name: string }>;
}

export default function CreateSection({ programs, academicYears, teachers }: CreateSectionProps) {
    const activeAy = academicYears.find((ay) => ay.is_active);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        program_id: programs[0]?.id ? String(programs[0].id) : '',
        year_level: '1st Year',
        academic_year_id: activeAy ? String(activeAy.id) : (academicYears[0]?.id ? String(academicYears[0].id) : ''),
        adviser_id: '',
        max_students: 40,
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sections');
    };

    return (
        <AppLayout title="Add Section">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/sections" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Add New Section</h2>
                        <p className="text-xs text-slate-500">Configure section name, adviser assignment, and student limit</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Section Details</CardTitle>
                        </CardHeader>
                        <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Section Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. BSIT-1A"
                                />
                                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
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
                                    <option value="">Select Program</option>
                                    {programs.map((p) => (
                                        <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
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
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
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
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Adviser</label>
                                <select
                                    value={data.adviser_id}
                                    onChange={(e) => setData('adviser_id', e.target.value)}
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">No Adviser Assigned</option>
                                    {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Maximum Students <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="5"
                                    max="100"
                                    value={data.max_students}
                                    onChange={(e) => setData('max_students', Number(e.target.value))}
                                    required
                                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
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
                        <Link href="/sections">
                            <Button type="button" variant="secondary">Cancel</Button>
                        </Link>
                        <Button type="submit" isLoading={processing} className="gap-2">
                            <Save className="w-4 h-4" />
                            <span>Save Section</span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

