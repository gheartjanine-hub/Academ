import React from 'react';
import { cn } from '@/lib/utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div
        className={cn('bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden', className)}
        {...props}
    >
        {children}
    </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div className={cn('px-6 py-4 border-b border-slate-100 flex items-center justify-between', className)} {...props}>
        {children}
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
    children,
    className,
    ...props
}) => (
    <h3 className={cn('text-base font-semibold text-slate-900', className)} {...props}>
        {children}
    </h3>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div className={cn('p-6', className)} {...props}>
        {children}
    </div>
);

export interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    subtitle?: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    color?: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    subtitle,
    color = 'blue',
}) => {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        violet: 'bg-violet-50 text-violet-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
    };

    return (
        <Card className="hover:border-slate-300 transition-all duration-200">
            <CardBody className="p-5 flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                </div>
                {icon && (
                    <div className={cn('p-3 rounded-xl', colorStyles[color])}>
                        {icon}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

