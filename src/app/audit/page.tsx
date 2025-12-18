export const dynamic = 'force-dynamic';

'use client';

import { useState, useMemo } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DataTable, { Column } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import StatCard from '@/components/ui/StatCard';
import { AssetAudit } from '@/types';
import {
    PlusIcon,
    ClipboardDocumentCheckIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    MagnifyingGlassIcon,
    PlayIcon,
} from '@heroicons/react/24/outline';

export default function AuditPage() {
    const { assetAudits, locations, users, dashboardStats } = useAssetStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Stats
    const stats = {
        total: assetAudits.length,
        planned: assetAudits.filter((a) => a.status === 'Planned').length,
        inProgress: assetAudits.filter((a) => a.status === 'In-Progress').length,
        completed: assetAudits.filter((a) => a.status === 'Completed').length,
        totalVerified: assetAudits.reduce((sum, a) => sum + a.verifiedAssets, 0),
        totalMissing: assetAudits.reduce((sum, a) => sum + a.missingAssets, 0),
    };

    // Filter
    const filteredAudits = useMemo(() => {
        return assetAudits.filter((audit) => {
            const matchesSearch = !search ||
                audit.auditNumber.toLowerCase().includes(search.toLowerCase()) ||
                audit.name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = !statusFilter || audit.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [assetAudits, search, statusFilter]);

    const totalPages = Math.ceil(filteredAudits.length / pageSize);
    const paginatedAudits = filteredAudits.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getLocationName = (id: string) => locations.find((l) => l.id === id)?.name || '-';
    const getAuditorName = (id: string) => {
        const user = users.find((u) => u.id === id);
        return user ? `${user.firstName} ${user.lastName}` : '-';
    };

    const getProgress = (audit: AssetAudit) => {
        if (audit.totalAssets === 0) return 0;
        return Math.round((audit.verifiedAssets / audit.totalAssets) * 100);
    };

    const columns: Column<AssetAudit>[] = [
        {
            key: 'auditNumber',
            header: 'Audit #',
            sortable: true,
            render: (audit) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${audit.status === 'Completed' ? 'bg-emerald-500/20' :
                        audit.status === 'In-Progress' ? 'bg-amber-500/20' :
                            'bg-blue-500/20'
                        }`}>
                        <ClipboardDocumentCheckIcon className={`w-5 h-5 ${audit.status === 'Completed' ? 'text-emerald-400' :
                            audit.status === 'In-Progress' ? 'text-amber-400' :
                                'text-blue-400'
                            }`} />
                    </div>
                    <div>
                        <p className="font-medium text-white">{audit.auditNumber}</p>
                        <p className="text-xs text-slate-400">{audit.type}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            render: (audit) => <span className="text-white">{audit.name}</span>,
        },
        {
            key: 'locationId',
            header: 'Location',
            render: (audit) => <span className="text-slate-300">{getLocationName(audit.locationId)}</span>,
        },
        {
            key: 'auditorId',
            header: 'Auditor',
            render: (audit) => <span className="text-slate-300">{getAuditorName(audit.auditorId)}</span>,
        },
        {
            key: 'plannedStartDate',
            header: 'Schedule',
            render: (audit) => (
                <div>
                    <p className="text-white">{audit.plannedStartDate}</p>
                    <p className="text-xs text-slate-400">to {audit.plannedEndDate}</p>
                </div>
            ),
        },
        {
            key: 'progress',
            header: 'Progress',
            render: (audit) => {
                const progress = getProgress(audit);
                return (
                    <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-300">{audit.verifiedAssets}/{audit.totalAssets}</span>
                            <span className="text-white font-medium">{progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (audit) => (
                <Badge
                    variant={
                        audit.status === 'Completed' ? 'success' :
                            audit.status === 'In-Progress' ? 'warning' :
                                audit.status === 'Planned' ? 'info' : 'default'
                    }
                    dot
                >
                    {audit.status}
                </Badge>
            ),
        },
        {
            key: 'discrepancies',
            header: 'Issues',
            render: (audit) => (
                <div className="flex items-center gap-2">
                    {audit.missingAssets > 0 && (
                        <Badge variant="danger">{audit.missingAssets} missing</Badge>
                    )}
                    {audit.excessAssets > 0 && (
                        <Badge variant="warning">{audit.excessAssets} excess</Badge>
                    )}
                    {audit.missingAssets === 0 && audit.excessAssets === 0 && (
                        <span className="text-slate-400">-</span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Asset Audit</h1>
                        <p className="text-slate-400 mt-1">Plan and execute physical asset verification</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" icon={<PlayIcon className="w-4 h-4" />}>
                            Start Verification
                        </Button>
                        <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setShowNewModal(true)}>
                            New Audit
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard
                        title="Total Audits"
                        value={stats.total}
                        icon={<ClipboardDocumentCheckIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-purple-600"
                    />
                    <StatCard
                        title="Planned"
                        value={stats.planned}
                        icon={<CalendarDaysIcon className="w-5 h-5 text-white" />}
                        iconBg="from-blue-500 to-cyan-600"
                    />
                    <StatCard
                        title="In Progress"
                        value={stats.inProgress}
                        icon={<PlayIcon className="w-5 h-5 text-white" />}
                        iconBg="from-amber-500 to-orange-600"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        icon={<CheckCircleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-emerald-500 to-green-600"
                    />
                    <StatCard
                        title="Verified"
                        value={stats.totalVerified}
                        icon={<CheckCircleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-violet-500 to-purple-600"
                    />
                    <StatCard
                        title="Missing"
                        value={stats.totalMissing}
                        icon={<ExclamationCircleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-red-500 to-rose-600"
                    />
                </div>

                {/* Filters */}
                <Card>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by audit number or name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Statuses' },
                                    { value: 'Planned', label: 'Planned' },
                                    { value: 'In-Progress', label: 'In Progress' },
                                    { value: 'Completed', label: 'Completed' },
                                    { value: 'Pending-Review', label: 'Pending Review' },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardContent padding={false}>
                        <DataTable
                            data={paginatedAudits}
                            columns={columns}
                            keyExtractor={(item) => item.id}
                            emptyMessage="No audits found."
                            pagination={{
                                currentPage,
                                totalPages,
                                pageSize,
                                totalItems: filteredAudits.length,
                                onPageChange: setCurrentPage,
                            }}
                        />
                    </CardContent>
                </Card>

                {/* New Audit Modal */}
                <Modal
                    isOpen={showNewModal}
                    onClose={() => setShowNewModal(false)}
                    title="Create New Audit"
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
                            <Button variant="primary">Create Audit</Button>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Audit Name" placeholder="e.g., Q2 IT Assets Verification" required />
                        <Select
                            label="Audit Type"
                            options={[
                                { value: '', label: 'Select Type' },
                                { value: 'Annual', label: 'Annual' },
                                { value: 'Quarterly', label: 'Quarterly' },
                                { value: 'Monthly', label: 'Monthly' },
                                { value: 'Ad-hoc', label: 'Ad-hoc' },
                            ]}
                            required
                        />
                        <Select
                            label="Location"
                            options={[
                                { value: '', label: 'Select Location' },
                                ...locations.map((l) => ({ value: l.id, label: `${l.name} (${l.type})` })),
                            ]}
                            required
                        />
                        <Select
                            label="Auditor"
                            options={[
                                { value: '', label: 'Select Auditor' },
                                ...users.filter((u) => u.role === 'Auditor').map((u) => ({
                                    value: u.id,
                                    label: `${u.firstName} ${u.lastName}`,
                                })),
                            ]}
                            required
                        />
                        <Input label="Planned Start Date" type="date" required />
                        <Input label="Planned End Date" type="date" required />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Remarks</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="Additional notes..."
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </Sidebar>
    );
}
