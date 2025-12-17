'use client';

import { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
    className?: string;
}

export default function Badge({ children, variant = 'default', size = 'sm', dot = false, className = '' }: BadgeProps) {
    const variantClasses = {
        default: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
        success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        danger: 'bg-red-500/20 text-red-400 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    const dotColors = {
        default: 'bg-slate-400',
        success: 'bg-emerald-400',
        warning: 'bg-amber-400',
        danger: 'bg-red-400',
        info: 'bg-blue-400',
        purple: 'bg-purple-400',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
            {children}
        </span>
    );
}
