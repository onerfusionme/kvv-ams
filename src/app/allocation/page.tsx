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
import { AssetTransfer } from '@/types';
import {
    PlusIcon,
    ArrowsRightLeftIcon,
    CheckIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    ClockIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function AllocationPage() {
    const { assetTransfers, assets, locations, departments, users, approveTransfer, rejectTransfer } = useAssetStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState<AssetTransfer | null>(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Stats
    const stats = {
        total: assetTransfers.length,
        pending: assetTransfers.filter((t) => t.approvalStatus === 'Pending').length,
        approved: assetTransfers.filter((t) => t.approvalStatus === 'Approved').length,
        rejected: assetTransfers.filter((t) => t.approvalStatus === 'Rejected').length,
    };

    // Filter
    const filteredTransfers = useMemo(() => {
        return assetTransfers.filter((transfer) => {
            const asset = assets.find((a) => a.id === transfer.assetId);
            const matchesSearch = !search || asset?.assetId.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = !statusFilter || transfer.approvalStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [assetTransfers, assets, search, statusFilter]);

    const totalPages = Math.ceil(filteredTransfers.length / pageSize);
    const paginatedTransfers = filteredTransfers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getAsset = (id: string) => assets.find((a) => a.id === id);
    const getLocation = (id: string) => locations.find((l) => l.id === id);
    const getDepartment = (id: string) => departments.find((d) => d.id === id);
    const getUser = (id: string | null) => id ? users.find((u) => u.id === id) : null;

    const handleApprove = () => {
        if (selectedTransfer) {
            approveTransfer(selectedTransfer.id, 'user-1');
            setShowApproveModal(false);
            setSelectedTransfer(null);
        }
    };

    const handleReject = () => {
        if (selectedTransfer) {
            rejectTransfer(selectedTransfer.id);
            setShowApproveModal(false);
            setSelectedTransfer(null);
        }
    };

    const columns: Column<AssetTransfer>[] = [
        {
            key: 'assetId',
            header: 'Asset',
            sortable: true,
            render: (transfer) => {
                const asset = getAsset(transfer.assetId);
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <ArrowsRightLeftIcon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <p className="font-medium text-white">{asset?.assetId || '-'}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[150px]">{asset?.name || '-'}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'fromLocationId',
            header: 'From',
            render: (transfer) => (
                <div>
                    <p className="text-white">{getLocation(transfer.fromLocationId)?.name || '-'}</p>
                    <p className="text-xs text-slate-400">{getDepartment(transfer.fromDepartmentId)?.name || '-'}</p>
                </div>
            ),
        },
        {
            key: 'toLocationId',
            header: 'To',
            render: (transfer) => (
                <div>
                    <p className="text-white">{getLocation(transfer.toLocationId)?.name || '-'}</p>
                    <p className="text-xs text-slate-400">{getDepartment(transfer.toDepartmentId)?.name || '-'}</p>
                </div>
            ),
        },
        {
            key: 'transferType',
            header: 'Type',
            render: (transfer) => (
                <Badge variant={transfer.transferType === 'Permanent' ? 'info' : 'purple'}>
                    {transfer.transferType}
                </Badge>
            ),
        },
        {
            key: 'requestedDate',
            header: 'Requested',
            sortable: true,
            render: (transfer) => (
                <div>
                    <p className="text-white">{transfer.requestedDate}</p>
                    <p className="text-xs text-slate-400">by {getUser(transfer.requestedBy)?.firstName || '-'}</p>
                </div>
            ),
        },
        {
            key: 'approvalStatus',
            header: 'Status',
            sortable: true,
            render: (transfer) => (
                <Badge
                    variant={
                        transfer.approvalStatus === 'Approved' ? 'success' :
                            transfer.approvalStatus === 'Rejected' ? 'danger' :
                                transfer.approvalStatus === 'Pending' ? 'warning' : 'default'
                    }
                    dot
                >
                    {transfer.approvalStatus}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (transfer) => (
                transfer.approvalStatus === 'Pending' ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => { setSelectedTransfer(transfer); setShowApproveModal(true); }}
                            className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10"
                            title="Approve"
                        >
                            <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => { setSelectedTransfer(transfer); handleReject(); }}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
                            title="Reject"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <span className="text-slate-400">-</span>
                )
            ),
        },
    ];

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Asset Allocation & Transfers</h1>
                        <p className="text-slate-400 mt-1">Manage asset assignments and transfer requests</p>
                    </div>
                    <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setShowNewModal(true)}>
                        New Transfer
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <p className="text-sm text-slate-400">Total Transfers</p>
                        <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center gap-4">
                        <ClockIcon className="w-8 h-8 text-amber-400" />
                        <div>
                            <p className="text-sm text-slate-400">Pending</p>
                            <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 flex items-center gap-4">
                        <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
                        <div>
                            <p className="text-sm text-slate-400">Approved</p>
                            <p className="text-2xl font-bold text-emerald-400">{stats.approved}</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
                        <p className="text-sm text-slate-400">Rejected</p>
                        <p className="text-2xl font-bold text-red-400 mt-1">{stats.rejected}</p>
                    </div>
                </div>

                {/* Pending Approval Alert */}
                {stats.pending > 0 && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <ClockIcon className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="font-medium text-amber-400">{stats.pending} transfer request(s) pending your approval</p>
                            <p className="text-sm text-slate-400">Review and approve or reject transfer requests</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <Card>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by asset ID..."
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
                                    { value: 'Pending', label: 'Pending' },
                                    { value: 'Approved', label: 'Approved' },
                                    { value: 'Rejected', label: 'Rejected' },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardContent padding={false}>
                        <DataTable
                            data={paginatedTransfers}
                            columns={columns}
                            keyExtractor={(item) => item.id}
                            emptyMessage="No transfer requests found."
                            pagination={{
                                currentPage,
                                totalPages,
                                pageSize,
                                totalItems: filteredTransfers.length,
                                onPageChange: setCurrentPage,
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Approve Modal */}
                <Modal
                    isOpen={showApproveModal}
                    onClose={() => setShowApproveModal(false)}
                    title="Approve Transfer"
                    size="md"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowApproveModal(false)}>Cancel</Button>
                            <Button variant="danger" onClick={handleReject}>Reject</Button>
                            <Button variant="success" onClick={handleApprove}>Approve</Button>
                        </>
                    }
                >
                    {selectedTransfer && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-800/50">
                                <p className="text-sm text-slate-400">Asset</p>
                                <p className="text-white font-medium">{getAsset(selectedTransfer.assetId)?.name}</p>
                                <p className="text-sm text-slate-400">{getAsset(selectedTransfer.assetId)?.assetId}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-sm text-slate-400">From</p>
                                    <p className="text-white font-medium">{getLocation(selectedTransfer.fromLocationId)?.name}</p>
                                    <p className="text-sm text-slate-400">{getDepartment(selectedTransfer.fromDepartmentId)?.name}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-sm text-slate-400">To</p>
                                    <p className="text-white font-medium">{getLocation(selectedTransfer.toLocationId)?.name}</p>
                                    <p className="text-sm text-slate-400">{getDepartment(selectedTransfer.toDepartmentId)?.name}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-800/50">
                                <p className="text-sm text-slate-400">Reason</p>
                                <p className="text-white">{selectedTransfer.reason}</p>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* New Transfer Modal */}
                <Modal
                    isOpen={showNewModal}
                    onClose={() => setShowNewModal(false)}
                    title="Create Transfer Request"
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
                            <Button variant="primary">Submit Request</Button>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Select
                                label="Asset"
                                options={[
                                    { value: '', label: 'Select Asset' },
                                    ...assets.map((a) => ({ value: a.id, label: `${a.assetId} - ${a.name}` })),
                                ]}
                                required
                            />
                        </div>
                        <Select
                            label="Transfer Type"
                            options={[
                                { value: '', label: 'Select Type' },
                                { value: 'Permanent', label: 'Permanent' },
                                { value: 'Temporary', label: 'Temporary' },
                            ]}
                            required
                        />
                        <Select
                            label="To Location"
                            options={[
                                { value: '', label: 'Select Location' },
                                ...locations.map((l) => ({ value: l.id, label: `${l.name} (${l.code})` })),
                            ]}
                            required
                        />
                        <Select
                            label="To Department"
                            options={[
                                { value: '', label: 'Select Department' },
                                ...departments.map((d) => ({ value: d.id, label: d.name })),
                            ]}
                            required
                        />
                        <Select
                            label="Assign To (Optional)"
                            options={[
                                { value: '', label: 'Unassigned' },
                                ...users.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` })),
                            ]}
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Reason for Transfer</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="Explain the reason for this transfer..."
                                required
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </Sidebar>
    );
}
