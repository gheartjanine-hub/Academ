import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    className,
    variant = 'default',
    size = 'sm',
    ...props
}) => {
    const variantStyles = {
        default: 'bg-blue-50 text-blue-700 border-blue-200',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        danger: 'bg-rose-50 text-rose-700 border-rose-200',
        info: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    const sizeStyles = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs font-semibold',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full border',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export const StatusBadge: React.FC<{ status?: string | null }> = ({ status }) => {
    if (!status) return <Badge variant="neutral">None</Badge>;

    const lower = status.toLowerCase();
    if (lower === 'active' || lower === 'passed' || lower === 'enrolled' || lower === 'completed') {
        return <Badge variant="success">{status}</Badge>;
    }
    if (lower === 'pending' || lower === 'incomplete') {
        return <Badge variant="warning">{status}</Badge>;
    }
    if (lower === 'inactive' || lower === 'failed' || lower === 'dropped') {
        return <Badge variant="danger">{status}</Badge>;
    }
    if (lower === 'graduated') {
        return <Badge variant="info">{status}</Badge>;
    }
    return <Badge variant="neutral">{status}</Badge>;
};

