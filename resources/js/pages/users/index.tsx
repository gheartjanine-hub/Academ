import React, { useState } from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge, Badge } from '@/components/ui/badge';
import { Pagination, PaginationLink } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, UserCog, Save, Shield } from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

interface UsersIndexProps {
    users: {
        data: UserItem[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        role?: string;
        status?: string;
    };
}

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [deactivatingUser, setDeactivatingUser] = useState<UserItem | null>(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'registrar',
        status: 'active',
    });

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (u: UserItem) => {
        setEditingUser(u);
        setData({
            name: u.name,
            email: u.email,
            password: '',
            role: u.role,
            status: u.status,
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const confirmDeactivate = () => {
        if (!deactivatingUser) return;
        router.delete(`/users/${deactivatingUser.id}`, {
            onSuccess: () => setDeactivatingUser(null),
        });
    };

    return (
        <AppLayout title="User & Role Management">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">User Management</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Control system access, assign roles, and manage permissions</p>
                    </div>

                    <Button onClick={openCreateModal} className="font-semibold text-xs gap-1.5 shadow-xs">
                        <Plus className="w-4 h-4" />
                        <span>Add System User</span>
                    </Button>
                </div>

                <Card className="p-4 flex flex-wrap items-center gap-3">
                    <SearchInput
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            router.get('/users', { search: e.target.value, role }, { preserveState: true });
                        }}
                        placeholder="Search user name or email..."
                        className="w-full sm:w-64"
                    />

                    <select
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            router.get('/users', { search, role: e.target.value }, { preserveState: true });
                        }}
                        aria-label="Filter by Role"
                        className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                    >
                        <option value="">All Roles</option>
                        <option value="administrator">Administrator</option>
                        <option value="registrar">Registrar</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">User Name</th>
                                    <th className="px-5 py-3.5">Email Address</th>
                                    <th className="px-5 py-3.5">System Role</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.data.length > 0 ? (
                                    users.data.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3 font-semibold text-slate-900">
                                                {u.name}
                                            </td>
                                            <td className="px-5 py-3 text-slate-600 font-mono">
                                                {u.email}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="capitalize font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge status={u.status} />
                                            </td>
                                            <td className="px-5 py-3 text-right space-x-1">
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="inline-flex p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                                                    title="Edit User"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {u.status === 'active' && (
                                                    <button
                                                        onClick={() => setDeactivatingUser(u)}
                                                        className="inline-flex p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                                        title="Deactivate User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5}>
                                            <EmptyState
                                                title="No users found"
                                                description="Create authorized system users with administrator or registrar permissions."
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={users.links}
                        from={users.from}
                        to={users.to}
                        total={users.total}
                    />
                </Card>
            </div>

            {/* User Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? `Edit User - ${editingUser.name}` : 'Create System User'}
                description="Assign role permissions for academic records and management features"
            >
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Full Name <span className="text-rose-500">*</span>
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {editingUser ? 'Password (leave blank to keep current)' : 'Password'} <span className="text-rose-500">{editingUser ? '' : '*'}</span>
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required={!editingUser}
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            System Role <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="administrator">Administrator (Full Access)</option>
                            <option value="registrar">Registrar (Students, Enrollments, Grades, Reports)</option>
                            <option value="teacher">Teacher (Assigned Classes & Grade Entry)</option>
                            <option value="student">Student (Self-Service View Only)</option>
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

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={processing} className="gap-1.5">
                            <Save className="w-4 h-4" />
                            <span>Save User</span>
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deactivatingUser}
                onClose={() => setDeactivatingUser(null)}
                onConfirm={confirmDeactivate}
                title="Deactivate User"
                message={`Are you sure you want to deactivate ${deactivatingUser?.name}? They will not be able to log in.`}
                confirmText="Deactivate"
                variant="danger"
            />
        </AppLayout>
    );
}

