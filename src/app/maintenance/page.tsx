'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { MaintenanceRecord } from '@/types';
import {
    PlusIcon,
    WrenchScrewdriverIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';

export default function MaintenancePage() {
    const router = useRouter();
    const { maintenanceRecords, assets, users, addMaintenanceRecord } = useAssetStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Form State
    const initialFormState = {
        assetId: '',
        type: '' as 'Preventive' | 'Breakdown' | 'Corrective' | 'Predictive' | '',
        priority: '' as 'Low' | 'Medium' | 'High' | 'Critical' | '',
        scheduledDate: '',
        assignedTo: '',
        cost: 0,
        description: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    const handleSave = () => {
        const newTicket: MaintenanceRecord = {
            id: `maint-${Date.now()}`,
            ticketNumber: `MT-${new Date().getFullYear()}-${String(maintenanceRecords.length + 1).padStart(3, '0')}`,
            assetId: formData.assetId,
            type: formData.type as 'Preventive' | 'Breakdown' | 'Corrective' | 'Predictive',
            status: 'Scheduled',
            priority: formData.priority as 'Low' | 'Medium' | 'High' | 'Critical',
            description: formData.description,
            reportedBy: users[0]?.id || 'user-1',
            reportedDate: new Date().toISOString().split('T')[0],
            assignedTo: formData.assignedTo,
            scheduledDate: formData.scheduledDate,
            cost: formData.cost,
            spareParts: [],
            downtime: 0,
            documents: [],
        };
        addMaintenanceRecord(newTicket);
        setShowNewModal(false);
        setFormData(initialFormState);
    };

    // Stats
    const stats = {
        total: maintenanceRecords.length,
        scheduled: maintenanceRecords.filter((m) => m.status === 'Scheduled').length,
        inProgress: maintenanceRecords.filter((m) => m.status === 'In-Progress').length,
        completed: maintenanceRecords.filter((m) => m.status === 'Completed').length,
        overdue: maintenanceRecords.filter((m) => m.status === 'Overdue').length,
        totalCost: maintenanceRecords.reduce((sum, m) => sum + m.cost, 0),
    };

    // Filter records
    const filteredRecords = useMemo(() => {
        return maintenanceRecords.filter((record) => {
            const asset = assets.find((a) => a.id === record.assetId);
            const matchesSearch =
                !search ||
                record.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
                record.description.toLowerCase().includes(search.toLowerCase()) ||
                asset?.name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = !statusFilter || record.status === statusFilter;
            const matchesType = !typeFilter || record.type === typeFilter;
            const matchesPriority = !priorityFilter || record.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesType && matchesPriority;
        });
    }, [maintenanceRecords, assets, search, statusFilter, typeFilter, priorityFilter]);

    const totalPages = Math.ceil(filteredRecords.length / pageSize);
    const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getAssetName = (id: string) => {
        const asset = assets.find((a) => a.id === id);
        return asset ? asset.name : '-';
    };

    const getAssetId = (id: string) => {
        const asset = assets.find((a) => a.id === id);
        return asset ? asset.assetId : '-';
    };

    const getUserName = (id: string) => {
        const user = users.find((u) => u.id === id);
        return user ? `${user.firstName} ${user.lastName}` : '-';
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'In-Progress': return 'warning';
            case 'Scheduled': return 'info';
            case 'Overdue': return 'danger';
            case 'Cancelled': return 'default';
            default: return 'default';
        }
    };

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'danger';
            case 'High': return 'warning';
            case 'Medium': return 'info';
            case 'Low': return 'default';
            default: return 'default';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const columns: Column<MaintenanceRecord>[] = [
        {
            key: 'ticketNumber',
            header: 'Ticket #',
            sortable: true,
            render: (record) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${record.type === 'Preventive' ? 'bg-blue-500/20' :
                        record.type === 'Breakdown' ? 'bg-red-500/20' :
                            'bg-amber-500/20'
                        }`}>
                        <WrenchScrewdriverIcon className={`w-5 h-5 ${record.type === 'Preventive' ? 'text-blue-400' :
                            record.type === 'Breakdown' ? 'text-red-400' :
                                'text-amber-400'
                            }`} />
                    </div>
                    <div>
                        <p className="font-medium text-white">{record.ticketNumber}</p>
                        <p className="text-xs text-slate-400">{record.type}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'assetId',
            header: 'Asset',
            sortable: true,
            render: (record) => (
                <div>
                    <p className="font-medium text-white">{getAssetId(record.assetId)}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[150px]">{getAssetName(record.assetId)}</p>
                </div>
            ),
        },
        {
            key: 'priority',
            header: 'Priority',
            sortable: true,
            render: (record) => (
                <Badge variant={getPriorityVariant(record.priority)} dot>
                    {record.priority}
                </Badge>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (record) => (
                <Badge variant={getStatusVariant(record.status)}>
                    {record.status}
                </Badge>
            ),
        },
        {
            key: 'assignedTo',
            header: 'Assigned To',
            render: (record) => <span className="text-slate-300">{getUserName(record.assignedTo)}</span>,
        },
        {
            key: 'scheduledDate',
            header: 'Scheduled',
            sortable: true,
            render: (record) => <span className="text-slate-300">{record.scheduledDate}</span>,
        },
        {
            key: 'cost',
            header: 'Cost',
            sortable: true,
            render: (record) => <span className="text-white font-medium">{formatCurrency(record.cost)}</span>,
        },
        {
            key: 'downtime',
            header: 'Downtime',
            render: (record) => <span className="text-slate-300">{record.downtime}h</span>,
        },
    ];

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Maintenance Management</h1>
                        <p className="text-slate-400 mt-1">Track and manage asset maintenance activities</p>
                    </div>
                    <Button
                        variant="primary"
                        icon={<PlusIcon className="w-4 h-4" />}
                        onClick={() => setShowNewModal(true)}
                    >
                        New Ticket
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard
                        title="Total Tickets"
                        value={stats.total}
                        icon={<WrenchScrewdriverIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-purple-600"
                    />
                    <StatCard
                        title="Scheduled"
                        value={stats.scheduled}
                        icon={<ClockIcon className="w-5 h-5 text-white" />}
                        iconBg="from-blue-500 to-cyan-600"
                    />
                    <StatCard
                        title="In Progress"
                        value={stats.inProgress}
                        icon={<WrenchScrewdriverIcon className="w-5 h-5 text-white" />}
                        iconBg="from-amber-500 to-orange-600"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        icon={<CheckCircleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-emerald-500 to-green-600"
                    />
                    <StatCard
                        title="Overdue"
                        value={stats.overdue}
                        icon={<ExclamationTriangleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-red-500 to-rose-600"
                    />
                    <StatCard
                        title="Total Cost (YTD)"
                        value={formatCurrency(stats.totalCost)}
                        icon={<span className="text-white text-lg">₹</span>}
                        iconBg="from-violet-500 to-purple-600"
                    />
                </div>

                {/* Filters & Search */}
                <Card>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by ticket number, description, or asset..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                                />
                            </div>
                            <Button
                                variant={showFilters ? 'outline' : 'secondary'}
                                icon={<FunnelIcon className="w-4 h-4" />}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filters
                            </Button>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                                <Select
                                    label="Status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    options={[
                                        { value: '', label: 'All Statuses' },
                                        { value: 'Scheduled', label: 'Scheduled' },
                                        { value: 'In-Progress', label: 'In Progress' },
                                        { value: 'Completed', label: 'Completed' },
                                        { value: 'Overdue', label: 'Overdue' },
                                        { value: 'Cancelled', label: 'Cancelled' },
                                    ]}
                                />
                                <Select
                                    label="Type"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    options={[
                                        { value: '', label: 'All Types' },
                                        { value: 'Preventive', label: 'Preventive' },
                                        { value: 'Breakdown', label: 'Breakdown' },
                                        { value: 'Corrective', label: 'Corrective' },
                                        { value: 'Predictive', label: 'Predictive' },
                                    ]}
                                />
                                <Select
                                    label="Priority"
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    options={[
                                        { value: '', label: 'All Priorities' },
                                        { value: 'Critical', label: 'Critical' },
                                        { value: 'High', label: 'High' },
                                        { value: 'Medium', label: 'Medium' },
                                        { value: 'Low', label: 'Low' },
                                    ]}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardContent padding={false}>
                        <DataTable
                            data={paginatedRecords}
                            columns={columns}
                            keyExtractor={(item) => item.id}
                            onRowClick={(record) => router.push(`/maintenance/${record.id}`)}
                            emptyMessage="No maintenance records found."
                            pagination={{
                                currentPage,
                                totalPages,
                                pageSize,
                                totalItems: filteredRecords.length,
                                onPageChange: setCurrentPage,
                            }}
                        />
                    </CardContent>
                </Card>

                {/* New Ticket Modal */}
                <Modal
                    isOpen={showNewModal}
                    onClose={() => { setShowNewModal(false); setFormData(initialFormState); }}
                    title="Create Maintenance Ticket"
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => { setShowNewModal(false); setFormData(initialFormState); }}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSave}>Create Ticket</Button>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Asset"
                            value={formData.assetId}
                            onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                            options={[
                                { value: '', label: 'Select Asset' },
                                ...assets.map((a) => ({ value: a.id, label: `${a.assetId} - ${a.name}` })),
                            ]}
                            required
                        />
                        <Select
                            label="Maintenance Type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            options={[
                                { value: '', label: 'Select Type' },
                                { value: 'Preventive', label: 'Preventive' },
                                { value: 'Breakdown', label: 'Breakdown' },
                                { value: 'Corrective', label: 'Corrective' },
                                { value: 'Predictive', label: 'Predictive' },
                            ]}
                            required
                        />
                        <Select
                            label="Priority"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                            options={[
                                { value: '', label: 'Select Priority' },
                                { value: 'Low', label: 'Low' },
                                { value: 'Medium', label: 'Medium' },
                                { value: 'High', label: 'High' },
                                { value: 'Critical', label: 'Critical' },
                            ]}
                            required
                        />
                        <Input
                            label="Scheduled Date"
                            type="date"
                            value={formData.scheduledDate}
                            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                            required
                        />
                        <Select
                            label="Assign To"
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                            options={[
                                { value: '', label: 'Select Technician' },
                                ...users.filter((u) => u.role === 'Technician').map((u) => ({
                                    value: u.id,
                                    label: `${u.firstName} ${u.lastName}`,
                                })),
                            ]}
                        />
                        <Input
                            label="Estimated Cost (₹)"
                            type="number"
                            value={formData.cost.toString()}
                            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="Describe the maintenance requirement..."
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </Sidebar>
    );
}
