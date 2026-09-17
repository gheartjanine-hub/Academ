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

interface SubjectItem {
    id: number;
    code: string;
    name: string;
    description: string | null;
    units: number;
    department: string | null;
    year_level: string | null;
    semester: string | null;
    status: string;
    program?: { id: number; code: string; name: string } | null;
}

interface SubjectsIndexProps {
    subjects: {
        data: SubjectItem[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        program_id?: string;
        year_level?: string;
        semester?: string;
        status?: string;
    };
    programs: Array<{ id: number; code: string; name: string }>;
}

export default function SubjectsIndex({ subjects, filters, programs }: SubjectsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [programId, setProgramId] = useState(filters.program_id || '');
    const [yearLevel, setYearLevel] = useState(filters.year_level || '');
    const [semester, setSemester] = useState(filters.semester || '');
    const [status, setStatus] = useState(filters.status || '');
    const [deactivatingSubject, setDeactivatingSubject] = useState<SubjectItem | null>(null);

    const handleFilter = (updates: Record<string, string>) => {
        router.get('/subjects', {
            search,
            program_id: programId,
            year_level: yearLevel,
            semester,
            status,
            ...updates,
        }, { preserveState: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter({ search });
    };

    const confirmDeactivate = () => {
        if (!deactivatingSubject) return;
        router.delete(`/subjects/${deactivatingSubject.id}`, {
            onSuccess: () => setDeactivatingSubject(null),
        });
    };

    return (
        <AppLayout title="Subject Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Subjects / Courses</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Manage curriculum subjects, course units, and academic department tagging</p>
                    </div>
                    <Link href="/subjects/create">
                        <Button className="font-semibold text-xs gap-1.5 shadow-xs">
                            <Plus className="w-4 h-4" />
                            <span>Add Subject</span>
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
                            placeholder="Search code, title, description..."
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

                        <select
                            value={semester}
                            onChange={(e) => {
                                setSemester(e.target.value);
                                handleFilter({ semester: e.target.value });
                            }}
                            aria-label="Filter by Semester"
                            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                            <option value="">All Semesters</option>
                            <option value="1st Semester">1st Semester</option>
                            <option value="2nd Semester">2nd Semester</option>
                            <option value="Summer">Summer</option>
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
                                    <th className="px-5 py-3.5">Subject Code</th>
                                    <th className="px-5 py-3.5">Subject Name</th>
                                    <th className="px-5 py-3.5">Units</th>
                                    <th className="px-5 py-3.5">Program</th>
                                    <th className="px-5 py-3.5">Term</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {subjects.data.length > 0 ? (
                                    subjects.data.map((subject) => (
                                        <tr key={subject.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3 font-mono font-semibold text-blue-600">
                                                {subject.code}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="font-semibold text-slate-900">{subject.name}</div>
                                                {subject.description && (
                                                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{subject.description}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-slate-700">
                                                {subject.units} {subject.units === 1 ? 'unit' : 'units'}
                                            </td>
                                            <td className="px-5 py-3 text-slate-700 font-medium">
                                                {subject.program?.code || 'General Education'}
                                            </td>
                                            <td className="px-5 py-3 text-slate-600">
                                                {subject.year_level || 'Any Year'} • {subject.semester || 'Any Sem'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge status={subject.status} />
                                            </td>
                                            <td className="px-5 py-3 text-right space-x-1">
                                                <Link
                                                    href={`/subjects/${subject.id}`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="View Subject"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/subjects/${subject.id}/edit`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                                    title="Edit Subject"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                {subject.status === 'active' && (
                                                    <button
                                                        onClick={() => setDeactivatingSubject(subject)}
                                                        className="inline-flex p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                                        title="Deactivate Subject"
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
                                                title="No subjects found"
                                                description="Try adjusting your filters or add a new subject to the curriculum."
                                                action={
                                                    <Link href="/subjects/create">
                                                        <Button size="sm">Add Subject</Button>
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
                        links={subjects.links}
                        from={subjects.from}
                        to={subjects.to}
                        total={subjects.total}
                    />
                </Card>
            </div>

            <ConfirmDialog
                isOpen={!!deactivatingSubject}
                onClose={() => setDeactivatingSubject(null)}
                onConfirm={confirmDeactivate}
                title="Deactivate Subject"
                message={`Are you sure you want to deactivate ${deactivatingSubject?.code} - ${deactivatingSubject?.name}?`}
                confirmText="Deactivate"
                variant="danger"
            />
        </AppLayout>
    );
}

