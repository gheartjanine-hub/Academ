import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onDismiss?: () => void;
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({
    type = 'info',
    message,
    onDismiss,
    className,
}) => {
    const config = {
        success: {
            bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        },
        error: {
            bg: 'bg-rose-50 border-rose-200 text-rose-800',
            icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
        },
        warning: {
            bg: 'bg-amber-50 border-amber-200 text-amber-800',
            icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        },
        info: {
            bg: 'bg-blue-50 border-blue-200 text-blue-800',
            icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
        },
    };

    const current = config[type];

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-xl border transition-all shadow-xs',
                current.bg,
                className
            )}
        >
            {current.icon}
            <div className="flex-1 text-sm font-medium">{message}</div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded-sm"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

