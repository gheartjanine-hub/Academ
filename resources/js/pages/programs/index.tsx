import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/badge';
import { Pagination, PaginationLink } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, FolderKanban, Save } from 'lucide-react';

interface ProgramItem {
    id: number;
    code: string;
    name: string;
    department: string;
    description: string | null;
    status: string;
    students_count: number;
    subjects_count: number;
    sections_count: number;
}

interface ProgramsIndexProps {
    programs: {
        data: ProgramItem[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ProgramsIndex({ programs, filters }: ProgramsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);
    const [deactivatingProgram, setDeactivatingProgram] = useState<ProgramItem | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        code: '',
        name: '',
        department: 'College of Computer Studies',
        description: '',
        status: 'active',
    });

    const openCreateModal = () => {
        setEditingProgram(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (prog: ProgramItem) => {
        setEditingProgram(prog);
        setData({
            code: prog.code,
            name: prog.name,
            department: prog.department,
            description: prog.description || '',
            status: prog.status,
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProgram) {
            put(`/programs/${editingProgram.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/programs', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const confirmDeactivate = () => {
        if (!deactivatingProgram) return;
        router.delete(`/programs/${deactivatingProgram.id}`, {
            onSuccess: () => setDeactivatingProgram(null),
        });
    };

    return (
        <AppLayout title="Academic Programs">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Programs / Courses</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Manage degree programs, departments, and course curricula</p>
                    </div>
                    <Button onClick={openCreateModal} className="font-semibold text-xs gap-1.5 shadow-xs">
                        <Plus className="w-4 h-4" />
                        <span>Add Program</span>
                    </Button>
                </div>

                <Card className="p-4 flex items-center justify-between gap-3">
                    <SearchInput
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            router.get('/programs', { search: e.target.value }, { preserveState: true });
                        }}
                        placeholder="Search programs..."
                        className="w-full sm:w-64"
                    />
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Code</th>
                                    <th className="px-5 py-3.5">Program Name</th>
                                    <th className="px-5 py-3.5">Department</th>
                                    <th className="px-5 py-3.5">Students</th>
                                    <th className="px-5 py-3.5">Subjects</th>
                                    <th className="px-5 py-3.5">Sections</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {programs.data.length > 0 ? (
                                    programs.data.map((prog) => (
                                        <tr key={prog.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3 font-mono font-bold text-blue-600">
                                                {prog.code}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="font-semibold text-slate-900">{prog.name}</div>
                                                {prog.description && (
                                                    <p className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5">{prog.description}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-slate-700 font-medium">
                                                {prog.department}
                                            </td>
                                            <td className="px-5 py-3 text-slate-600 font-semibold">
                                                {prog.students_count}
                                            </td>
                                            <td className="px-5 py-3 text-slate-600 font-semibold">
                                                {prog.subjects_count}
                                            </td>
                                            <td className="px-5 py-3 text-slate-600 font-semibold">
                                                {prog.sections_count}
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge status={prog.status} />
                                            </td>
                                            <td className="px-5 py-3 text-right space-x-1">
                                                <button
                                                    onClick={() => openEditModal(prog)}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                                                    title="Edit Program"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {prog.status === 'active' && (
                                                    <button
                                                        onClick={() => setDeactivatingProgram(prog)}
                                                        className="inline-flex p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                                        title="Deactivate Program"
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
                                                title="No programs registered"
                                                description="Get started by registering an academic program or course."
                                                action={
                                                    <Button size="sm" onClick={openCreateModal}>
                                                        Add Program
                                                    </Button>
                                                }
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={programs.links}
                        from={programs.from}
                        to={programs.to}
                        total={programs.total}
                    />
                </Card>
            </div>

            {/* Create / Edit Program Modal Form */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProgram ? `Edit Program - ${editingProgram.code}` : 'Add Academic Program'}
                description="Configure program code, official title, and department affiliation"
            >
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Program Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            required
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                            placeholder="e.g. BSIT"
                        />
                        {errors.code && <p className="text-xs text-rose-500 mt-1">{errors.code}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Program Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Bachelor of Science in Information Technology"
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Department <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.department}
                            onChange={(e) => setData('department', e.target.value)}
                            required
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. College of Computer Studies"
                        />
                        {errors.department && <p className="text-xs text-rose-500 mt-1">{errors.department}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Overview of the program..."
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

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={processing} className="gap-1.5">
                            <Save className="w-4 h-4" />
                            <span>Save Program</span>
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deactivatingProgram}
                onClose={() => setDeactivatingProgram(null)}
                onConfirm={confirmDeactivate}
                title="Deactivate Program"
                message={`Are you sure you want to deactivate ${deactivatingProgram?.code}?`}
                confirmText="Deactivate"
                variant="danger"
            />
        </AppLayout>
    );
}

