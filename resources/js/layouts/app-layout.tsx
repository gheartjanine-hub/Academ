import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { Alert } from '@/components/ui/alert';

export interface AppLayoutProps {
    title?: string;
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ title, children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string; warning?: string; info?: string } | undefined;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Head title={title ? `${title} - AcadEase` : 'AcadEase'} />

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {/* Flash Notifications */}
                    {flash?.success && (
                        <div className="mb-6">
                            <Alert type="success" message={flash.success} />
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6">
                            <Alert type="error" message={flash.error} />
                        </div>
                    )}
                    {flash?.warning && (
                        <div className="mb-6">
                            <Alert type="warning" message={flash.warning} />
                        </div>
                    )}
                    {flash?.info && (
                        <div className="mb-6">
                            <Alert type="info" message={flash.info} />
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
};

