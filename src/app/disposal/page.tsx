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
    TrashIcon,
    ArchiveBoxXMarkIcon,
    ExclamationTriangleIcon,
    DocumentCheckIcon,
    CurrencyRupeeIcon,
    ClockIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Mock disposal data
const disposalRecords = [
    {
        id: 'disp-1',
        assetId: 'IT-2024-001',
        assetName: 'Dell OptiPlex 7090',
        category: 'IT',
        disposalType: 'Auction',
        reason: 'Beyond economical repair',
        requestDate: '2024-06-01',
        approvalDate: '2024-06-05',
        disposalDate: '2024-06-15',
        status: 'Completed',
        originalValue: 85000,
        bookValue: 15000,
        disposalValue: 8000,
        approvedBy: 'Dr. Rajesh Kumar',
        condemnationNumber: 'COND/2024/001',
    },
    {
        id: 'disp-2',
        assetId: 'LAB-2024-003',
        assetName: 'Spectrophotometer',
        category: 'Lab Equipment',
        disposalType: 'Scrap',
        reason: 'Obsolete technology',
        requestDate: '2024-05-20',
        approvalDate: '2024-05-25',
        disposalDate: null,
        status: 'Pending-Disposal',
        originalValue: 250000,
        bookValue: 45000,
        disposalValue: 12000,
        approvedBy: 'Prof. Anita Sharma',
        condemnationNumber: 'COND/2024/002',
    },
    {
        id: 'disp-3',
        assetId: 'FURN-2024-010',
        assetName: 'Executive Office Chair',
        category: 'Furniture',
        disposalType: 'Donation',
        reason: 'Damaged beyond repair',
        requestDate: '2024-06-10',
        approvalDate: null,
        disposalDate: null,
        status: 'Pending-Approval',
        originalValue: 25000,
        bookValue: 5000,
        disposalValue: 0,
        approvedBy: null,
        condemnationNumber: null,
    },
];

