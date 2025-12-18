export const dynamic = 'force-dynamic';

'use client';

import { useState, useMemo } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard from '@/components/ui/StatCard';
import { Contract } from '@/types';
import {
    PlusIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function ContractsPage() {
    const { contracts, vendors, assets } = useAssetStore();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Stats
    const stats = {
        total: contracts.length,
        active: contracts.filter((c) => c.status === 'Active').length,
        expiringSoon: contracts.filter((c) => {
            const daysToExpiry = Math.ceil((new Date(c.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return daysToExpiry > 0 && daysToExpiry <= 60 && c.status === 'Active';
        }).length,
        expired: contracts.filter((c) => c.status === 'Expired').length,
        totalValue: contracts.filter((c) => c.status === 'Active').reduce((sum, c) => sum + c.value, 0),
        amcCount: contracts.filter((c) => c.type === 'AMC').length,
        cmcCount: contracts.filter((c) => c.type === 'CMC').length,
    };

    // Filter
    const filteredContracts = useMemo(() => {
        return contracts.filter((contract) => {
            const vendor = vendors.find((v) => v.id === contract.vendorId);
            return (
                !search ||
                contract.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
                vendor?.name.toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [contracts, vendors, search]);

    const totalPages = Math.ceil(filteredContracts.length / pageSize);
    const paginatedContracts = filteredContracts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getVendorName = (id: string) => vendors.find((v) => v.id === id)?.name || '-';

    const getDaysToExpiry = (endDate: string) => {
        const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days;
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        }
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const columns: Column<Contract>[] = [
        {
            key: 'contractNumber',
            header: 'Contract #',
            sortable: true,
            render: (contract) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${contract.type === 'AMC' ? 'bg-indigo-500/20' :
                        contract.type === 'CMC' ? 'bg-purple-500/20' :
                            'bg-emerald-500/20'
                        }`}>
                        <DocumentTextIcon className={`w-5 h-5 ${contract.type === 'AMC' ? 'text-indigo-400' :
                            contract.type === 'CMC' ? 'text-purple-400' :
                                'text-emerald-400'
                            }`} />
                    </div>
                    <div>
                        <p className="font-medium text-white">{contract.contractNumber}</p>
                        <Badge variant={contract.type === 'AMC' ? 'info' : contract.type === 'CMC' ? 'purple' : 'success'} size="sm">
                            {contract.type}
                        </Badge>
                    </div>
                </div>
            ),
        },
        {
            key: 'vendorId',
            header: 'Vendor',
            sortable: true,
            render: (contract) => <span className="text-white">{getVendorName(contract.vendorId)}</span>,
        },
        {
            key: 'assetIds',
            header: 'Assets',
            render: (contract) => (
                <span className="text-slate-300">{contract.assetIds.length} asset(s)</span>
            ),
        },
        {
            key: 'startDate',
            header: 'Duration',
            render: (contract) => (
                <div>
                    <p className="text-white">{contract.startDate}</p>
                    <p className="text-xs text-slate-400">to {contract.endDate}</p>
                </div>
            ),
        },
        {
            key: 'value',
            header: 'Value',
            sortable: true,
            render: (contract) => <span className="text-white font-medium">{formatCurrency(contract.value)}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (contract) => {
                const daysToExpiry = getDaysToExpiry(contract.endDate);
                return (
                    <div>
                        <Badge
                            variant={
                                contract.status === 'Active' && daysToExpiry > 60 ? 'success' :
                                    contract.status === 'Active' && daysToExpiry <= 60 ? 'warning' :
                                        contract.status === 'Expired' ? 'danger' : 'info'
                            }
                            dot
                        >
                            {contract.status}
                        </Badge>
                        {contract.status === 'Active' && daysToExpiry <= 60 && daysToExpiry > 0 && (
                            <p className="text-xs text-amber-400 mt-1">{daysToExpiry} days left</p>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Contracts & AMC</h1>
                        <p className="text-slate-400 mt-1">Manage AMC, CMC, and warranty contracts</p>
                    </div>
                    <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />}>
                        Add Contract
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <StatCard
                        title="Total Contracts"
                        value={stats.total}
                        icon={<DocumentTextIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-purple-600"
                    />
                    <StatCard
                        title="Active"
                        value={stats.active}
                        icon={<CheckCircleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-emerald-500 to-green-600"
                    />
                    <StatCard
                        title="Expiring Soon"
                        value={stats.expiringSoon}
                        icon={<ExclamationTriangleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-amber-500 to-orange-600"
                    />
                    <StatCard
                        title="Expired"
                        value={stats.expired}
                        icon={<CalendarDaysIcon className="w-5 h-5 text-white" />}
                        iconBg="from-red-500 to-rose-600"
                    />
                    <StatCard
                        title="AMC"
                        value={stats.amcCount}
                        icon={<ShieldCheckIcon className="w-5 h-5 text-white" />}
                        iconBg="from-blue-500 to-cyan-600"
                    />
                    <StatCard
                        title="CMC"
                        value={stats.cmcCount}
                        icon={<DocumentTextIcon className="w-5 h-5 text-white" />}
                        iconBg="from-purple-500 to-pink-600"
                    />
                    <StatCard
                        title="Total Value"
                        value={formatCurrency(stats.totalValue)}
                        icon={<span className="text-white text-lg">₹</span>}
                        iconBg="from-violet-500 to-purple-600"
                    />
                </div>

                {/* Expiring Soon Alerts */}
                {stats.expiringSoon > 0 && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="font-medium text-amber-400">{stats.expiringSoon} contract(s) expiring in the next 60 days</p>
                            <p className="text-sm text-slate-400">Review and renew contracts to avoid service disruptions</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                            View All
                        </Button>
                    </div>
                )}

                {/* Search */}
                <Card>
                    <CardContent>
                        <Input
                            placeholder="Search by contract number or vendor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                        />
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardContent padding={false}>
                        <DataTable
                            data={paginatedContracts}
                            columns={columns}
                            keyExtractor={(item) => item.id}
                            emptyMessage="No contracts found."
                            pagination={{
                                currentPage,
                                totalPages,
                                pageSize,
                                totalItems: filteredContracts.length,
                                onPageChange: setCurrentPage,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </Sidebar>
    );
}
