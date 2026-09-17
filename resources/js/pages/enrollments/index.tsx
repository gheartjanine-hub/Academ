import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/badge';
import { Pagination, PaginationLink } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Link, router } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2, FileCheck2, Filter } from 'lucide-react';

interface EnrollmentItem {
    id: number;
    year_level: string;
    status: string;
    enrollment_subjects_count: number;
    created_at: string;
    student?: { id: number; student_id: string; first_name: string; last_name: string } | null;
    program?: { id: number; code: string; name: string } | null;
    section?: { id: number; name: string } | null;
    academic_year?: { id: number; name: string } | null;
    semester?: { id: number; name: string } | null;
}

interface EnrollmentsIndexProps {
    enrollments: {
        data: EnrollmentItem[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        academic_year_id?: string;
        semester_id?: string;
        program_id?: string;
        status?: string;
    };
    academicYears: Array<{ id: number; name: string; is_active: boolean }>;
    semesters: Array<{ id: number; name: string; academic_year_id: number; is_active: boolean }>;
    programs: Array<{ id: number; code: string; name: string }>;
}

export default function EnrollmentsIndex({
    enrollments,
    filters,
    academicYears,
    semesters,
    programs,
}: EnrollmentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [ayId, setAyId] = useState(filters.academic_year_id || '');
    const [semId, setSemId] = useState(filters.semester_id || '');
    const [programId, setProgramId] = useState(filters.program_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (updates: Record<string, string>) => {
        router.get('/enrollments', {
            search,
            academic_year_id: ayId,
            semester_id: semId,
            program_id: programId,
            status,
            ...updates,
        }, { preserveState: true });
    };

    return (
        <AppLayout title="Enrollment Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Enrollments</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Manage student registration, term enrollments, and enrolled subjects</p>
                    </div>
                    <Link href="/enrollments/create">
                        <Button className="font-semibold text-xs gap-1.5 shadow-xs">
                            <Plus className="w-4 h-4" />
                            <span>Enroll Student</span>
                        </Button>
                    </Link>
                </div>

                <Card className="p-4">
                    <div className="flex flex-wrap items-center gap-3">
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
                            placeholder="Search student ID, name..."
                            className="w-full sm:w-64"
                        />

                        <select
                            value={ayId}
                            onChange={(e) => {
                                setAyId(e.target.value);
                                handleFilter({ academic_year_id: e.target.value });
                            }}
                            aria-label="Filter by Academic Year"
                            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                            <option value="">All Academic Years</option>
                            {academicYears.map((ay) => (
                                <option key={ay.id} value={ay.id}>{ay.name}</option>
                            ))}
                        </select>

                        <select
                            value={semId}
                            onChange={(e) => {
                                setSemId(e.target.value);
                                handleFilter({ semester_id: e.target.value });
                            }}
                            aria-label="Filter by Semester"
                            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                            <option value="">All Semesters</option>
                            {semesters.map((sem) => (
                                <option key={sem.id} value={sem.id}>{sem.name}</option>
                            ))}
                        </select>

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
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                handleFilter({ status: e.target.value });
                            }}
                            aria-label="Filter by Status"
                            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                        >
                            <option value="">All Statuses</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="pending">Pending</option>
                            <option value="dropped">Dropped</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Student</th>
                                    <th className="px-5 py-3.5">Academic Period</th>
                                    <th className="px-5 py-3.5">Program & Year</th>
                                    <th className="px-5 py-3.5">Section</th>
                                    <th className="px-5 py-3.5">Subjects</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {enrollments.data.length > 0 ? (
                                    enrollments.data.map((enr) => (
                                        <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="font-semibold text-slate-900">
                                                    {enr.student ? `${enr.student.first_name} ${enr.student.last_name}` : 'Unknown'}
                                                </div>
                                                <div className="font-mono text-[11px] text-blue-600">
                                                    {enr.student?.student_id}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-slate-700 font-medium">
                                                {enr.academic_year?.name} • {enr.semester?.name}
                                            </td>
                                            <td className="px-5 py-3 text-slate-600">
                                                <span className="font-medium text-slate-800">{enr.program?.code}</span>
                                                <span className="text-slate-400"> • </span>
                                                <span>{enr.year_level}</span>
                                            </td>
                                            <td className="px-5 py-3 text-slate-600">
                                                {enr.section?.name ?? 'Unassigned'}
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-slate-700">
                                                {enr.enrollment_subjects_count} subjects
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge status={enr.status} />
                                            </td>
                                            <td className="px-5 py-3 text-right space-x-1">
                                                <Link
                                                    href={`/enrollments/${enr.id}`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="View Enrollment & Subjects"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/enrollments/${enr.id}/edit`}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                                    title="Edit Enrollment"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                {enr.status !== 'dropped' && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Drop this enrollment?')) {
                                                                router.delete(`/enrollments/${enr.id}`);
                                                            }
                                                        }}
                                                        className="inline-flex p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                                        title="Drop Enrollment"
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
                                                title="No enrollments found"
                                                description="No enrollment records matching your selected filters."
                                                action={
                                                    <Link href="/enrollments/create">
                                                        <Button size="sm">Enroll Student</Button>
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
                        links={enrollments.links}
                        from={enrollments.from}
                        to={enrollments.to}
                        total={enrollments.total}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}