export default function DisposalPage() {
    const { assets } = useAssetStore();
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<typeof disposalRecords[0] | null>(null);

    const stats = {
        total: disposalRecords.length,
        pendingApproval: disposalRecords.filter((r) => r.status === 'Pending-Approval').length,
        pendingDisposal: disposalRecords.filter((r) => r.status === 'Pending-Disposal').length,
        completed: disposalRecords.filter((r) => r.status === 'Completed').length,
        totalRecovered: disposalRecords.filter((r) => r.status === 'Completed').reduce((sum, r) => sum + r.disposalValue, 0),
        totalWriteOff: disposalRecords.filter((r) => r.status === 'Completed').reduce((sum, r) => sum + (r.bookValue - r.disposalValue), 0),
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        }
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Pending-Approval': return 'warning';
            case 'Pending-Disposal': return 'info';
            case 'Rejected': return 'danger';
            default: return 'default';
        }
    };

    const getDisposalTypeIcon = (type: string) => {
        switch (type) {
            case 'Auction': return '🔨';
            case 'Scrap': return '♻️';
            case 'Donation': return '🎁';
            case 'Trade-In': return '🔄';
            case 'Write-Off': return '📝';
            default: return '📦';
        }
    };

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Asset Disposal & Condemnation</h1>
                        <p className="text-slate-400 mt-1">Manage asset write-offs, condemnation, and disposal</p>
                    </div>
                    <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setShowNewModal(true)}>
                        Initiate Disposal
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard
                        title="Total Requests"
                        value={stats.total}
                        icon={<ArchiveBoxXMarkIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-purple-600"
                    />
                    <StatCard
                        title="Pending Approval"
                        value={stats.pendingApproval}
                        icon={<ClockIcon className="w-5 h-5 text-white" />}
                        iconBg="from-amber-500 to-orange-600"
                    />
                    <StatCard
                        title="Pending Disposal"
                        value={stats.pendingDisposal}
                        icon={<ExclamationTriangleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-blue-500 to-cyan-600"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        icon={<CheckCircleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-emerald-500 to-green-600"
                    />
                    <StatCard
                        title="Amount Recovered"
                        value={formatCurrency(stats.totalRecovered)}
                        icon={<CurrencyRupeeIcon className="w-5 h-5 text-white" />}
                        iconBg="from-green-500 to-emerald-600"
                    />
                    <StatCard
                        title="Write-Off Amount"
                        value={formatCurrency(stats.totalWriteOff)}
                        icon={<TrashIcon className="w-5 h-5 text-white" />}
                        iconBg="from-red-500 to-rose-600"
                    />
                </div>

                {/* Disposal Process */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Disposal Workflow</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            {['Initiate Request', 'Committee Review', 'Approval', 'Condemnation Certificate', 'Physical Disposal', 'Closure'].map((step, index) => (
                                <div key={step} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index < 3 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className="text-xs text-slate-400 mt-2 text-center max-w-[80px]">{step}</span>
                                    </div>
                                    {index < 5 && (
                                        <div className={`w-12 h-0.5 mx-2 ${index < 2 ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Disposal Records */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Disposal Records</h3>
                    </CardHeader>
                    <CardContent padding={false}>
                        <div className="divide-y divide-white/5">
                            {disposalRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
                                    onClick={() => setSelectedRecord(record)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center text-2xl">
                                            {getDisposalTypeIcon(record.disposalType)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-white">{record.assetId}</p>
                                                <Badge variant={getStatusVariant(record.status)}>{record.status.replace('-', ' ')}</Badge>
                                            </div>
                                            <p className="text-sm text-slate-400 truncate">{record.assetName}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                <span>{record.disposalType}</span>
                                                <span>•</span>
                                                <span>{record.category}</span>
                                                <span>•</span>
                                                <span>Requested: {record.requestDate}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-400">Book Value</p>
                                            <p className="text-lg font-semibold text-white">{formatCurrency(record.bookValue)}</p>
                                            {record.status === 'Completed' && (
                                                <p className="text-xs text-emerald-400 mt-1">Recovered: {formatCurrency(record.disposalValue)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Disposal Types Legend */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { type: 'Auction', icon: '🔨', desc: 'Sold to highest bidder' },
                        { type: 'Scrap', icon: '♻️', desc: 'Sold as scrap value' },
                        { type: 'Donation', icon: '🎁', desc: 'Transferred to charity' },
                        { type: 'Trade-In', icon: '🔄', desc: 'Exchanged for new asset' },
                        { type: 'Write-Off', icon: '📝', desc: 'Complete write-off' },
                    ].map((item) => (
                        <div key={item.type} className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium text-white">{item.type}</span>
                            </div>
                            <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* New Disposal Modal */}
                <Modal
                    isOpen={showNewModal}
                    onClose={() => setShowNewModal(false)}
                    title="Initiate Asset Disposal"
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
                            <Button variant="danger">Submit for Approval</Button>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Select
                                label="Select Asset"
                                options={[
                                    { value: '', label: 'Choose asset to dispose' },
                                    ...assets.filter((a) => a.status === 'Idle' || a.condition === 'Poor').map((a) => ({
                                        value: a.id,
                                        label: `${a.assetId} - ${a.name}`,
                                    })),
                                ]}
                                required
                            />
                        </div>
                        <Select
                            label="Disposal Type"
                            options={[
                                { value: '', label: 'Select type' },
                                { value: 'Auction', label: 'Auction' },
                                { value: 'Scrap', label: 'Scrap Sale' },
                                { value: 'Donation', label: 'Donation' },
                                { value: 'Trade-In', label: 'Trade-In' },
                                { value: 'Write-Off', label: 'Write-Off' },
                            ]}
                            required
                        />
                        <Select
                            label="Reason for Disposal"
                            options={[
                                { value: '', label: 'Select reason' },
                                { value: 'obsolete', label: 'Obsolete Technology' },
                                { value: 'damaged', label: 'Damaged Beyond Repair' },
                                { value: 'ber', label: 'Beyond Economical Repair' },
                                { value: 'redundant', label: 'Redundant/Not Required' },
                                { value: 'expired', label: 'End of Life' },
                            ]}
                            required
                        />
                        <Input label="Estimated Disposal Value (₹)" type="number" placeholder="0" />
                        <Input label="Current Book Value (₹)" type="number" placeholder="0" disabled />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Justification</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="Provide detailed justification for disposal..."
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Supporting Documents</label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                                <DocumentCheckIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">Drop files here or click to upload</p>
                                <p className="text-xs text-slate-500 mt-1">Technical report, photos, estimates</p>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* Record Detail Modal */}
                <Modal
                    isOpen={!!selectedRecord}
                    onClose={() => setSelectedRecord(null)}
                    title="Disposal Details"
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setSelectedRecord(null)}>Close</Button>
                            {selectedRecord?.status === 'Pending-Approval' && (
                                <>
                                    <Button variant="danger">Reject</Button>
                                    <Button variant="success">Approve</Button>
                                </>
                            )}
                        </>
                    }
                >
                    {selectedRecord && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50">
                                <div className="text-4xl">{getDisposalTypeIcon(selectedRecord.disposalType)}</div>
                                <div>
                                    <p className="text-lg font-semibold text-white">{selectedRecord.assetId}</p>
                                    <p className="text-slate-400">{selectedRecord.assetName}</p>
                                </div>
                                <Badge variant={getStatusVariant(selectedRecord.status)} className="ml-auto">
                                    {selectedRecord.status.replace('-', ' ')}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Original Value</p>
                                    <p className="text-lg font-semibold text-white">{formatCurrency(selectedRecord.originalValue)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Book Value</p>
                                    <p className="text-lg font-semibold text-amber-400">{formatCurrency(selectedRecord.bookValue)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Disposal Value</p>
                                    <p className="text-lg font-semibold text-emerald-400">{formatCurrency(selectedRecord.disposalValue)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Write-Off</p>
                                    <p className="text-lg font-semibold text-red-400">{formatCurrency(selectedRecord.bookValue - selectedRecord.disposalValue)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Disposal Type</p>
                                    <p className="text-white font-medium mt-1">{selectedRecord.disposalType}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Reason</p>
                                    <p className="text-white font-medium mt-1">{selectedRecord.reason}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Request Date</p>
                                    <p className="text-white font-medium mt-1">{selectedRecord.requestDate}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Approved By</p>
                                    <p className="text-white font-medium mt-1">{selectedRecord.approvedBy || 'Pending'}</p>
                                </div>
                            </div>

                            {selectedRecord.condemnationNumber && (
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <p className="text-xs text-slate-400">Condemnation Certificate</p>
                                    <p className="text-emerald-400 font-semibold mt-1">{selectedRecord.condemnationNumber}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </Sidebar>
    );
}
