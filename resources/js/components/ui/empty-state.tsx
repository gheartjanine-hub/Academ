import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No records found',
    description = 'There are no items matching your criteria or none have been added yet.',
    icon,
    action,
    className,
}) => {
    return (
        <div className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                {icon || <Inbox className="w-6 h-6" />}
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">{title}</h4>
            <p className="text-xs text-slate-500 max-w-sm mb-4">{description}</p>
            {action}
        </div>
    );
};

