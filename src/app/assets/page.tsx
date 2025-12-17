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
import { Asset } from '@/types';
import {
    PlusIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    MagnifyingGlassIcon,
    QrCodeIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CubeIcon,
    DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';
import QRCode from 'react-qr-code';

export default function AssetsPage() {
    const router = useRouter();
    const { assets, locations, departments, users, deleteAsset } = useAssetStore();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<{
        success: boolean;
        message: string;
        errors?: { row: number; message: string }[];
    } | null>(null);
    const pageSize = 10;

    // Export functionality
    const handleExport = async (format: 'pdf' | 'excel') => {
        setIsExporting(true);
        setShowExportMenu(false);
        try {
            const response = await fetch(`/api/reports?type=assets&format=${format}`);
            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `assets_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    // Import functionality
    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'assets');

            const response = await fetch('/api/imports', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            setImportResult(result);
        } catch (error) {
            console.error('Import error:', error);
            setImportResult({
                success: false,
                message: 'Failed to import. Please try again.',
            });
        } finally {
            setIsImporting(false);
            e.target.value = ''; // Reset file input
        }
    };

    const downloadTemplate = () => {
        window.location.href = '/api/imports?type=assets';
    };

    // Filter assets
    const filteredAssets = useMemo(() => {
        return assets.filter((asset) => {
            const matchesSearch =
                !search ||
                asset.name.toLowerCase().includes(search.toLowerCase()) ||
                asset.assetId.toLowerCase().includes(search.toLowerCase()) ||
                asset.serialNumber.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = !categoryFilter || asset.category === categoryFilter;
            const matchesStatus = !statusFilter || asset.status === statusFilter;
            const matchesDepartment = !departmentFilter || asset.departmentId === departmentFilter;
            return matchesSearch && matchesCategory && matchesStatus && matchesDepartment;
        });
    }, [assets, search, categoryFilter, statusFilter, departmentFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredAssets.length / pageSize);
    const paginatedAssets = filteredAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getDepartmentName = (id: string) => departments.find((d) => d.id === id)?.name || '-';
    const getLocationName = (id: string) => locations.find((l) => l.id === id)?.name || '-';
    const getUserName = (id: string | null) => {
        if (!id) return '-';
        const user = users.find((u) => u.id === id);
        return user ? `${user.firstName} ${user.lastName}` : '-';
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Active': return 'success';
            case 'In-Repair': return 'warning';
            case 'Idle': return 'default';
            case 'Under-Maintenance': return 'info';
            case 'Condemned': return 'danger';
            case 'Disposed': return 'default';
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

    const columns: Column<Asset>[] = [
        {
            key: 'assetId',
            header: 'Asset ID',
            sortable: true,
            render: (asset) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                        <CubeIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <p className="font-medium text-white">{asset.assetId}</p>
                        <p className="text-xs text-slate-400">{asset.tagType}: {asset.tagId}</p>
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
                    <p className="font-medium text-white">{asset.name}</p>
                    <p className="text-xs text-slate-400">{asset.make} {asset.model}</p>
                </div>
            ),
        },
        {
            key: 'category',
            header: 'Category',
            sortable: true,
            render: (asset) => (
                <Badge variant={
                    asset.category === 'IT' ? 'info' :
                        asset.category === 'Hospital' ? 'danger' :
                            asset.category === 'Academic' ? 'purple' :
                                'default'
                }>
                    {asset.category}
                </Badge>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (asset) => (
                <Badge variant={getStatusVariant(asset.status)} dot>
                    {asset.status}
                </Badge>
            ),
        },
        {
            key: 'departmentId',
            header: 'Department',
            sortable: true,
            render: (asset) => <span className="text-slate-300">{getDepartmentName(asset.departmentId)}</span>,
        },
        {
            key: 'assignedToId',
            header: 'Assigned To',
            render: (asset) => <span className="text-slate-300">{getUserName(asset.assignedToId)}</span>,
        },
        {
            key: 'currentValue',
            header: 'Value',
            sortable: true,
            render: (asset) => (
                <div>
                    <p className="font-medium text-white">{formatCurrency(asset.currentValue)}</p>
                    <p className="text-xs text-slate-400">Cost: {formatCurrency(asset.purchasePrice)}</p>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (asset) => (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => { setSelectedAsset(asset); setShowQRModal(true); }}
                        className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                        title="Show QR Code"
                    >
                        <QrCodeIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => router.push(`/assets/${asset.id}`)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                        title="View Details"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => router.push(`/assets/${asset.id}/edit`)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                        title="Edit"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => { setSelectedAsset(asset); setShowDeleteModal(true); }}
                        className="p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                        title="Delete"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    const handleDeleteAsset = () => {
        if (selectedAsset) {
            deleteAsset(selectedAsset.id);
            setShowDeleteModal(false);
            setSelectedAsset(null);
        }
    };

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Asset Inventory</h1>
                        <p className="text-slate-400 mt-1">Manage and track all organizational assets</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Button
                                variant="secondary"
                                icon={<ArrowDownTrayIcon className="w-4 h-4" />}
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                disabled={isExporting}
                            >
                                {isExporting ? 'Exporting...' : 'Export'}
                            </Button>
                            {showExportMenu && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-white/10 shadow-xl z-50">
                                    <button
                                        onClick={() => handleExport('pdf')}
                                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 rounded-t-xl flex items-center gap-2"
                                    >
                                        <span className="text-red-400">📄</span> Export as PDF
                                    </button>
                                    <button
                                        onClick={() => handleExport('excel')}
                                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 rounded-b-xl flex items-center gap-2"
                                    >
                                        <span className="text-green-400">📊</span> Export as Excel
                                    </button>
                                </div>
                            )}
                        </div>
                        <Button
                            variant="secondary"
                            icon={<ArrowUpTrayIcon className="w-4 h-4" />}
                            onClick={() => setShowImportModal(true)}
                        >
                            Import
                        </Button>
                        <Button
                            variant="primary"
                            icon={<PlusIcon className="w-4 h-4" />}
                            onClick={() => router.push('/assets/new')}
                        >
                            Add Asset
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <p className="text-sm text-slate-400">Total Assets</p>
                        <p className="text-2xl font-bold text-white mt-1">{assets.length}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                        <p className="text-sm text-slate-400">Active</p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">
                            {assets.filter((a) => a.status === 'Active').length}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                        <p className="text-sm text-slate-400">Under Maintenance</p>
                        <p className="text-2xl font-bold text-amber-400 mt-1">
                            {assets.filter((a) => a.status === 'Under-Maintenance' || a.status === 'In-Repair').length}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20">
                        <p className="text-sm text-slate-400">Condemned</p>
                        <p className="text-2xl font-bold text-rose-400 mt-1">
                            {assets.filter((a) => a.status === 'Condemned').length}
                        </p>
                    </div>
                </div>

                {/* Filters & Search */}
                <Card>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by Asset ID, Name, or Serial Number..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant={showFilters ? 'outline' : 'secondary'}
                                    icon={<FunnelIcon className="w-4 h-4" />}
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    Filters
                                </Button>
                            </div>
                        </div>

                        {/* Expanded Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                                <Select
                                    label="Category"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    options={[
                                        { value: '', label: 'All Categories' },
                                        { value: 'IT', label: 'IT Assets' },
                                        { value: 'Academic', label: 'Academic' },
                                        { value: 'Hospital', label: 'Hospital/Medical' },
                                        { value: 'Infrastructure', label: 'Infrastructure' },
                                    ]}
                                />
                                <Select
                                    label="Status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    options={[
                                        { value: '', label: 'All Statuses' },
                                        { value: 'Active', label: 'Active' },
                                        { value: 'In-Repair', label: 'In-Repair' },
                                        { value: 'Idle', label: 'Idle' },
                                        { value: 'Under-Maintenance', label: 'Under Maintenance' },
                                        { value: 'Condemned', label: 'Condemned' },
                                        { value: 'Disposed', label: 'Disposed' },
                                    ]}
                                />
                                <Select
                                    label="Department"
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                    options={[
                                        { value: '', label: 'All Departments' },
                                        ...departments.map((d) => ({ value: d.id, label: d.name })),
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
                            data={paginatedAssets}
                            columns={columns}
                            keyExtractor={(item) => item.id}
                            onRowClick={(asset) => router.push(`/assets/${asset.id}`)}
                            selectable
                            selectedIds={selectedAssets}
                            onSelectionChange={setSelectedAssets}
                            emptyMessage="No assets found. Try adjusting your filters."
                            pagination={{
                                currentPage,
                                totalPages,
                                pageSize,
                                totalItems: filteredAssets.length,
                                onPageChange: setCurrentPage,
                            }}
                        />
                    </CardContent>
                </Card>

                {/* QR Code Modal */}
                <Modal
                    isOpen={showQRModal}
                    onClose={() => setShowQRModal(false)}
                    title="Asset QR Code"
                    size="sm"
                >
                    {selectedAsset && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-white rounded-xl">
                                <QRCode value={selectedAsset.assetId} size={200} />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-white">{selectedAsset.assetId}</p>
                                <p className="text-sm text-slate-400">{selectedAsset.name}</p>
                            </div>
                            <Button variant="secondary" className="w-full">
                                Download QR Code
                            </Button>
                        </div>
                    )}
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Asset"
                    size="sm"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDeleteAsset}>
                                Delete Asset
                            </Button>
                        </>
                    }
                >
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                            <TrashIcon className="w-8 h-8 text-red-400" />
                        </div>
                        <p className="text-white mb-2">
                            Are you sure you want to delete this asset?
                        </p>
                        {selectedAsset && (
                            <p className="text-sm text-slate-400">
                                {selectedAsset.assetId} - {selectedAsset.name}
                            </p>
                        )}
                        <p className="text-sm text-red-400 mt-4">
                            This action cannot be undone.
                        </p>
                    </div>
                </Modal>

                {/* Import Modal */}
                <Modal
                    isOpen={showImportModal}
                    onClose={() => { setShowImportModal(false); setImportResult(null); }}
                    title="Import Assets"
                    size="md"
                >
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <p className="text-sm text-blue-300">
                                Upload a CSV or Excel file to bulk import assets.
                                Make sure your file follows the correct format.
                            </p>
                            <button
                                onClick={downloadTemplate}
                                className="text-sm text-blue-400 hover:text-blue-300 underline mt-2"
                            >
                                Download template file
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors">
                            <DocumentArrowUpIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                            <label className="cursor-pointer">
                                <span className="text-white font-medium">
                                    {isImporting ? 'Importing...' : 'Click to upload file'}
                                </span>
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleImport}
                                    disabled={isImporting}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-sm text-slate-400 mt-2">
                                Supports CSV, XLS, XLSX
                            </p>
                        </div>

                        {importResult && (
                            <div className={`p-4 rounded-xl border ${importResult.success
                                    ? 'bg-emerald-500/10 border-emerald-500/20'
                                    : 'bg-amber-500/10 border-amber-500/20'
                                }`}>
                                <p className={`font-medium ${importResult.success ? 'text-emerald-400' : 'text-amber-400'
                                    }`}>
                                    {importResult.message}
                                </p>
                                {importResult.errors && importResult.errors.length > 0 && (
                                    <div className="mt-2 max-h-32 overflow-y-auto">
                                        {importResult.errors.slice(0, 5).map((error, i) => (
                                            <p key={i} className="text-sm text-slate-400">
                                                Row {error.row}: {error.message}
                                            </p>
                                        ))}
                                        {importResult.errors.length > 5 && (
                                            <p className="text-sm text-slate-500">
                                                ...and {importResult.errors.length - 5} more errors
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </Sidebar>
    );
}
