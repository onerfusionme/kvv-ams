'use client';

import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    gradient?: boolean;
    onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, gradient = false, onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`
        relative rounded-2xl border border-white/10 overflow-hidden
        ${gradient ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80' : 'bg-slate-900/50'}
        ${hover ? 'hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer' : ''}
        backdrop-blur-xl
        ${className}
      `}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
    action?: ReactNode;
}

export function CardHeader({ children, className = '', action }: CardHeaderProps) {
    return (
        <div className={`flex items-center justify-between px-6 py-4 border-b border-white/10 ${className}`}>
            <div>{children}</div>
            {action && <div>{action}</div>}
        </div>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
    padding?: boolean;
}

export function CardContent({ children, className = '', padding = true }: CardContentProps) {
    return (
        <div className={`${padding ? 'p-6' : ''} ${className}`}>
            {children}
        </div>
    );
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`px-6 py-4 border-t border-white/10 bg-slate-800/30 ${className}`}>
            {children}
        </div>
    );
}
