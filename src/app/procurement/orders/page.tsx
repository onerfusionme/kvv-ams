'use client';

import { useState } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import StatCard from '@/components/ui/StatCard';
import {
    PlusIcon,
    DocumentTextIcon,
    TruckIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    CurrencyRupeeIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Mock Purchase Order data
const purchaseOrders = [
    {
        id: 'po-1',
        poNumber: 'PO/2024/0145',
        date: '2024-06-10',
        vendorId: 'vendor-1',
        vendorName: 'Dell Technologies',
        department: 'IT Services',
        status: 'Approved',
        items: [
            { name: 'Dell OptiPlex 7090 Desktop', qty: 25, unitPrice: 85000, total: 2125000 },
            { name: 'Dell UltraSharp 27" Monitor', qty: 25, unitPrice: 35000, total: 875000 },
        ],
        totalAmount: 3000000,
        gstAmount: 540000,
        grandTotal: 3540000,
        deliveryDate: '2024-07-10',
        remarks: 'For new IT Lab',
        createdBy: 'Amit Kumar',
        approvedBy: 'Dr. Rajesh Sharma',
    },
    {
        id: 'po-2',
        poNumber: 'PO/2024/0146',
        date: '2024-06-12',
        vendorId: 'vendor-2',
        vendorName: 'Philips Healthcare',
        department: 'Hospital',
        status: 'Pending',
        items: [
            { name: 'IntelliVue MX800 Patient Monitor', qty: 5, unitPrice: 800000, total: 4000000 },
            { name: 'Efficia DFM100 Defibrillator', qty: 2, unitPrice: 450000, total: 900000 },
        ],
        totalAmount: 4900000,
        gstAmount: 882000,
        grandTotal: 5782000,
        deliveryDate: '2024-07-25',
        remarks: 'Emergency Ward Upgrade',
        createdBy: 'Priya Singh',
        approvedBy: null,
    },
    {
        id: 'po-3',
        poNumber: 'PO/2024/0144',
        date: '2024-06-05',
        vendorId: 'vendor-3',
        vendorName: 'Godrej Interio',
        department: 'Administration',
        status: 'Received',
        items: [
            { name: 'Executive Office Desk', qty: 10, unitPrice: 45000, total: 450000 },
            { name: 'Ergonomic Office Chair', qty: 10, unitPrice: 25000, total: 250000 },
            { name: 'Filing Cabinet', qty: 10, unitPrice: 15000, total: 150000 },
        ],
        totalAmount: 850000,
        gstAmount: 153000,
        grandTotal: 1003000,
        deliveryDate: '2024-06-15',
        remarks: 'New Admin Block Furniture',
        createdBy: 'Rahul Verma',
        approvedBy: 'Dr. Anita Desai',
    },
    {
        id: 'po-4',
        poNumber: 'PO/2024/0147',
        date: '2024-06-14',
        vendorId: 'vendor-4',
        vendorName: 'Thermo Fisher Scientific',
        department: 'Research Lab',
        status: 'Draft',
        items: [
            { name: 'PCR Machine', qty: 1, unitPrice: 1500000, total: 1500000 },
            { name: 'Centrifuge High Speed', qty: 2, unitPrice: 350000, total: 700000 },
        ],
        totalAmount: 2200000,
        gstAmount: 396000,
        grandTotal: 2596000,
        deliveryDate: '2024-08-01',
        remarks: 'Research Grant Equipment',
        createdBy: 'Dr. Meera Joshi',
        approvedBy: null,
    },
];

export default function PurchaseOrdersPage() {
    const { vendors, departments } = useAssetStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedPO, setSelectedPO] = useState<typeof purchaseOrders[0] | null>(null);

    const filteredPOs = purchaseOrders.filter((po) => {
        const matchesSearch = !search ||
            po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
            po.vendorName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || po.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: purchaseOrders.length,
        draft: purchaseOrders.filter((po) => po.status === 'Draft').length,
        pending: purchaseOrders.filter((po) => po.status === 'Pending').length,
        approved: purchaseOrders.filter((po) => po.status === 'Approved').length,
        received: purchaseOrders.filter((po) => po.status === 'Received').length,
        totalValue: purchaseOrders.reduce((sum, po) => sum + po.grandTotal, 0),
        thisMonth: purchaseOrders.filter((po) => po.date.startsWith('2024-06')).length,
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)}Cr`;
        }
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        }
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Pending': return 'warning';
            case 'Received': return 'info';
            case 'Draft': return 'default';
            case 'Rejected': return 'danger';
            default: return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved': return <CheckCircleIcon className="w-5 h-5 text-emerald-400" />;
            case 'Pending': return <ClockIcon className="w-5 h-5 text-amber-400" />;
            case 'Received': return <TruckIcon className="w-5 h-5 text-blue-400" />;
            case 'Draft': return <DocumentTextIcon className="w-5 h-5 text-slate-400" />;
            default: return <ExclamationCircleIcon className="w-5 h-5 text-red-400" />;
        }
    };

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Purchase Orders</h1>
                        <p className="text-slate-400 mt-1">Create and manage purchase orders</p>
                    </div>
                    <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setShowNewModal(true)}>
                        Create PO
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <StatCard
                        title="Total POs"
                        value={stats.total}
                        icon={<DocumentTextIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-purple-600"
                    />
                    <StatCard
                        title="Draft"
                        value={stats.draft}
                        icon={<DocumentTextIcon className="w-5 h-5 text-white" />}
                        iconBg="from-slate-500 to-slate-600"
                    />
                    <StatCard
                        title="Pending"
                        value={stats.pending}
                        icon={<ClockIcon className="w-5 h-5 text-white" />}
                        iconBg="from-amber-500 to-orange-600"
                    />
                    <StatCard
                        title="Approved"
                        value={stats.approved}
                        icon={<CheckCircleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-emerald-500 to-green-600"
                    />
                    <StatCard
                        title="Received"
                        value={stats.received}
                        icon={<TruckIcon className="w-5 h-5 text-white" />}
                        iconBg="from-blue-500 to-cyan-600"
                    />
                    <StatCard
                        title="This Month"
                        value={stats.thisMonth}
                        icon={<ArrowPathIcon className="w-5 h-5 text-white" />}
                        iconBg="from-pink-500 to-rose-600"
                    />
                    <StatCard
                        title="Total Value"
                        value={formatCurrency(stats.totalValue)}
                        icon={<CurrencyRupeeIcon className="w-5 h-5 text-white" />}
                        iconBg="from-violet-500 to-purple-600"
                    />
                </div>

                {/* Filters */}
                <Card>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by PO number or vendor..."
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
                                    { value: 'Draft', label: 'Draft' },
                                    { value: 'Pending', label: 'Pending Approval' },
                                    { value: 'Approved', label: 'Approved' },
                                    { value: 'Received', label: 'Received' },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Purchase Orders List */}
                <Card>
                    <CardContent padding={false}>
                        <div className="divide-y divide-white/5">
                            {filteredPOs.map((po) => (
                                <div
                                    key={po.id}
                                    className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
                                    onClick={() => setSelectedPO(po)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${po.status === 'Approved' ? 'bg-emerald-500/20' :
                                                po.status === 'Pending' ? 'bg-amber-500/20' :
                                                    po.status === 'Received' ? 'bg-blue-500/20' :
                                                        'bg-slate-500/20'
                                            }`}>
                                            {getStatusIcon(po.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold text-white">{po.poNumber}</p>
                                                <Badge variant={getStatusVariant(po.status)}>{po.status}</Badge>
                                            </div>
                                            <p className="text-sm text-slate-400 flex items-center gap-2">
                                                <TruckIcon className="w-4 h-4" />
                                                {po.vendorName}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                <span>{po.department}</span>
                                                <span>•</span>
                                                <span>Date: {po.date}</span>
                                                <span>•</span>
                                                <span>{po.items.length} items</span>
                                                <span>•</span>
                                                <span>Delivery: {po.deliveryDate}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white">{formatCurrency(po.grandTotal)}</p>
                                            <p className="text-xs text-slate-400">incl. GST</p>
                                        </div>
                                        <Button variant="ghost" size="sm" icon={<EyeIcon className="w-4 h-4" />}>
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* PO Detail Modal */}
                <Modal
                    isOpen={!!selectedPO}
                    onClose={() => setSelectedPO(null)}
                    title="Purchase Order Details"
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setSelectedPO(null)}>Close</Button>
                            {selectedPO?.status === 'Pending' && (
                                <>
                                    <Button variant="danger">Reject</Button>
                                    <Button variant="success">Approve</Button>
                                </>
                            )}
                            {selectedPO?.status === 'Approved' && (
                                <Button variant="primary">Generate GRN</Button>
                            )}
                        </>
                    }
                >
                    {selectedPO && (
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                                <div>
                                    <p className="text-xl font-bold text-white">{selectedPO.poNumber}</p>
                                    <p className="text-slate-400">Date: {selectedPO.date}</p>
                                </div>
                                <Badge variant={getStatusVariant(selectedPO.status)} size="lg">
                                    {selectedPO.status}
                                </Badge>
                            </div>

                            {/* Vendor & Department */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Vendor</p>
                                    <p className="text-white font-medium mt-1">{selectedPO.vendorName}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Department</p>
                                    <p className="text-white font-medium mt-1">{selectedPO.department}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="rounded-xl border border-white/10 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-800/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Item</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400">Qty</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">Unit Price</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {selectedPO.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 text-sm text-white">{item.name}</td>
                                                <td className="px-4 py-3 text-sm text-center text-slate-300">{item.qty}</td>
                                                <td className="px-4 py-3 text-sm text-right text-slate-300">{formatCurrency(item.unitPrice)}</td>
                                                <td className="px-4 py-3 text-sm text-right text-white font-medium">{formatCurrency(item.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-800/50">
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2 text-sm text-right text-slate-400">Subtotal</td>
                                            <td className="px-4 py-2 text-sm text-right text-white">{formatCurrency(selectedPO.totalAmount)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2 text-sm text-right text-slate-400">GST (18%)</td>
                                            <td className="px-4 py-2 text-sm text-right text-white">{formatCurrency(selectedPO.gstAmount)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2 text-sm text-right font-semibold text-white">Grand Total</td>
                                            <td className="px-4 py-2 text-lg text-right font-bold text-emerald-400">{formatCurrency(selectedPO.grandTotal)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Additional Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Expected Delivery</p>
                                    <p className="text-white font-medium mt-1">{selectedPO.deliveryDate}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Created By</p>
                                    <p className="text-white font-medium mt-1">{selectedPO.createdBy}</p>
                                </div>
                            </div>

                            {selectedPO.remarks && (
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Remarks</p>
                                    <p className="text-white mt-1">{selectedPO.remarks}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>

                {/* Create PO Modal */}
                <Modal
                    isOpen={showNewModal}
                    onClose={() => setShowNewModal(false)}
                    title="Create Purchase Order"
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
                            <Button variant="outline">Save as Draft</Button>
                            <Button variant="primary">Submit for Approval</Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Vendor"
                                options={[
                                    { value: '', label: 'Select Vendor' },
                                    ...vendors.map((v) => ({ value: v.id, label: v.name })),
                                ]}
                                required
                            />
                            <Select
                                label="Department"
                                options={[
                                    { value: '', label: 'Select Department' },
                                    ...departments.map((d) => ({ value: d.id, label: d.name })),
                                ]}
                                required
                            />
                            <Input label="Expected Delivery Date" type="date" required />
                            <Select
                                label="Payment Terms"
                                options={[
                                    { value: '', label: 'Select Terms' },
                                    { value: '30', label: 'Net 30 Days' },
                                    { value: '60', label: 'Net 60 Days' },
                                    { value: '90', label: 'Net 90 Days' },
                                    { value: 'advance', label: '100% Advance' },
                                ]}
                            />
                        </div>

                        <div className="p-4 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-medium text-white">Line Items</p>
                                <Button variant="ghost" size="sm" icon={<PlusIcon className="w-4 h-4" />}>
                                    Add Item
                                </Button>
                            </div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-5">
                                        <Input placeholder="Item description" size="sm" />
                                    </div>
                                    <div className="col-span-2">
                                        <Input placeholder="Qty" type="number" size="sm" />
                                    </div>
                                    <div className="col-span-2">
                                        <Input placeholder="Unit Price" type="number" size="sm" />
                                    </div>
                                    <div className="col-span-2">
                                        <Input placeholder="Total" disabled size="sm" />
                                    </div>
                                    <div className="col-span-1 flex items-center justify-center">
                                        <button className="p-1 text-red-400 hover:bg-red-500/10 rounded">×</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Remarks</label>
                            <textarea
                                rows={2}
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
