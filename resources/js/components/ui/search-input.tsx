import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    onClear,
    placeholder = 'Search...',
    className,
    ...props
}) => {
    return (
        <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
            </div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={cn(
                    'block w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs',
                    className
                )}
                {...props}
            />
            {value && onClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

