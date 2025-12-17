'use client';

import { useState } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import {
    ChartBarIcon,
    DocumentArrowDownIcon,
    CalendarDaysIcon,
    CubeIcon,
    WrenchScrewdriverIcon,
    CurrencyRupeeIcon,
    ClipboardDocumentCheckIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const reportCategories = [
    {
        id: 'inventory',
        name: 'Inventory Reports',
        icon: CubeIcon,
        color: 'from-indigo-500 to-purple-600',
        reports: [
            { id: 'asset-summary', name: 'Asset Summary Report', description: 'Complete overview of all assets' },
            { id: 'asset-register', name: 'Asset Register', description: 'Detailed asset listing with all attributes' },
            { id: 'category-wise', name: 'Category-wise Assets', description: 'Assets grouped by category' },
            { id: 'location-wise', name: 'Location-wise Assets', description: 'Assets by campus/building/room' },
            { id: 'aging-report', name: 'Asset Aging Report', description: 'Assets by acquisition date' },
        ],
    },
    {
        id: 'financial',
        name: 'Financial Reports',
        icon: CurrencyRupeeIcon,
        color: 'from-emerald-500 to-green-600',
        reports: [
            { id: 'depreciation', name: 'Depreciation Schedule', description: 'Asset depreciation calculations' },
            { id: 'valuation', name: 'Asset Valuation Report', description: 'Current book value of assets' },
            { id: 'capitalization', name: 'Capitalization Report', description: 'Capital assets summary' },
            { id: 'cost-center', name: 'Cost Center Report', description: 'Assets by cost center' },
        ],
    },
    {
        id: 'maintenance',
        name: 'Maintenance Reports',
        icon: WrenchScrewdriverIcon,
        color: 'from-amber-500 to-orange-600',
        reports: [
            { id: 'maintenance-history', name: 'Maintenance History', description: 'Complete maintenance records' },
            { id: 'maintenance-cost', name: 'Maintenance Cost Analysis', description: 'Cost breakdown by asset/type' },
            { id: 'downtime-report', name: 'Downtime Analysis', description: 'Asset downtime statistics' },
            { id: 'preventive-schedule', name: 'Preventive Maintenance Schedule', description: 'Upcoming PM schedules' },
        ],
    },
    {
        id: 'compliance',
        name: 'Compliance Reports',
        icon: ShieldCheckIcon,
        color: 'from-blue-500 to-cyan-600',
        reports: [
            { id: 'warranty-status', name: 'Warranty Status Report', description: 'Warranty expiry tracking' },
            { id: 'amc-status', name: 'AMC/CMC Status', description: 'Contract status and renewals' },
            { id: 'calibration-due', name: 'Calibration Due Report', description: 'Equipment calibration schedule' },
            { id: 'compliance-status', name: 'Compliance Status', description: 'NABH/NAAC/ISO compliance' },
        ],
    },
    {
        id: 'audit',
        name: 'Audit Reports',
        icon: ClipboardDocumentCheckIcon,
        color: 'from-pink-500 to-rose-600',
        reports: [
            { id: 'audit-summary', name: 'Audit Summary Report', description: 'Physical verification results' },
            { id: 'discrepancy-report', name: 'Discrepancy Report', description: 'Missing/excess assets' },
            { id: 'movement-history', name: 'Asset Movement History', description: 'Transfer and movement log' },
            { id: 'activity-log', name: 'Activity Log Report', description: 'User activity audit trail' },
        ],
    },
    {
        id: 'department',
        name: 'Department Reports',
        icon: BuildingOfficeIcon,
        color: 'from-violet-500 to-purple-600',
        reports: [
            { id: 'dept-asset-summary', name: 'Department Asset Summary', description: 'Assets by department' },
            { id: 'dept-utilization', name: 'Department Utilization', description: 'Asset utilization by dept' },
            { id: 'dept-cost', name: 'Department Cost Report', description: 'Asset costs by department' },
        ],
    },
];

export default function ReportsPage() {
    const { assets, dashboardStats } = useAssetStore();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [format, setFormat] = useState('pdf');

    const handleGenerateReport = (reportId: string) => {
        // In a real app, this would trigger report generation
        console.log('Generating report:', reportId, { dateRange, format });
    };

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
                        <p className="text-slate-400 mt-1">Generate comprehensive asset management reports</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <p className="text-sm text-slate-400">Total Assets</p>
                        <p className="text-2xl font-bold text-white mt-1">{dashboardStats.totalAssets.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                        <p className="text-sm text-slate-400">Total Value</p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">₹{(dashboardStats.totalValue / 10000000).toFixed(1)}Cr</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                        <p className="text-sm text-slate-400">Reports Generated</p>
                        <p className="text-2xl font-bold text-amber-400 mt-1">156</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <p className="text-sm text-slate-400">Last Report</p>
                        <p className="text-lg font-bold text-blue-400 mt-1">2 hours ago</p>
                    </div>
                </div>

                {/* Global Filters */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <CalendarDaysIcon className="w-5 h-5 text-indigo-400" />
                            Report Parameters
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">From Date</label>
                                <input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">To Date</label>
                                <input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>
                            <Select
                                label="Export Format"
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                options={[
                                    { value: 'pdf', label: 'PDF' },
                                    { value: 'excel', label: 'Excel (XLSX)' },
                                    { value: 'csv', label: 'CSV' },
                                ]}
                            />
                            <div className="flex items-end">
                                <Button variant="secondary" className="w-full">
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Report Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportCategories.map((category) => (
                        <Card key={category.id} hover onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                                        <category.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                        <p className="text-sm text-slate-400 mt-1">{category.reports.length} reports available</p>
                                    </div>
                                </div>

                                {selectedCategory === category.id && (
                                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                                        {category.reports.map((report) => (
                                            <div
                                                key={report.id}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer group"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-white">{report.name}</p>
                                                    <p className="text-xs text-slate-400">{report.description}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<DocumentArrowDownIcon className="w-4 h-4" />}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleGenerateReport(report.id);
                                                    }}
                                                >
                                                    Generate
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Reports */}
                <Card>
                    <CardHeader action={<Button variant="ghost" size="sm">View All</Button>}>
                        <h3 className="text-lg font-semibold text-white">Recently Generated Reports</h3>
                    </CardHeader>
                    <CardContent padding={false}>
                        <div className="divide-y divide-white/5">
                            {[
                                { name: 'Asset Summary Report', type: 'Inventory', date: '2024-06-15', format: 'PDF', size: '2.4 MB' },
                                { name: 'Depreciation Schedule', type: 'Financial', date: '2024-06-14', format: 'Excel', size: '1.8 MB' },
                                { name: 'Maintenance Cost Analysis', type: 'Maintenance', date: '2024-06-13', format: 'PDF', size: '3.1 MB' },
                                { name: 'Q2 Audit Summary', type: 'Audit', date: '2024-06-12', format: 'PDF', size: '1.2 MB' },
                                { name: 'Warranty Expiry Report', type: 'Compliance', date: '2024-06-10', format: 'Excel', size: '0.8 MB' },
                            ].map((report, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 hover:bg-white/5">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                        <ChartBarIcon className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{report.name}</p>
                                        <p className="text-sm text-slate-400">{report.type} • {report.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-white">{report.format}</p>
                                        <p className="text-xs text-slate-400">{report.size}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" icon={<DocumentArrowDownIcon className="w-4 h-4" />}>
                                        Download
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Sidebar>
    );
}
