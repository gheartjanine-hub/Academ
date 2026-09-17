import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { GraduationCap, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: 'admin@acadease.com',
        password: 'password',
        remember: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    const handleQuickLogin = (email: string) => {
        setData({
            email,
            password: 'password',
            remember: true,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Sign In - AcadEase" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
                    <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">AcadEase</h2>
                <p className="mt-1 text-sm text-slate-400">Academic Record Management System</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-white py-8 px-6 shadow-xl shadow-black/10 rounded-2xl border border-slate-100 sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                                    placeholder="name@acadease.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Remember me</span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            isLoading={processing}
                            className="w-full py-2.5 text-sm font-semibold mt-2"
                        >
                            <span>Sign in</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>

                    {/* Demo Credentials Helper */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
                            Demo One-Click Accounts (Password: password)
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('admin@acadease.com')}
                                className="p-2 text-left bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                                <p className="font-semibold text-slate-800">Admin</p>
                                <p className="text-[11px] text-slate-500 truncate">admin@acadease.com</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('registrar@acadease.com')}
                                className="p-2 text-left bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                                <p className="font-semibold text-slate-800">Registrar</p>
                                <p className="text-[11px] text-slate-500 truncate">registrar@acadease.com</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('robert.santos@acadease.com')}
                                className="p-2 text-left bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                                <p className="font-semibold text-slate-800">Teacher</p>
                                <p className="text-[11px] text-slate-500 truncate">robert.santos@...</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('john.doe@acadease.com')}
                                className="p-2 text-left bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                                <p className="font-semibold text-slate-800">Student</p>
                                <p className="text-[11px] text-slate-500 truncate">john.doe@...</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

