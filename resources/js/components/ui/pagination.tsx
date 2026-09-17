import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationProps {
    links: PaginationLink[];
    from?: number;
    to?: number;
    total?: number;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    links,
    from,
    to,
    total,
    className,
}) => {
    if (!links || links.length <= 3) return null;

    return (
        <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-6 border-t border-slate-100', className)}>
            <div className="text-xs text-slate-500">
                {total !== undefined && from !== undefined && to !== undefined ? (
                    <>Showing <span className="font-semibold text-slate-700">{from}</span> to <span className="font-semibold text-slate-700">{to}</span> of <span className="font-semibold text-slate-700">{total}</span> records</>
                ) : (
                    <span>Pagination</span>
                )}
            </div>

            <div className="flex items-center gap-1">
                {links.map((link, i) => {
                    const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;');
                    const isNext = link.label.includes('Next') || link.label.includes('&raquo;');

                    const cleanLabel = isPrev ? <ChevronLeft className="w-4 h-4" /> : isNext ? <ChevronRight className="w-4 h-4" /> : link.label;

                    if (!link.url) {
                        return (
                            <span
                                key={i}
                                className="px-2.5 py-1 text-xs text-slate-300 font-medium rounded-md cursor-not-allowed select-none"
                            >
                                {cleanLabel}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={i}
                            href={link.url}
                            className={cn(
                                'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                                link.active
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 bg-white'
                            )}
                        >
                            {cleanLabel}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

