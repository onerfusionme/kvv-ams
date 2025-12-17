'use client';

import { useState } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import {
    ShieldCheckIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    DocumentTextIcon,
    ChartBarIcon,
    ArrowUpIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';

// Compliance frameworks and their requirements
const complianceFrameworks = [
    {
        id: 'nabh',
        name: 'NABH',
        fullName: 'National Accreditation Board for Hospitals & Healthcare Providers',
        status: 'Compliant',
        score: 94,
        lastAudit: '2024-04-15',
        nextAudit: '2024-10-15',
        validUntil: '2026-04-15',
        requirements: [
            { id: 1, name: 'Equipment Maintenance Policy', status: 'Compliant' },
            { id: 2, name: 'Calibration Records', status: 'Compliant' },
            { id: 3, name: 'Biomedical Equipment Safety', status: 'Compliant' },
            { id: 4, name: 'Asset Tracking System', status: 'Compliant' },
            { id: 5, name: 'Preventive Maintenance Schedule', status: 'Partial' },
        ],
    },
    {
        id: 'naac',
        name: 'NAAC',
        fullName: 'National Assessment and Accreditation Council',
        status: 'Compliant',
        score: 91,
        lastAudit: '2024-02-20',
        nextAudit: '2025-02-20',
        validUntil: '2029-02-20',
        requirements: [
            { id: 1, name: 'Laboratory Equipment Inventory', status: 'Compliant' },
            { id: 2, name: 'Research Equipment Utilization', status: 'Compliant' },
            { id: 3, name: 'IT Infrastructure Documentation', status: 'Compliant' },
            { id: 4, name: 'Library Resource Management', status: 'Compliant' },
            { id: 5, name: 'Sports Equipment Inventory', status: 'Compliant' },
        ],
    },
    {
        id: 'iso',
        name: 'ISO 55001',
        fullName: 'Asset Management System Standard',
        status: 'In Progress',
        score: 78,
        lastAudit: '2024-01-10',
        nextAudit: '2024-07-10',
        validUntil: null,
        requirements: [
            { id: 1, name: 'Asset Management Policy', status: 'Compliant' },
            { id: 2, name: 'Strategic Asset Planning', status: 'Partial' },
            { id: 3, name: 'Risk Assessment Framework', status: 'Partial' },
            { id: 4, name: 'Performance Evaluation', status: 'In Progress' },
            { id: 5, name: 'Continual Improvement', status: 'In Progress' },
        ],
    },
    {
        id: 'iso27001',
        name: 'ISO 27001',
        fullName: 'Information Security Management',
        status: 'Compliant',
        score: 89,
        lastAudit: '2023-11-05',
        nextAudit: '2024-11-05',
        validUntil: '2026-11-05',
        requirements: [
            { id: 1, name: 'IT Asset Inventory', status: 'Compliant' },
            { id: 2, name: 'Access Control Records', status: 'Compliant' },
            { id: 3, name: 'Data Classification', status: 'Compliant' },
            { id: 4, name: 'Incident Management', status: 'Partial' },
            { id: 5, name: 'Business Continuity', status: 'Compliant' },
        ],
    },
];

const upcomingDeadlines = [
    { id: 1, type: 'Calibration', asset: '45 Medical Devices', dueDate: '2024-06-30', priority: 'High' },
    { id: 2, type: 'PM Schedule', asset: 'AC Units - All Buildings', dueDate: '2024-07-15', priority: 'Medium' },
    { id: 3, type: 'AMC Renewal', asset: '12 IT Servers', dueDate: '2024-07-30', priority: 'High' },
    { id: 4, type: 'Safety Inspection', asset: 'Lab Equipment - Chemistry', dueDate: '2024-08-01', priority: 'Medium' },
    { id: 5, type: 'Documentation', asset: 'Asset Register Update', dueDate: '2024-06-25', priority: 'Low' },
];

export default function CompliancePage() {
    const [selectedFramework, setSelectedFramework] = useState<typeof complianceFrameworks[0] | null>(null);

    const overallStats = {
        frameworks: complianceFrameworks.length,
        compliant: complianceFrameworks.filter((f) => f.status === 'Compliant').length,
        inProgress: complianceFrameworks.filter((f) => f.status === 'In Progress').length,
        avgScore: Math.round(complianceFrameworks.reduce((sum, f) => sum + f.score, 0) / complianceFrameworks.length),
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Compliant': return 'bg-emerald-500';
            case 'In Progress': return 'bg-amber-500';
            case 'Partial': return 'bg-amber-500';
            case 'Non-Compliant': return 'bg-red-500';
            default: return 'bg-slate-500';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-400';
        if (score >= 75) return 'text-amber-400';
        return 'text-red-400';
    };

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case 'High': return 'danger';
            case 'Medium': return 'warning';
            case 'Low': return 'default';
            default: return 'default';
        }
    };

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Compliance & Accreditation</h1>
                        <p className="text-slate-400 mt-1">Track regulatory compliance and accreditation status</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" icon={<DocumentTextIcon className="w-4 h-4" />}>
                            Generate Report
                        </Button>
                        <Button variant="primary" icon={<ShieldCheckIcon className="w-4 h-4" />}>
                            Schedule Audit
                        </Button>
                    </div>
                </div>

                {/* Overall Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Frameworks"
                        value={overallStats.frameworks}
                        icon={<ShieldCheckIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-purple-600"
                    />
                    <StatCard
                        title="Fully Compliant"
                        value={overallStats.compliant}
                        icon={<CheckCircleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-emerald-500 to-green-600"
                    />
                    <StatCard
                        title="In Progress"
                        value={overallStats.inProgress}
                        icon={<ClockIcon className="w-5 h-5 text-white" />}
                        iconBg="from-amber-500 to-orange-600"
                    />
                    <StatCard
                        title="Average Score"
                        value={`${overallStats.avgScore}%`}
                        icon={<ChartBarIcon className="w-5 h-5 text-white" />}
                        iconBg="from-blue-500 to-cyan-600"
                        trend="up"
                    />
                </div>

                {/* Compliance Frameworks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {complianceFrameworks.map((framework) => (
                        <Card
                            key={framework.id}
                            hover
                            onClick={() => setSelectedFramework(framework)}
                        >
                            <CardContent>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${framework.status === 'Compliant' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                                            }`}>
                                            <ShieldCheckIcon className={`w-6 h-6 ${framework.status === 'Compliant' ? 'text-emerald-400' : 'text-amber-400'
                                                }`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{framework.name}</h3>
                                            <p className="text-xs text-slate-400 max-w-[200px] truncate">{framework.fullName}</p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={framework.status === 'Compliant' ? 'success' : 'warning'}
                                        dot
                                    >
                                        {framework.status}
                                    </Badge>
                                </div>

                                {/* Score */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-slate-400">Compliance Score</span>
                                        <span className={`text-lg font-bold ${getScoreColor(framework.score)}`}>
                                            {framework.score}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${framework.score >= 90 ? 'bg-emerald-500' :
                                                framework.score >= 75 ? 'bg-amber-500' :
                                                    'bg-red-500'
                                                }`}
                                            style={{ width: `${framework.score}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Requirements Preview */}
                                <div className="space-y-2 mb-4">
                                    {framework.requirements.slice(0, 3).map((req) => (
                                        <div key={req.id} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-300 truncate max-w-[200px]">{req.name}</span>
                                            <div className={`w-2 h-2 rounded-full ${getStatusColor(req.status)}`} />
                                        </div>
                                    ))}
                                    <p className="text-xs text-slate-500">+{framework.requirements.length - 3} more requirements</p>
                                </div>

                                {/* Audit Info */}
                                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-400">Last Audit</p>
                                        <p className="text-white">{framework.lastAudit}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Next Audit</p>
                                        <p className="text-white">{framework.nextAudit}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Upcoming Deadlines */}
                <Card>
                    <CardHeader action={<Button variant="ghost" size="sm">View All</Button>}>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <CalendarDaysIcon className="w-5 h-5 text-indigo-400" />
                            Upcoming Compliance Deadlines
                        </h3>
                    </CardHeader>
                    <CardContent padding={false}>
                        <div className="divide-y divide-white/5">
                            {upcomingDeadlines.map((deadline) => (
                                <div key={deadline.id} className="flex items-center gap-4 p-4 hover:bg-white/5">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${deadline.priority === 'High' ? 'bg-red-500/20' :
                                        deadline.priority === 'Medium' ? 'bg-amber-500/20' :
                                            'bg-blue-500/20'
                                        }`}>
                                        <ExclamationTriangleIcon className={`w-5 h-5 ${deadline.priority === 'High' ? 'text-red-400' :
                                            deadline.priority === 'Medium' ? 'text-amber-400' :
                                                'text-blue-400'
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{deadline.type}</p>
                                        <p className="text-sm text-slate-400">{deadline.asset}</p>
                                    </div>
                                    <Badge variant={getPriorityVariant(deadline.priority)}>{deadline.priority}</Badge>
                                    <div className="text-right">
                                        <p className="text-white font-medium">{deadline.dueDate}</p>
                                        <p className="text-xs text-slate-400">
                                            {Math.ceil((new Date(deadline.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Compliance Checklist */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-white">Documentation Status</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { name: 'Asset Register', status: 'Complete', date: 'Updated today' },
                                    { name: 'Maintenance Logs', status: 'Complete', date: 'Updated 2 days ago' },
                                    { name: 'Calibration Records', status: 'Pending', date: '5 records pending' },
                                    { name: 'Disposal Records', status: 'Complete', date: 'Updated this week' },
                                    { name: 'Safety Inspections', status: 'Pending', date: '3 pending' },
                                ].map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                        <div>
                                            <p className="text-sm font-medium text-white">{doc.name}</p>
                                            <p className="text-xs text-slate-400">{doc.date}</p>
                                        </div>
                                        <Badge variant={doc.status === 'Complete' ? 'success' : 'warning'} size="sm">
                                            {doc.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-white">Audit Readiness</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative w-32 h-32">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="#334155"
                                            strokeWidth="12"
                                            fill="none"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="url(#auditGradient)"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={`${0.88 * 352} 352`}
                                        />
                                        <defs>
                                            <linearGradient id="auditGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#22c55e" />
                                                <stop offset="100%" stopColor="#10b981" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-white">88%</span>
                                        <span className="text-xs text-slate-400">Ready</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Documentation</span>
                                    <span className="text-emerald-400">95%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Maintenance Records</span>
                                    <span className="text-emerald-400">92%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Calibration Status</span>
                                    <span className="text-amber-400">78%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Safety Compliance</span>
                                    <span className="text-emerald-400">90%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-white">Recent Improvements</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { title: 'NABH Score Improved', change: '+5%', date: 'Last month' },
                                    { title: 'PM Compliance Rate', change: '+12%', date: '2 weeks ago' },
                                    { title: 'Calibration Backlog Cleared', change: '-23 items', date: 'This week' },
                                    { title: 'Documentation Updated', change: '45 records', date: 'Yesterday' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <ArrowUpIcon className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{item.title}</p>
                                            <p className="text-xs text-slate-400">{item.date}</p>
                                        </div>
                                        <span className="text-emerald-400 font-medium">{item.change}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Sidebar>
    );
}
