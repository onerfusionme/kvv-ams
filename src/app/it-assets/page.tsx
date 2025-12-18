export const dynamic = 'force-dynamic';

'use client';

import { useState } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard from '@/components/ui/StatCard';
import { SoftwareLicense } from '@/types';
import {
    PlusIcon,
    ComputerDesktopIcon,
    ServerIcon,
    WifiIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function ITAssetsPage() {
    const { assets, softwareLicenses } = useAssetStore();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'inventory' | 'licenses' | 'network'>('inventory');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const itAssets = assets.filter((a) => a.category === 'IT');

    const stats = {
        totalIT: itAssets.length,
        desktops: itAssets.filter((a) => a.subCategory === 'Desktop').length,
        laptops: itAssets.filter((a) => a.subCategory === 'Laptop').length,
        servers: itAssets.filter((a) => a.subCategory === 'Server').length,
        network: itAssets.filter((a) => a.subCategory === 'Network').length,
        totalLicenses: softwareLicenses.length,
        activeLicenses: softwareLicenses.filter((l) => l.status === 'Active').length,
        expiringSoon: softwareLicenses.filter((l) => l.status === 'Expiring-Soon').length,
        totalSeats: softwareLicenses.reduce((sum, l) => sum + l.totalSeats, 0),
        usedSeats: softwareLicenses.reduce((sum, l) => sum + l.usedSeats, 0),
    };

    const filteredITAssets = itAssets.filter((asset) =>
        !search ||
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.assetId.toLowerCase().includes(search.toLowerCase())
    );

    const filteredLicenses = softwareLicenses.filter((license) =>
        !search ||
        license.name.toLowerCase().includes(search.toLowerCase()) ||
        license.vendor.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = activeTab === 'inventory'
        ? Math.ceil(filteredITAssets.length / pageSize)
        : Math.ceil(filteredLicenses.length / pageSize);

    const paginatedITAssets = filteredITAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const paginatedLicenses = filteredLicenses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const assetColumns: Column<typeof itAssets[0]>[] = [
        {
            key: 'assetId',
            header: 'Asset ID',
            sortable: true,
            render: (asset) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${asset.subCategory === 'Desktop' ? 'bg-blue-500/20' :
                        asset.subCategory === 'Laptop' ? 'bg-purple-500/20' :
                            asset.subCategory === 'Server' ? 'bg-indigo-500/20' :
                                'bg-emerald-500/20'
                        }`}>
                        {asset.subCategory === 'Desktop' ? <ComputerDesktopIcon className="w-5 h-5 text-blue-400" /> :
                            asset.subCategory === 'Server' ? <ServerIcon className="w-5 h-5 text-indigo-400" /> :
                                asset.subCategory === 'Network' ? <WifiIcon className="w-5 h-5 text-emerald-400" /> :
                                    <ComputerDesktopIcon className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div>
                        <p className="font-medium text-white">{asset.assetId}</p>
                        <p className="text-xs text-slate-400">{asset.subCategory}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            render: (asset) => (
                <div>
                    <p className="text-white">{asset.name}</p>
                    <p className="text-xs text-slate-400">{asset.make} {asset.model}</p>
                </div>
            ),
        },
        {
            key: 'serialNumber',
            header: 'Serial Number',
            render: (asset) => <span className="text-slate-300 font-mono text-sm">{asset.serialNumber}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (asset) => (
                <Badge
                    variant={asset.status === 'Active' ? 'success' : asset.status === 'In-Repair' ? 'warning' : 'default'}
                    dot
                >
                    {asset.status}
                </Badge>
            ),
        },
        {
            key: 'specifications',
            header: 'Specs',
            render: (asset) => (
                <div className="text-xs text-slate-400">
                    {asset.specifications.processor && <p>CPU: {asset.specifications.processor}</p>}
                    {asset.specifications.ram && <p>RAM: {asset.specifications.ram}</p>}
                </div>
            ),
        },
    ];

    const licenseColumns: Column<SoftwareLicense>[] = [
        {
            key: 'name',
            header: 'Software',
            sortable: true,
            render: (license) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <DocumentTextIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <p className="font-medium text-white">{license.name}</p>
                        <p className="text-xs text-slate-400">{license.vendor}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'licenseType',
            header: 'Type',
            render: (license) => (
                <Badge variant={license.licenseType === 'Perpetual' ? 'success' : 'info'}>
                    {license.licenseType}
                </Badge>
            ),
        },
        {
            key: 'seats',
            header: 'Seats',
            render: (license) => {
                const usage = (license.usedSeats / license.totalSeats) * 100;
                return (
                    <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-300">{license.usedSeats}/{license.totalSeats}</span>
                            <span className={`font-medium ${usage > 90 ? 'text-red-400' : usage > 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {Math.round(usage)}%
                            </span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full">
                            <div
                                className={`h-full rounded-full ${usage > 90 ? 'bg-red-500' : usage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${usage}%` }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'expiryDate',
            header: 'Expiry',
            sortable: true,
            render: (license) => (
                <div>
                    <p className="text-white">{license.expiryDate || 'Never'}</p>
                    {license.expiryDate && (
                        <p className={`text-xs ${new Date(license.expiryDate) < new Date() ? 'text-red-400' :
                            new Date(license.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-amber-400' :
                                'text-slate-400'
                            }`}>
                            {new Date(license.expiryDate) < new Date() ? 'Expired' : `${Math.ceil((new Date(license.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left`}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'cost',
            header: 'Cost',
            sortable: true,
            render: (license) => <span className="text-white font-medium">₹{(license.cost / 100000).toFixed(1)}L</span>,
        },
        {
            key: 'status',
            header: 'Status',
            render: (license) => (
                <Badge
                    variant={license.status === 'Active' ? 'success' : license.status === 'Expiring-Soon' ? 'warning' : 'danger'}
                    dot
                >
                    {license.status}
                </Badge>
            ),
        },
    ];

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">IT Asset Management</h1>
                        <p className="text-slate-400 mt-1">Manage IT inventory, software licenses, and network assets</p>
                    </div>
                    <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />}>
                        Add IT Asset
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <StatCard
                        title="Total IT Assets"
                        value={stats.totalIT}
                        icon={<ComputerDesktopIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-purple-600"
                    />
                    <StatCard
                        title="Desktops"
                        value={stats.desktops}
                        icon={<ComputerDesktopIcon className="w-5 h-5 text-white" />}
                        iconBg="from-blue-500 to-cyan-600"
                    />
                    <StatCard
                        title="Laptops"
                        value={stats.laptops}
                        icon={<ComputerDesktopIcon className="w-5 h-5 text-white" />}
                        iconBg="from-purple-500 to-pink-600"
                    />
                    <StatCard
                        title="Servers"
                        value={stats.servers}
                        icon={<ServerIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-blue-600"
                    />
                    <StatCard
                        title="Network Devices"
                        value={stats.network}
                        icon={<WifiIcon className="w-5 h-5 text-white" />}
                        iconBg="from-emerald-500 to-green-600"
                    />
                    <StatCard
                        title="Software Licenses"
                        value={stats.totalLicenses}
                        icon={<DocumentTextIcon className="w-5 h-5 text-white" />}
                        iconBg="from-amber-500 to-orange-600"
                    />
                </div>

                {/* License Utilization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-white">License Utilization</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="#334155"
                                            strokeWidth="12"
                                            fill="none"
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="url(#gradient)"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={`${(stats.usedSeats / stats.totalSeats) * 440} 440`}
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#a855f7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-white">
                                            {Math.round((stats.usedSeats / stats.totalSeats) * 100)}%
                                        </span>
                                        <span className="text-sm text-slate-400">Utilized</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-white">{stats.usedSeats}</p>
                                    <p className="text-sm text-slate-400">Used Seats</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{stats.totalSeats}</p>
                                    <p className="text-sm text-slate-400">Total Seats</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-white">License Status</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="flex items-center gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                                        <span className="text-white font-medium">Active Licenses</span>
                                    </div>
                                    <span className="text-2xl font-bold text-emerald-400">{stats.activeLicenses}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <div className="flex items-center gap-3">
                                        <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />
                                        <span className="text-white font-medium">Expiring Soon</span>
                                    </div>
                                    <span className="text-2xl font-bold text-amber-400">{stats.expiringSoon}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
                                    <div className="flex items-center gap-3">
                                        <DocumentTextIcon className="w-6 h-6 text-slate-400" />
                                        <span className="text-white font-medium">Available Seats</span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-300">{stats.totalSeats - stats.usedSeats}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-white/10">
                    {[
                        { id: 'inventory', label: 'IT Inventory', icon: ComputerDesktopIcon },
                        { id: 'licenses', label: 'Software Licenses', icon: DocumentTextIcon },
                        { id: 'network', label: 'Network Assets', icon: WifiIcon },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as typeof activeTab); setCurrentPage(1); }}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-indigo-500 text-white'
                                : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <Card>
                    <CardContent>
                        <Input
                            placeholder={activeTab === 'licenses' ? "Search by software name or vendor..." : "Search by name or asset ID..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                        />
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardContent padding={false}>
                        {activeTab === 'inventory' && (
                            <DataTable
                                data={paginatedITAssets}
                                columns={assetColumns}
                                keyExtractor={(item) => item.id}
                                emptyMessage="No IT assets found."
                                pagination={{
                                    currentPage,
                                    totalPages,
                                    pageSize,
                                    totalItems: filteredITAssets.length,
                                    onPageChange: setCurrentPage,
                                }}
                            />
                        )}
                        {activeTab === 'licenses' && (
                            <DataTable
                                data={paginatedLicenses}
                                columns={licenseColumns}
                                keyExtractor={(item) => item.id}
                                emptyMessage="No licenses found."
                                pagination={{
                                    currentPage,
                                    totalPages,
                                    pageSize,
                                    totalItems: filteredLicenses.length,
                                    onPageChange: setCurrentPage,
                                }}
                            />
                        )}
                        {activeTab === 'network' && (
                            <div className="p-12 text-center">
                                <WifiIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Network Assets</h3>
                                <p className="text-slate-400">Network device management coming soon</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Sidebar>
    );
}
