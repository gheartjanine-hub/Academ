import React from 'react';
import { AppLayout } from '@/layouts/app-layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Sliders, Save, Award, Info } from 'lucide-react';

interface GradingSettingProps {
    settings: {
        id: number;
        passing_grade: number;
        prelim_weight: number;
        midterm_weight: number;
        final_weight: number;
        grading_system: string;
    };
}

export default function GradingSettings({ settings }: GradingSettingProps) {
    const { data, setData, post, processing, errors } = useForm({
        passing_grade: settings.passing_grade,
        prelim_weight: settings.prelim_weight,
        midterm_weight: settings.midterm_weight,
        final_weight: settings.final_weight,
        grading_system: settings.grading_system || 'percentage',
    });

    const totalWeight = Number(data.prelim_weight) + Number(data.midterm_weight) + Number(data.final_weight);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/grading');
    };

    return (
        <AppLayout title="Grading System Configuration">
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Grading Criteria Configuration</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Configure institutional passing thresholds and periodic component weightings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Award className="w-4 h-4 text-blue-600" />
                                <span>Institutional Passing Threshold</span>
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Minimum Passing Grade (%)
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="50"
                                        max="100"
                                        value={data.passing_grade}
                                        onChange={(e) => setData('passing_grade', Number(e.target.value))}
                                        required
                                        className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 font-mono"
                                    />
                                    <span className="text-slate-500 text-xs">
                                        Students scoring equal to or above this mark will receive a remark of <strong>Passed</strong>.
                                    </span>
                                </div>
                                {errors.passing_grade && <p className="text-rose-500 text-xs mt-1">{errors.passing_grade}</p>}
                            </div>

                            <div className="pt-3 border-t border-slate-100">
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Grading Representation
                                </label>
                                <select
                                    value={data.grading_system}
                                    onChange={(e) => setData('grading_system', e.target.value)}
                                    className="w-64 px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="percentage">Percentage (0.00% to 100.00%)</option>
                                    <option value="point">Point Scale (1.0 to 5.0)</option>
                                </select>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Sliders className="w-4 h-4 text-indigo-600" />
                                <span>Term Periodic Weight Distribution</span>
                            </CardTitle>
                            <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                                    totalWeight === 100
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}
                            >
                                Total Weight: {totalWeight}% {totalWeight === 100 ? '✓' : '(Must be 100%)'}
                            </span>
                        </CardHeader>
                        <CardBody className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Prelim Weight (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={data.prelim_weight}
                                    onChange={(e) => setData('prelim_weight', Number(e.target.value))}
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Midterm Weight (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={data.midterm_weight}
                                    onChange={(e) => setData('midterm_weight', Number(e.target.value))}
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Final Exam Weight (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={data.final_weight}
                                    onChange={(e) => setData('final_weight', Number(e.target.value))}
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
                                />
                            </div>

                            {errors.weights && (
                                <div className="col-span-3 text-xs text-rose-600 font-medium">
                                    {errors.weights}
                                </div>
                            )}

                            <div className="col-span-3 p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-[11px] text-blue-800 flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <span>
                                    Final rating calculation formula: <strong className="font-mono">(Prelim × {data.prelim_weight}%) + (Midterm × {data.midterm_weight}%) + (Final × {data.final_weight}%)</strong>
                                </span>
                            </div>
                        </CardBody>
                    </Card>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={processing} disabled={totalWeight !== 100} className="gap-2">
                            <Save className="w-4 h-4" />
                            <span>Save Grading Configuration</span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

