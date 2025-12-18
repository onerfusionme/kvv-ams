export const dynamic = 'force-dynamic';

'use client';

import { useMemo } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import {
    ChartBarIcon,
    DocumentArrowDownIcon,
    CurrencyRupeeIcon,
    ArrowTrendingDownIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

export default function DepreciationPage() {
    const { assets } = useAssetStore();

    // Calculate depreciation stats
    const stats = useMemo(() => {
        const totalPurchase = assets.reduce((sum, a) => sum + a.purchasePrice, 0);
        const totalCurrent = assets.reduce((sum, a) => sum + a.currentValue, 0);
        const totalDepreciation = totalPurchase - totalCurrent;
        const avgDepreciationRate = assets.reduce((sum, a) => sum + a.depreciationRate, 0) / assets.length;

        return {
            totalPurchase,
            totalCurrent,
            totalDepreciation,
            avgDepreciationRate: avgDepreciationRate.toFixed(1),
            depreciationPercent: ((totalDepreciation / totalPurchase) * 100).toFixed(1),
        };
    }, [assets]);

    // Depreciation by category
    const categoryDepreciation = useMemo(() => {
        const byCategory: Record<string, { purchase: number; current: number; depreciation: number }> = {};
        assets.forEach((asset) => {
            if (!byCategory[asset.category]) {
                byCategory[asset.category] = { purchase: 0, current: 0, depreciation: 0 };
            }
            byCategory[asset.category].purchase += asset.purchasePrice;
            byCategory[asset.category].current += asset.currentValue;
            byCategory[asset.category].depreciation += asset.purchasePrice - asset.currentValue;
        });
        return Object.entries(byCategory).map(([name, data]) => ({
            name,
            ...data,
        }));
    }, [assets]);

    // Depreciation by method
    const methodDistribution = useMemo(() => {
        const byMethod: Record<string, number> = {};
        assets.forEach((asset) => {
            byMethod[asset.depreciationMethod] = (byMethod[asset.depreciationMethod] || 0) + 1;
        });
        return Object.entries(byMethod).map(([name, value]) => ({ name, value }));
    }, [assets]);

    // Year-wise depreciation projection
    const yearProjection = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const projection: { year: string; value: number; depreciation: number }[] = [];
        let currentValue = stats.totalCurrent;
        const avgRate = parseFloat(stats.avgDepreciationRate) / 100;

        for (let i = 0; i <= 5; i++) {
            projection.push({
                year: (currentYear + i).toString(),
                value: Math.round(currentValue),
                depreciation: Math.round(stats.totalPurchase - currentValue),
            });
            currentValue = currentValue * (1 - avgRate);
        }
        return projection;
    }, [stats]);

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)}Cr`;
        }
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)}L`;
        }
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    // Asset-wise depreciation table data
    const assetDepreciation = assets.slice(0, 10).map((asset) => ({
        id: asset.assetId,
        name: asset.name,
        category: asset.category,
        purchase: asset.purchasePrice,
        current: asset.currentValue,
        depreciation: asset.purchasePrice - asset.currentValue,
        method: asset.depreciationMethod,
        rate: asset.depreciationRate,
        usefulLife: asset.usefulLife,
        purchaseDate: asset.purchaseDate,
    }));

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Depreciation & Financial</h1>
                        <p className="text-slate-400 mt-1">Track asset depreciation and book values</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select
                            options={[
                                { value: '2024-25', label: 'FY 2024-25' },
                                { value: '2023-24', label: 'FY 2023-24' },
                                { value: '2022-23', label: 'FY 2022-23' },
                            ]}
                            value="2024-25"
                        />
                        <Button variant="primary" icon={<DocumentArrowDownIcon className="w-4 h-4" />}>
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <CurrencyRupeeIcon className="w-6 h-6 text-indigo-400" />
                            <span className="text-sm text-slate-400">Total Purchase Value</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalPurchase)}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <ChartBarIcon className="w-6 h-6 text-emerald-400" />
                            <span className="text-sm text-slate-400">Current Book Value</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.totalCurrent)}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <ArrowTrendingDownIcon className="w-6 h-6 text-red-400" />
                            <span className="text-sm text-slate-400">Total Depreciation</span>
                        </div>
                        <p className="text-2xl font-bold text-red-400">{formatCurrency(stats.totalDepreciation)}</p>
                        <p className="text-sm text-slate-400 mt-1">{stats.depreciationPercent}% of purchase value</p>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <CalendarDaysIcon className="w-6 h-6 text-amber-400" />
                            <span className="text-sm text-slate-400">Avg. Depreciation Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-400">{stats.avgDepreciationRate}%</p>
                        <p className="text-sm text-slate-400 mt-1">per annum</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Depreciation Projection */}
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-white">5-Year Value Projection</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={yearProjection}>
                                        <defs>
                                            <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                            labelStyle={{ color: '#fff' }}
                                            formatter={(value: any) => [formatCurrency(value), '']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#6366f1"
                                            fillOpacity={1}
                                            fill="url(#valueGradient)"
                                            name="Book Value"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Depreciation by Category */}
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-white">Depreciation by Category</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryDepreciation} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                                        <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={80} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                            labelStyle={{ color: '#fff' }}
                                            formatter={(value: any) => [formatCurrency(value), '']}
                                        />
                                        <Legend />
                                        <Bar dataKey="current" fill="#22c55e" name="Current Value" radius={[0, 4, 4, 0]} />
                                        <Bar dataKey="depreciation" fill="#ef4444" name="Depreciation" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Method Distribution & Assets Table */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Depreciation Method */}
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-white">By Depreciation Method</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={methodDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {methodDistribution.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-2 mt-4">
                                {methodDistribution.map((item, index) => (
                                    <div key={item.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className="text-sm text-slate-300">{item.name}</span>
                                        </div>
                                        <span className="text-sm text-white font-medium">{item.value} assets</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Asset Depreciation Table */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader action={<Button variant="ghost" size="sm">View All</Button>}>
                                <h3 className="text-lg font-semibold text-white">Asset-wise Depreciation</h3>
                            </CardHeader>
                            <CardContent padding={false}>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Asset</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Category</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Purchase</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Current</th>
                                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Depreciation</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Method</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {assetDepreciation.map((asset) => (
                                                <tr key={asset.id} className="hover:bg-white/5">
                                                    <td className="px-4 py-3">
                                                        <p className="text-sm font-medium text-white">{asset.id}</p>
                                                        <p className="text-xs text-slate-400 truncate max-w-[150px]">{asset.name}</p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant="info" size="sm">{asset.category}</Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-white">
                                                        {formatCurrency(asset.purchase)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-emerald-400">
                                                        {formatCurrency(asset.current)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-red-400">
                                                        {formatCurrency(asset.depreciation)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="text-xs text-slate-300">{asset.method}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
