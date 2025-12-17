'use client';

import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: ReactNode;
    iconBg?: string;
    trend?: 'up' | 'down' | 'neutral';
    subtitle?: string;
}

export default function StatCard({
    title,
    value,
    change,
    changeLabel,
    icon,
    iconBg = 'from-indigo-500 to-purple-600',
    trend = 'neutral',
    subtitle,
}: StatCardProps) {
    const trendColors = {
        up: 'text-emerald-400',
        down: 'text-red-400',
        neutral: 'text-slate-400',
    };

    const trendIcons = {
        up: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
        ),
        down: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
        ),
        neutral: null,
    };

    return (
        <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-white/10 p-6 overflow-hidden hover:border-indigo-500/30 transition-all duration-300 group">
            {/* Background glow effect */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${iconBg} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-400">{title}</p>
                        <p className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</p>
                        {subtitle && (
                            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
                        )}
                        {change !== undefined && (
                            <div className={`mt-2 flex items-center gap-1 text-sm ${trendColors[trend]}`}>
                                {trendIcons[trend]}
                                <span className="font-medium">{change > 0 ? '+' : ''}{change}%</span>
                                {changeLabel && <span className="text-slate-400">{changeLabel}</span>}
                            </div>
                        )}
                    </div>
                    {icon && (
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-lg`}>
                            {icon}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
