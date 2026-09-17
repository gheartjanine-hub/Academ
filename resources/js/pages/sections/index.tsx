import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/badge';
import { Pagination, PaginationLink } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Modal } from '@/components/ui/modal';
import { Link, router, useForm } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2, Layers, Save } from 'lucide-react';

interface SectionItem {
    id: number;
    name: string;
    year_level: string;
    max_students: number;
    status: string;
    students_count: number;
    program?: { id: number; code: string; name: string } | null;
    academic_year?: { id: number; name: string } | null;
    adviser?: { id: number; first_name: string; last_name: string } | null;
}

interface SectionsIndexProps {
    sections: {
        data: SectionItem[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        program_id?: string;
        year_level?: string;
    };
    programs: Array<{ id: number; code: string; name: string }>;
}

export default function SectionsIndex({ sections, filters, programs }: SectionsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [programId, setProgramId] = useState(filters.program_id || '');
    const [yearLevel, setYearLevel] = useState(filters.year_level || '');
    const [deactivatingSection, setDeactivatingSection] = useState<SectionItem | null>(null);

    const handleFilter = (updates: Record<string, string>) => {
        router.get('/sections', {
            search,
            program_id: programId,
            year_level: yearLevel,
            ...updates,
        }, { preserveState: true });
    };

    const confirmDeactivate = () => {
        if (!deactivatingSection) return;
        router.delete(`/sections/${deactivatingSection.id}`, {
            onSuccess: () => setDeactivatingSection(null),
        });
    };

    return (
        <AppLayout title="Section Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sections</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Manage student class sections, adviser assignments, and capacity limits</p>
                    </div>
                    <Link href="/sections/create">
                        <Button className="font-semibold text-xs gap-1.5 shadow-xs">
                            <Plus className="w-4 h-4" />
                            <span>Add Section</span>
                        </Button>
                    </Link>
                </div>

                <Card className="p-4 flex flex-wrap items-center gap-3">
                    <SearchInput
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleFilter({ search: e.target.value });
                        }}
                        onClear={() => {
                            setSearch('');
                            handleFilter({ search: '' });
                        }}
                        placeholder="Search section name..."
                        className="w-full sm:w-64"
                    />

                    <select
                        value={programId}
                        onChange={(e) => {
                            setProgramId(e.target.value);
                            handleFilter({ program_id: e.target.value });
                        }}
                        aria-label="Filter by Program"
                        className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                    >
                        <option value="">All Programs</option>
                        {programs.map((p) => (
                            <option key={p.id} value={p.id}>{p.code}</option>
                        ))}
                    </select>

                    <select
                        value={yearLevel}
                        onChange={(e) => {
                            setYearLevel(e.target.value);
                            handleFilter({ year_level: e.target.value });
                        }}
                        aria-label="Filter by Year Level"
                        className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                    >
                        <option value="">All Year Levels</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                    </select>
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Section Name</th>
                                    <th className="px-5 py-3.5">Program</th>
                                    <th className="px-5 py-3.5">Year Level</th>
                                    <th className="px-5 py-3.5">Class Adviser</th>
                                    <th className="px-5 py-3.5">Enrolled / Max</th>
                                    <th className="px-5 py-3.5">Academic Year</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sections.data.length > 0 ? (
                                    sections.data.map((sec) => (
                                        <tr key={sec.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-slate-900">
                                                {sec.name}
                                            </td>
                                            <td className="px-5 py-3 font-medium text-slate-800">
                                                {sec.program?.code}
                                            </td>
                                            <td className="px-5 py-3 text-slate-600">
                                                {sec.year_level}
                                            </td>
                                            <td className="px-5 py-3 text-slate-700">
                                                {sec.adviser ? `${sec.adviser.first_name} ${sec.adviser.last_name}` : 'Unassigned'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={sec.students_count >= sec.max_students ? 'text-rose-600 font-bold' : 'text-slate-700 font-medium'}>
                                                    {sec.students_count} / {sec.max_students}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-slate-600">
                                                {sec.academic_year?.name}
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge status={sec.status} />
                                            </td>
                                            <td className="px-5 py-3 text-right space-x-1">
                                                <Link
                                                    href={`/sections/${sec.id}`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="View Section & Students"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/sections/${sec.id}/edit`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                                    title="Edit Section"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                {sec.status === 'active' && (
                                                    <button
                                                        onClick={() => setDeactivatingSection(sec)}
                                                        className="inline-flex p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                                        title="Deactivate Section"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8}>
                                            <EmptyState
                                                title="No sections found"
                                                description="Get started by creating a section for your students."
                                                action={
                                                    <Link href="/sections/create">
                                                        <Button size="sm">Add Section</Button>
                                                    </Link>
                                                }
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={sections.links}
                        from={sections.from}
                        to={sections.to}
                        total={sections.total}
                    />
                </Card>
            </div>

            <ConfirmDialog
                isOpen={!!deactivatingSection}
                onClose={() => setDeactivatingSection(null)}
                onConfirm={confirmDeactivate}
                title="Deactivate Section"
                message={`Are you sure you want to deactivate section ${deactivatingSection?.name}?`}
                confirmText="Deactivate"
                variant="danger"
            />
        </AppLayout>
    );
}

