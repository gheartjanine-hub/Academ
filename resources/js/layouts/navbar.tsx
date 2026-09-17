import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Menu, Calendar, User as UserIcon, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
    onOpenSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
    const { props } = usePage();
    const user = props.auth?.user;
    const activeAy = props.activeAcademicYear;
    const activeSem = props.activeSemester;

    return (
        <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSidebar}
                    className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Active Academic Period Display */}
                <div className="hidden sm:flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>A.Y. <strong className="text-slate-900">{activeAy?.name ?? 'Not Set'}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span className="text-blue-700">{activeSem?.name ?? 'No Term'}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* User Info & Dropdown */}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                        {user?.name?.charAt(0) ?? 'U'}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 capitalize">{user?.role}</p>
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

