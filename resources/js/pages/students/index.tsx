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
import { Plus, Eye, Edit, Trash2, Award, Filter } from 'lucide-react';

interface StudentItem {
    id: number;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string | null;
    gender: string | null;
    year_level: string | null;
    status: string;
    program?: { id: number; code: string; name: string } | null;
    section?: { id: number; name: string } | null;
    academic_year?: { id: number; name: string } | null;
}

interface StudentsIndexProps {
    students: {
        data: StudentItem[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        program_id?: string;
        year_level?: string;
        status?: string;
        section_id?: string;
    };
    programs: Array<{ id: number; code: string; name: string }>;
    sections: Array<{ id: number; name: string; program_id: number }>;
}

export default function StudentsIndex({ students, filters, programs, sections }: StudentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [programId, setProgramId] = useState(filters.program_id || '');
    const [yearLevel, setYearLevel] = useState(filters.year_level || '');
    const [status, setStatus] = useState(filters.status || '');
    const [deactivatingStudent, setDeactivatingStudent] = useState<StudentItem | null>(null);

    const handleFilter = (updates: Record<string, string>) => {
        router.get('/students', {
            search,
            program_id: programId,
            year_level: yearLevel,
            status,
            ...updates,
        }, { preserveState: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter({ search });
    };

    const confirmDeactivate = () => {
        if (!deactivatingStudent) return;
        router.delete(`/students/${deactivatingStudent.id}`, {
            onSuccess: () => setDeactivatingStudent(null),
        });
    };

    return (
        <AppLayout title="Student Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Students</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Manage student profiles, enrollments, and academic standings</p>
                    </div>
                    <Link href="/students/create">
                        <Button className="font-semibold text-xs gap-1.5 shadow-xs">
                            <Plus className="w-4 h-4" />
                            <span>Add Student</span>
                        </Button>
                    </Link>
                </div>

                {/* Filters Card */}
                <Card className="p-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
                        <SearchInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClear={() => {
                                setSearch('');
                                handleFilter({ search: '' });
                            }}
                            placeholder="Search by ID, name, email..."
                            className="w-full sm:w-64"
                        />

                        {/* Program Filter */}
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
                                <option key={p.id} value={p.id}>
                                    {p.code}
                                </option>
                            ))}
                        </select>

                        {/* Year Level Filter */}
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

                        {/* Status Filter */}
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
                            <option value="graduated">Graduated</option>
                            <option value="dropped">Dropped</option>
                        </select>

                        <Button type="submit" variant="secondary" size="sm" className="h-9">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Filter</span>
                        </Button>
                    </form>
                </Card>

                {/* Students Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Student ID</th>
                                    <th className="px-5 py-3.5">Name</th>
                                    <th className="px-5 py-3.5">Program & Year</th>
                                    <th className="px-5 py-3.5">Section</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.data.length > 0 ? (
                                    students.data.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3 font-mono font-semibold text-blue-600">
                                                {student.student_id}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="font-semibold text-slate-900">
                                                    {student.first_name} {student.last_name}
                                                </div>
                                                <div className="text-[11px] text-slate-400">{student.email}</div>
                                            </td>
                                            <td className="px-5 py-3 text-slate-700">
                                                <span className="font-medium text-slate-900">{student.program?.code || 'No Program'}</span>
                                                <span className="text-slate-400"> • </span>
                                                <span className="text-slate-500">{student.year_level || 'N/A'}</span>
                                            </td>
                                            <td className="px-5 py-3 text-slate-600">
                                                {student.section?.name || 'Unassigned'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge status={student.status} />
                                            </td>
                                            <td className="px-5 py-3 text-right space-x-1">
                                                <Link
                                                    href={`/students/${student.id}`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/students/${student.id}/academic-record`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                    title="Academic Records / Transcript"
                                                >
                                                    <Award className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/students/${student.id}/edit`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                                    title="Edit Student"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                {student.status === 'active' && (
                                                    <button
                                                        onClick={() => setDeactivatingStudent(student)}
                                                        className="inline-flex p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                                        title="Deactivate Student"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <EmptyState
                                                title="No students found"
                                                description="Try adjusting your search filters or add a new student."
                                                action={
                                                    <Link href="/students/create">
                                                        <Button size="sm">Add Student</Button>
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
                        links={students.links}
                        from={students.from}
                        to={students.to}
                        total={students.total}
                    />
                </Card>
            </div>

            {/* Deactivation Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deactivatingStudent}
                onClose={() => setDeactivatingStudent(null)}
                onConfirm={confirmDeactivate}
                title="Deactivate Student"
                message={`Are you sure you want to deactivate ${deactivatingStudent?.first_name} ${deactivatingStudent?.last_name} (${deactivatingStudent?.student_id})?`}
                confirmText="Deactivate"
                variant="danger"
            />
        </AppLayout>
    );
}

