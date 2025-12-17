'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
    ArrowLeftIcon,
    PencilIcon,
    QrCodeIcon,
    DocumentDuplicateIcon,
    ArrowsRightLeftIcon,
    WrenchScrewdriverIcon,
    TrashIcon,
    MapPinIcon,
    UserIcon,
    BuildingOfficeIcon,
    CalendarDaysIcon,
    CurrencyRupeeIcon,
    TagIcon,
    ClockIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import QRCode from 'react-qr-code';

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { assets, departments, locations, users, vendors, maintenanceRecords, assetTransfers } = useAssetStore();

    const asset = assets.find((a) => a.id === id);

    if (!asset) {
        return (
            <Sidebar>
                <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-xl font-semibold text-white mb-2">Asset Not Found</h2>
                    <p className="text-slate-400 mb-4">The asset you&apos;re looking for doesn&apos;t exist.</p>
                    <Button onClick={() => router.push('/assets')}>Back to Assets</Button>
                </div>
            </Sidebar>
        );
    }

    const department = departments.find((d) => d.id === asset.departmentId);
    const location = locations.find((l) => l.id === asset.locationId);
    const assignedUser = asset.assignedToId ? users.find((u) => u.id === asset.assignedToId) : null;
    const vendor = vendors.find((v) => v.id === asset.vendorId);
    const assetMaintenance = maintenanceRecords.filter((m) => m.assetId === asset.id);
    const assetTransfersHistory = assetTransfers.filter((t) => t.assetId === asset.id);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Active': return 'success';
            case 'In-Repair': return 'warning';
            case 'Idle': return 'default';
            case 'Under-Maintenance': return 'info';
            case 'Condemned': return 'danger';
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

    const daysToWarrantyExpiry = () => {
        const today = new Date();
        const warrantyEnd = new Date(asset.warrantyEndDate);
        const diff = Math.ceil((warrantyEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const warrantyDays = daysToWarrantyExpiry();

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/assets')}
                            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-white">{asset.name}</h1>
                                <Badge variant={getStatusVariant(asset.status)} dot>
                                    {asset.status}
                                </Badge>
                            </div>
                            <p className="text-slate-400 mt-1">{asset.assetId} • {asset.make} {asset.model}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" icon={<QrCodeIcon className="w-4 h-4" />}>
                            QR Code
                        </Button>
                        <Button variant="secondary" icon={<ArrowsRightLeftIcon className="w-4 h-4" />}>
                            Transfer
                        </Button>
                        <Button variant="secondary" icon={<WrenchScrewdriverIcon className="w-4 h-4" />}>
                            Maintenance
                        </Button>
                        <Button variant="primary" icon={<PencilIcon className="w-4 h-4" />}>
                            Edit Asset
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overview Card */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Asset Overview</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                            <TagIcon className="w-4 h-4" /> Category
                                        </p>
                                        <p className="mt-1 font-medium text-white">{asset.category}</p>
                                        <p className="text-sm text-slate-400">{asset.subCategory}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                            <MapPinIcon className="w-4 h-4" /> Location
                                        </p>
                                        <p className="mt-1 font-medium text-white">{location?.name || '-'}</p>
                                        <p className="text-sm text-slate-400">{location?.code || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                            <BuildingOfficeIcon className="w-4 h-4" /> Department
                                        </p>
                                        <p className="mt-1 font-medium text-white">{department?.name || '-'}</p>
                                        <p className="text-sm text-slate-400">{department?.code || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                            <UserIcon className="w-4 h-4" /> Assigned To
                                        </p>
                                        <p className="mt-1 font-medium text-white">
                                            {assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'Unassigned'}
                                        </p>
                                        {assignedUser && <p className="text-sm text-slate-400">{assignedUser.designation}</p>}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4" /> Condition
                                        </p>
                                        <p className="mt-1 font-medium text-white">{asset.condition}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                            <DocumentDuplicateIcon className="w-4 h-4" /> Tag
                                        </p>
                                        <p className="mt-1 font-medium text-white">{asset.tagType}</p>
                                        <p className="text-sm text-slate-400">{asset.tagId}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specifications */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Specifications</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 rounded-lg bg-slate-800/50">
                                        <p className="text-xs text-slate-400">Make</p>
                                        <p className="mt-1 font-medium text-white">{asset.make}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-800/50">
                                        <p className="text-xs text-slate-400">Model</p>
                                        <p className="mt-1 font-medium text-white">{asset.model}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-800/50">
                                        <p className="text-xs text-slate-400">Serial Number</p>
                                        <p className="mt-1 font-medium text-white">{asset.serialNumber}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-800/50">
                                        <p className="text-xs text-slate-400">Vendor</p>
                                        <p className="mt-1 font-medium text-white">{vendor?.name || '-'}</p>
                                    </div>
                                    {Object.entries(asset.specifications).map(([key, value]) => (
                                        <div key={key} className="p-3 rounded-lg bg-slate-800/50">
                                            <p className="text-xs text-slate-400 capitalize">{key}</p>
                                            <p className="mt-1 font-medium text-white">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financial Info */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Financial Information</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                                        <p className="text-sm text-slate-400">Purchase Price</p>
                                        <p className="mt-1 text-xl font-bold text-white">{formatCurrency(asset.purchasePrice)}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                                        <p className="text-sm text-slate-400">Current Value</p>
                                        <p className="mt-1 text-xl font-bold text-emerald-400">{formatCurrency(asset.currentValue)}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                                        <p className="text-sm text-slate-400">Depreciation</p>
                                        <p className="mt-1 text-xl font-bold text-amber-400">{formatCurrency(asset.purchasePrice - asset.currentValue)}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-500/10 to-slate-600/10 border border-slate-500/20">
                                        <p className="text-sm text-slate-400">Salvage Value</p>
                                        <p className="mt-1 text-xl font-bold text-slate-300">{formatCurrency(asset.salvageValue)}</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 rounded-lg bg-slate-800/50">
                                        <p className="text-xs text-slate-400">Purchase Date</p>
                                        <p className="mt-1 font-medium text-white">{asset.purchaseDate}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-800/50">
                                        <p className="text-xs text-slate-400">Depreciation Method</p>
                                        <p className="mt-1 font-medium text-white">{asset.depreciationMethod}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-800/50">
                                        <p className="text-xs text-slate-400">Depreciation Rate</p>
                                        <p className="mt-1 font-medium text-white">{asset.depreciationRate}%</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-800/50">
                                        <p className="text-xs text-slate-400">Useful Life</p>
                                        <p className="mt-1 font-medium text-white">{asset.usefulLife} years</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Maintenance History */}
                        <Card>
                            <CardHeader action={<Button variant="ghost" size="sm">View All</Button>}>
                                <h3 className="text-lg font-semibold text-white">Maintenance History</h3>
                            </CardHeader>
                            <CardContent padding={false}>
                                {assetMaintenance.length === 0 ? (
                                    <div className="p-6 text-center text-slate-400">
                                        No maintenance records found for this asset.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {assetMaintenance.map((record) => (
                                            <div key={record.id} className="p-4 hover:bg-white/5 transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-white">{record.ticketNumber}</span>
                                                    <Badge
                                                        variant={
                                                            record.status === 'Completed' ? 'success' :
                                                                record.status === 'In-Progress' ? 'warning' :
                                                                    record.status === 'Scheduled' ? 'info' : 'default'
                                                        }
                                                    >
                                                        {record.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-400">{record.description}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                    <span>{record.type}</span>
                                                    <span>•</span>
                                                    <span>{record.scheduledDate}</span>
                                                    <span>•</span>
                                                    <span>{formatCurrency(record.cost)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* QR Code */}
                        <Card>
                            <CardContent>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-white rounded-xl">
                                        <QRCode value={asset.assetId} size={150} />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-white">{asset.assetId}</p>
                                        <p className="text-sm text-slate-400">{asset.tagType} Code</p>
                                    </div>
                                    <Button variant="secondary" size="sm" className="w-full">
                                        Download QR
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Warranty Status */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <ShieldCheckIcon className="w-5 h-5 text-indigo-400" />
                                    Warranty
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <div className={`p-4 rounded-xl border ${warrantyDays <= 0 ? 'bg-red-500/10 border-red-500/20' :
                                        warrantyDays <= 90 ? 'bg-amber-500/10 border-amber-500/20' :
                                            'bg-emerald-500/10 border-emerald-500/20'
                                    }`}>
                                    <p className={`text-2xl font-bold ${warrantyDays <= 0 ? 'text-red-400' :
                                            warrantyDays <= 90 ? 'text-amber-400' :
                                                'text-emerald-400'
                                        }`}>
                                        {warrantyDays <= 0 ? 'Expired' : `${warrantyDays} days`}
                                    </p>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {warrantyDays <= 0 ? 'Warranty has expired' : 'Until warranty expiry'}
                                    </p>
                                </div>
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Start Date</span>
                                        <span className="text-white">{asset.warrantyStartDate}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">End Date</span>
                                        <span className="text-white">{asset.warrantyEndDate}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Timeline</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Asset Created</p>
                                            <p className="text-xs text-slate-400">{asset.createdAt.split('T')[0]}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Last Updated</p>
                                            <p className="text-xs text-slate-400">{asset.updatedAt.split('T')[0]}</p>
                                        </div>
                                    </div>
                                    {assetTransfersHistory.length > 0 && (
                                        <div className="flex gap-3">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                                            <div>
                                                <p className="text-sm font-medium text-white">Last Transfer</p>
                                                <p className="text-xs text-slate-400">{assetTransfersHistory[0]?.requestedDate}</p>
                                            </div>
                                        </div>
                                    )}
                                    {assetMaintenance.length > 0 && (
                                        <div className="flex gap-3">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-amber-400" />
                                            <div>
                                                <p className="text-sm font-medium text-white">Last Maintenance</p>
                                                <p className="text-xs text-slate-400">{assetMaintenance[0]?.scheduledDate}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Button variant="secondary" className="w-full justify-start" icon={<ArrowsRightLeftIcon className="w-4 h-4" />}>
                                        Request Transfer
                                    </Button>
                                    <Button variant="secondary" className="w-full justify-start" icon={<WrenchScrewdriverIcon className="w-4 h-4" />}>
                                        Create Maintenance Ticket
                                    </Button>
                                    <Button variant="secondary" className="w-full justify-start" icon={<DocumentDuplicateIcon className="w-4 h-4" />}>
                                        Duplicate Asset
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300" icon={<TrashIcon className="w-4 h-4" />}>
                                        Condemn Asset
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
