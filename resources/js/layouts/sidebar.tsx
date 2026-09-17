import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    BookOpen,
    Layers,
    FolderKanban,
    FileCheck2,
    Award,
    FileSpreadsheet,
    Calendar,
    UserCog,
    Sliders,
    BookMarked,
    History,
    LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const role = user?.role || 'admin';

    const getNavItems = () => {
        if (role === 'student') {
            return [
                { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
                { name: 'My Profile', href: '/student/profile', icon: GraduationCap },
                { name: 'Enrolled Subjects', href: '/student/subjects', icon: BookOpen },
                { name: 'My Grades', href: '/student/grades', icon: Award },
                { name: 'Academic History', href: '/student/history', icon: History },
            ];
        }

        if (role === 'teacher') {
            return [
                { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
                { name: 'My Classes', href: '/teacher/classes', icon: BookMarked },
                { name: 'Grade Entry', href: '/grades', icon: Award },
            ];
        }

        // Admin and Registrar
        const items = [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Students', href: '/students', icon: GraduationCap },
            { name: 'Teachers', href: '/teachers', icon: Users },
            { name: 'Subjects', href: '/subjects', icon: BookOpen },
            { name: 'Programs', href: '/programs', icon: FolderKanban },
            { name: 'Sections', href: '/sections', icon: Layers },
            { name: 'Enrollments', href: '/enrollments', icon: FileCheck2 },
            { name: 'Grades & Records', href: '/grades', icon: Award },
            { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
            { name: 'Academic Years', href: '/academic-years', icon: Calendar },
        ];

        // Administrator only
        if (role === 'admin' || role === 'administrator') {
            items.push(
                { name: 'User Management', href: '/users', icon: UserCog },
                { name: 'Grading Settings', href: '/settings/grading', icon: Sliders }
            );
        }

        return items;
    };

    const navItems = getNavItems();

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Brand Logo */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white tracking-tight leading-none">AcadEase</h1>
                        <p className="text-[11px] text-slate-400 font-medium">Record Management</p>
                    </div>
                </div>

                {/* User Role Tag */}
                <div className="px-6 py-3 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium truncate max-w-[130px]">{user?.name}</span>
                    <Badge variant="default" className="capitalize text-[10px] bg-blue-900/40 border-blue-800 text-blue-300">
                        {user?.role || 'Guest'}
                    </Badge>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = url === item.href || (item.href !== '/dashboard' && url.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                                )}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer / Logout */}
                <div className="p-3 border-t border-slate-800">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>
        </>
    );
};

