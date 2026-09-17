import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { router, useForm } from '@inertiajs/react';
import { Plus, Calendar, CheckCircle2, Save, Sparkles } from 'lucide-react';

interface SemesterItem {
    id: number;
    academic_year_id: number;
    name: string;
    is_active: boolean;
}

interface AcademicYearItem {
    id: number;
    name: string;
    start_date: string | null;
    end_date: string | null;
    is_active: boolean;
    semesters: SemesterItem[];
    enrollments_count: number;
    sections_count: number;
}

interface AcademicYearsIndexProps {
    academicYears: AcademicYearItem[];
}

export default function AcademicYearsIndex({ academicYears }: AcademicYearsIndexProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, reset, processing, errors } = useForm({
        name: '2027-2028',
        start_date: '2027-08-01',
        end_date: '2028-05-31',
        is_active: false,
    });

    const handleCreateAY = (e: React.FormEvent) => {
        e.preventDefault();
        post('/academic-years', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleSetActiveAY = (id: number) => {
        router.post(`/academic-years/${id}/set-active`);
    };

    const handleSetActiveSemester = (id: number) => {
        router.post(`/semesters/${id}/set-active`);
    };

    return (
        <AppLayout title="Academic Year & Semesters">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Year & Semesters</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Configure institutional school years and activate academic terms</p>
                    </div>

                    <Button onClick={() => setIsCreateModalOpen(true)} className="font-semibold text-xs gap-1.5 shadow-xs">
                        <Plus className="w-4 h-4" />
                        <span>Add Academic Year</span>
                    </Button>
                </div>

                {/* Academic Years List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {academicYears.map((ay) => (
                        <Card
                            key={ay.id}
                            className={ay.is_active ? 'border-2 border-blue-500 shadow-sm' : ''}
                        >
                            <CardHeader className="flex items-center justify-between bg-slate-50/70">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <CardTitle className="text-sm font-bold text-slate-900">
                                        A.Y. {ay.name}
                                    </CardTitle>
                                </div>
                                {ay.is_active ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                                        <Sparkles className="w-3 h-3" /> Active School Year
                                    </span>
                                ) : (
                                    <Button
                                        onClick={() => handleSetActiveAY(ay.id)}
                                        variant="outline"
                                        size="sm"
                                        className="text-[11px] h-7"
                                    >
                                        Set as Active Year
                                    </Button>
                                )}
                            </CardHeader>

                            <CardBody className="space-y-4 text-xs">
                                <div className="grid grid-cols-2 gap-2 text-slate-600">
                                    <p>Total Enrollments: <strong className="text-slate-900">{ay.enrollments_count}</strong></p>
                                    <p>Sections Active: <strong className="text-slate-900">{ay.sections_count}</strong></p>
                                </div>

                                <div className="pt-3 border-t border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">Semesters / Terms</p>
                                    <div className="space-y-2">
                                        {ay.semesters.map((sem) => (
                                            <div
                                                key={sem.id}
                                                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                                                    sem.is_active
                                                        ? 'bg-blue-50/70 border-blue-200'
                                                        : 'bg-white border-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-800">{sem.name}</span>
                                                    {sem.is_active && (
                                                        <Badge variant="success" size="sm">Current Term</Badge>
                                                    )}
                                                </div>

                                                {!sem.is_active && ay.is_active && (
                                                    <button
                                                        onClick={() => handleSetActiveSemester(sem.id)}
                                                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                                    >
                                                        Activate Term
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Create AY Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Add New Academic Year"
                description="Creates the academic year and automatically prepares 1st, 2nd, and Summer semesters"
            >
                <form onSubmit={handleCreateAY} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Academic Year Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                            placeholder="e.g. 2027-2028"
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="set-active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="set-active" className="text-xs text-slate-700 font-medium cursor-pointer">
                            Set as current active academic year immediately
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={processing} className="gap-1.5">
                            <Save className="w-4 h-4" />
                            <span>Save Academic Year</span>
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}

