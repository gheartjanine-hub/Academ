import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/badge';
import { Pagination, PaginationLink } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Link, router } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';

interface TeacherItem {
    id: number;
    teacher_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string | null;
    department: string | null;
    status: string;
    sections_count: number;
    enrollment_subjects_count: number;
}

interface TeachersIndexProps {
    teachers: {
        data: TeacherItem[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        department?: string;
        status?: string;
    };
    departments: string[];
}

export default function TeachersIndex({ teachers, filters, departments }: TeachersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [status, setStatus] = useState(filters.status || '');
    const [deactivatingTeacher, setDeactivatingTeacher] = useState<TeacherItem | null>(null);

    const handleFilter = (updates: Record<string, string>) => {
        router.get('/teachers', {
            search,
            department,
            status,
            ...updates,
        }, { preserveState: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter({ search });
    };

    const confirmDeactivate = () => {
        if (!deactivatingTeacher) return;
        router.delete(`/teachers/${deactivatingTeacher.id}`, {
            onSuccess: () => setDeactivatingTeacher(null),
        });
    };

    return (
        <AppLayout title="Teacher Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Teachers / Faculty</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Manage faculty members, departments, and class advisory assignments</p>
                    </div>
                    <Link href="/teachers/create">
                        <Button className="font-semibold text-xs gap-1.5 shadow-xs">
                            <Plus className="w-4 h-4" />
                            <span>Add Teacher</span>
                        </Button>
                    </Link>
                </div>

                <Card className="p-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
                        <SearchInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClear={() => {
                                setSearch('');
                                handleFilter({ search: '' });
                            }}
                            placeholder="Search by ID, name, email, department..."
                            className="w-full sm:w-64"
                        />

                        <select
                            value={department}
                            onChange={(e) => {
                                setDepartment(e.target.value);
                                handleFilter({ department: e.target.value });
                            }}
                            aria-label="Filter by Department"
                            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                handleFilter({ status: e.target.value });
                            }}
                            aria-label="Filter by Status"
                            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <Button type="submit" variant="secondary" size="sm" className="h-9">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Filter</span>
                        </Button>
                    </form>
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Teacher ID</th>
                                    <th className="px-5 py-3.5">Name</th>
                                    <th className="px-5 py-3.5">Department</th>
                                    <th className="px-5 py-3.5">Contact</th>
                                    <th className="px-5 py-3.5">Assigned Classes</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {teachers.data.length > 0 ? (
                                    teachers.data.map((teacher) => (
                                        <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3 font-mono font-semibold text-blue-600">
                                                {teacher.teacher_id}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="font-semibold text-slate-900">
                                                    {teacher.first_name} {teacher.last_name}
                                                </div>
                                                <div className="text-[11px] text-slate-400">{teacher.email}</div>
                                            </td>
                                            <td className="px-5 py-3 text-slate-700 font-medium">
                                                {teacher.department || 'General'}
                                            </td>
                                            <td className="px-5 py-3 text-slate-600">
                                                {teacher.contact_number || '-'}
                                            </td>
                                            <td className="px-5 py-3 text-slate-600">
                                                {teacher.enrollment_subjects_count} assigned
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge status={teacher.status} />
                                            </td>
                                            <td className="px-5 py-3 text-right space-x-1">
                                                <Link
                                                    href={`/teachers/${teacher.id}`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/teachers/${teacher.id}/edit`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                                    title="Edit Teacher"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                {teacher.status === 'active' && (
                                                    <button
                                                        onClick={() => setDeactivatingTeacher(teacher)}
                                                        className="inline-flex p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                                        title="Deactivate Teacher"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>
                                            <EmptyState
                                                title="No teachers found"
                                                description="Try adjusting your search criteria or register a new teacher."
                                                action={
                                                    <Link href="/teachers/create">
                                                        <Button size="sm">Add Teacher</Button>
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
                        links={teachers.links}
                        from={teachers.from}
                        to={teachers.to}
                        total={teachers.total}
                    />
                </Card>
            </div>

            <ConfirmDialog
                isOpen={!!deactivatingTeacher}
                onClose={() => setDeactivatingTeacher(null)}
                onConfirm={confirmDeactivate}
                title="Deactivate Teacher"
                message={`Are you sure you want to deactivate ${deactivatingTeacher?.first_name} ${deactivatingTeacher?.last_name}?`}
                confirmText="Deactivate"
                variant="danger"
            />
        </AppLayout>
    );
}

