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
import Modal from '@/components/ui/Modal';
import StatCard from '@/components/ui/StatCard';
import {
    PlusIcon,
    BeakerIcon,
    HeartIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    AdjustmentsHorizontalIcon,
    DocumentCheckIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

// Biomedical equipment specific data
const biomedicalEquipment = [
    {
        id: 'biomed-1',
        assetId: 'MED-2024-001',
        name: 'Ventilator ICU Grade',
        make: 'Drager',
        model: 'Savina 300',
        serialNumber: 'DRG-VNT-2024-001',
        category: 'Life Support',
        location: 'ICU Ward A',
        status: 'Active',
        lastCalibration: '2024-05-15',
        nextCalibration: '2024-08-15',
        calibrationStatus: 'Valid',
        riskCategory: 'High',
        regulatoryClass: 'Class III',
        maintenanceFrequency: 'Monthly',
        lastPM: '2024-06-01',
        nextPM: '2024-07-01',
        purchasePrice: 1500000,
        warrantyEnd: '2026-05-15',
    },
    {
        id: 'biomed-2',
        assetId: 'MED-2024-002',
        name: 'Patient Monitor Multi-Para',
        make: 'Philips',
        model: 'IntelliVue MX800',
        serialNumber: 'PHI-MON-2024-002',
        category: 'Patient Monitoring',
        location: 'Emergency Ward',
        status: 'Active',
        lastCalibration: '2024-03-20',
        nextCalibration: '2024-06-20',
        calibrationStatus: 'Due',
        riskCategory: 'Medium',
        regulatoryClass: 'Class II',
        maintenanceFrequency: 'Quarterly',
        lastPM: '2024-04-15',
        nextPM: '2024-07-15',
        purchasePrice: 800000,
        warrantyEnd: '2025-08-20',
    },
    {
        id: 'biomed-3',
        assetId: 'MED-2024-003',
        name: 'Digital X-Ray System',
        make: 'Siemens',
        model: 'Ysio Max',
        serialNumber: 'SIE-XRY-2024-001',
        category: 'Imaging',
        location: 'Radiology Department',
        status: 'Under-Maintenance',
        lastCalibration: '2024-04-10',
        nextCalibration: '2024-10-10',
        calibrationStatus: 'Valid',
        riskCategory: 'High',
        regulatoryClass: 'Class III',
        maintenanceFrequency: 'Bi-Annual',
        lastPM: '2024-02-01',
        nextPM: '2024-08-01',
        purchasePrice: 5500000,
        warrantyEnd: '2027-01-10',
    },
    {
        id: 'biomed-4',
        assetId: 'MED-2024-004',
        name: 'Infusion Pump',
        make: 'B. Braun',
        model: 'Infusomat Space',
        serialNumber: 'BBR-INF-2024-010',
        category: 'Drug Delivery',
        location: 'Surgery OT 1',
        status: 'Active',
        lastCalibration: '2024-01-15',
        nextCalibration: '2024-07-15',
        calibrationStatus: 'Overdue',
        riskCategory: 'High',
        regulatoryClass: 'Class IIb',
        maintenanceFrequency: 'Quarterly',
        lastPM: '2024-05-01',
        nextPM: '2024-08-01',
        purchasePrice: 150000,
        warrantyEnd: '2025-01-15',
    },
    {
        id: 'biomed-5',
        assetId: 'LAB-2024-001',
        name: 'Fully Automated Biochemistry Analyzer',
        make: 'Roche',
        model: 'Cobas c311',
        serialNumber: 'ROC-BIO-2024-001',
        category: 'Clinical Laboratory',
        location: 'Pathology Lab',
        status: 'Active',
        lastCalibration: '2024-06-01',
        nextCalibration: '2024-09-01',
        calibrationStatus: 'Valid',
        riskCategory: 'Medium',
        regulatoryClass: 'Class II',
        maintenanceFrequency: 'Monthly',
        lastPM: '2024-06-01',
        nextPM: '2024-07-01',
        purchasePrice: 3500000,
        warrantyEnd: '2026-03-01',
    },
];

export default function BiomedicalPage() {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [riskFilter, setRiskFilter] = useState('');
    const [calibrationFilter, setCalibrationFilter] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<typeof biomedicalEquipment[0] | null>(null);

    const filteredEquipment = useMemo(() => {
        return biomedicalEquipment.filter((eq) => {
            const matchesSearch = !search ||
                eq.name.toLowerCase().includes(search.toLowerCase()) ||
                eq.assetId.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = !categoryFilter || eq.category === categoryFilter;
            const matchesRisk = !riskFilter || eq.riskCategory === riskFilter;
            const matchesCalibration = !calibrationFilter || eq.calibrationStatus === calibrationFilter;
            return matchesSearch && matchesCategory && matchesRisk && matchesCalibration;
        });
    }, [search, categoryFilter, riskFilter, calibrationFilter]);

    const stats = {
        total: biomedicalEquipment.length,
        active: biomedicalEquipment.filter((e) => e.status === 'Active').length,
        highRisk: biomedicalEquipment.filter((e) => e.riskCategory === 'High').length,
        calibrationDue: biomedicalEquipment.filter((e) => e.calibrationStatus === 'Due' || e.calibrationStatus === 'Overdue').length,
        pmDue: biomedicalEquipment.filter((e) => new Date(e.nextPM) <= new Date()).length,
        totalValue: biomedicalEquipment.reduce((sum, e) => sum + e.purchasePrice, 0),
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

    const getCalibrationVariant = (status: string) => {
        switch (status) {
            case 'Valid': return 'success';
            case 'Due': return 'warning';
            case 'Overdue': return 'danger';
            default: return 'default';
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'High': return 'from-red-500 to-rose-600';
            case 'Medium': return 'from-amber-500 to-orange-600';
            case 'Low': return 'from-emerald-500 to-green-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    const categories = [...new Set(biomedicalEquipment.map((e) => e.category))];

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Biomedical Equipment</h1>
                        <p className="text-slate-400 mt-1">Hospital & Lab equipment with calibration tracking</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" icon={<DocumentCheckIcon className="w-4 h-4" />}>
                            Calibration Schedule
                        </Button>
                        <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setShowNewModal(true)}>
                            Add Equipment
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard
                        title="Total Equipment"
                        value={stats.total}
                        icon={<BeakerIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-purple-600"
                    />
                    <StatCard
                        title="Active"
                        value={stats.active}
                        icon={<CheckCircleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-emerald-500 to-green-600"
                    />
                    <StatCard
                        title="High Risk"
                        value={stats.highRisk}
                        icon={<ExclamationTriangleIcon className="w-5 h-5 text-white" />}
                        iconBg="from-red-500 to-rose-600"
                    />
                    <StatCard
                        title="Calibration Due"
                        value={stats.calibrationDue}
                        icon={<AdjustmentsHorizontalIcon className="w-5 h-5 text-white" />}
                        iconBg="from-amber-500 to-orange-600"
                    />
                    <StatCard
                        title="PM Due"
                        value={stats.pmDue}
                        icon={<ClockIcon className="w-5 h-5 text-white" />}
                        iconBg="from-blue-500 to-cyan-600"
                    />
                    <StatCard
                        title="Total Value"
                        value={formatCurrency(stats.totalValue)}
                        icon={<HeartIcon className="w-5 h-5 text-white" />}
                        iconBg="from-pink-500 to-rose-600"
                    />
                </div>

                {/* Calibration Alerts */}
                {stats.calibrationDue > 0 && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="font-medium text-amber-400">{stats.calibrationDue} equipment require calibration attention</p>
                            <p className="text-sm text-slate-400">Schedule calibrations to maintain regulatory compliance</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                            View All
                        </Button>
                    </div>
                )}

                {/* Filters */}
                <Card>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Search by name or asset ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                                />
                            </div>
                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Categories' },
                                    ...categories.map((c) => ({ value: c, label: c })),
                                ]}
                            />
                            <Select
                                value={riskFilter}
                                onChange={(e) => setRiskFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'All Risk Levels' },
                                    { value: 'High', label: 'High Risk' },
                                    { value: 'Medium', label: 'Medium Risk' },
                                    { value: 'Low', label: 'Low Risk' },
                                ]}
                            />
                            <Select
                                value={calibrationFilter}
                                onChange={(e) => setCalibrationFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'Calibration Status' },
                                    { value: 'Valid', label: 'Valid' },
                                    { value: 'Due', label: 'Due' },
                                    { value: 'Overdue', label: 'Overdue' },
                                ]}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEquipment.map((equipment) => (
                        <Card key={equipment.id} hover onClick={() => setSelectedEquipment(equipment)}>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRiskColor(equipment.riskCategory)} flex items-center justify-center`}>
                                        {equipment.category === 'Imaging' ? (
                                            <span className="text-2xl">📷</span>
                                        ) : equipment.category === 'Life Support' ? (
                                            <span className="text-2xl">🫁</span>
                                        ) : equipment.category === 'Patient Monitoring' ? (
                                            <span className="text-2xl">📊</span>
                                        ) : equipment.category === 'Clinical Laboratory' ? (
                                            <BeakerIcon className="w-6 h-6 text-white" />
                                        ) : (
                                            <HeartIcon className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white truncate">{equipment.name}</p>
                                        <p className="text-xs text-slate-400">{equipment.assetId}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant={equipment.status === 'Active' ? 'success' : 'warning'} size="sm">
                                                {equipment.status}
                                            </Badge>
                                            <Badge variant={getCalibrationVariant(equipment.calibrationStatus)} size="sm">
                                                Cal: {equipment.calibrationStatus}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-slate-400">Risk Category</p>
                                        <p className={`text-sm font-medium ${equipment.riskCategory === 'High' ? 'text-red-400' :
                                            equipment.riskCategory === 'Medium' ? 'text-amber-400' :
                                                'text-emerald-400'
                                            }`}>{equipment.riskCategory}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Regulatory Class</p>
                                        <p className="text-sm font-medium text-white">{equipment.regulatoryClass}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Location</p>
                                        <p className="text-sm text-white truncate">{equipment.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Next PM</p>
                                        <p className="text-sm text-white">{equipment.nextPM}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-400">Make / Model</p>
                                        <p className="text-sm text-white">{equipment.make} {equipment.model}</p>
                                    </div>
                                    <p className="text-lg font-bold text-white">{formatCurrency(equipment.purchasePrice)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Equipment Detail Modal */}
                <Modal
                    isOpen={!!selectedEquipment}
                    onClose={() => setSelectedEquipment(null)}
                    title="Equipment Details"
                    size="lg"
                >
                    {selectedEquipment && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRiskColor(selectedEquipment.riskCategory)} flex items-center justify-center`}>
                                    <HeartIcon className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xl font-semibold text-white">{selectedEquipment.name}</p>
                                    <p className="text-slate-400">{selectedEquipment.assetId} • {selectedEquipment.category}</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant="danger" size="sm">{selectedEquipment.riskCategory} Risk</Badge>
                                    <p className="text-xs text-slate-400 mt-1">{selectedEquipment.regulatoryClass}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Make</p>
                                    <p className="text-white font-medium mt-1">{selectedEquipment.make}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Model</p>
                                    <p className="text-white font-medium mt-1">{selectedEquipment.model}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Serial Number</p>
                                    <p className="text-white font-medium mt-1 text-sm">{selectedEquipment.serialNumber}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Location</p>
                                    <p className="text-white font-medium mt-1">{selectedEquipment.location}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                    <p className="text-xs text-slate-400">Last Calibration</p>
                                    <p className="text-white font-medium mt-1">{selectedEquipment.lastCalibration}</p>
                                    <p className="text-xs text-slate-400 mt-2">Next Calibration</p>
                                    <p className={`font-medium mt-1 ${selectedEquipment.calibrationStatus === 'Overdue' ? 'text-red-400' :
                                        selectedEquipment.calibrationStatus === 'Due' ? 'text-amber-400' :
                                            'text-emerald-400'
                                        }`}>{selectedEquipment.nextCalibration}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <p className="text-xs text-slate-400">Last Preventive Maintenance</p>
                                    <p className="text-white font-medium mt-1">{selectedEquipment.lastPM}</p>
                                    <p className="text-xs text-slate-400 mt-2">Next PM Due</p>
                                    <p className="text-white font-medium mt-1">{selectedEquipment.nextPM}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <div>
                                    <p className="text-sm text-slate-400">Purchase Value</p>
                                    <p className="text-xl font-bold text-white">{formatCurrency(selectedEquipment.purchasePrice)}</p>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className="text-sm text-slate-400">Warranty Valid Until</p>
                                    <p className="text-lg font-semibold text-white">{selectedEquipment.warrantyEnd}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Add Equipment Modal */}
                <Modal
                    isOpen={showNewModal}
                    onClose={() => setShowNewModal(false)}
                    title="Add Biomedical Equipment"
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
                            <Button variant="primary">Add Equipment</Button>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Equipment Name" placeholder="e.g., Ventilator ICU Grade" required />
                        <Select
                            label="Category"
                            options={[
                                { value: '', label: 'Select Category' },
                                { value: 'Life Support', label: 'Life Support' },
                                { value: 'Patient Monitoring', label: 'Patient Monitoring' },
                                { value: 'Imaging', label: 'Imaging' },
                                { value: 'Drug Delivery', label: 'Drug Delivery' },
                                { value: 'Clinical Laboratory', label: 'Clinical Laboratory' },
                                { value: 'Surgical', label: 'Surgical' },
                            ]}
                            required
                        />
                        <Input label="Make" placeholder="e.g., Philips" required />
                        <Input label="Model" placeholder="e.g., IntelliVue MX800" required />
                        <Input label="Serial Number" placeholder="e.g., PHI-MON-2024-001" required />
                        <Select
                            label="Risk Category"
                            options={[
                                { value: '', label: 'Select Risk Level' },
                                { value: 'High', label: 'High' },
                                { value: 'Medium', label: 'Medium' },
                                { value: 'Low', label: 'Low' },
                            ]}
                            required
                        />
                        <Select
                            label="Regulatory Class"
                            options={[
                                { value: '', label: 'Select Class' },
                                { value: 'Class I', label: 'Class I' },
                                { value: 'Class II', label: 'Class II' },
                                { value: 'Class IIa', label: 'Class IIa' },
                                { value: 'Class IIb', label: 'Class IIb' },
                                { value: 'Class III', label: 'Class III' },
                            ]}
                            required
                        />
                        <Input label="Location" placeholder="e.g., ICU Ward A" required />
                        <Input label="Last Calibration Date" type="date" required />
                        <Input label="Calibration Frequency (months)" type="number" placeholder="3" required />
                        <Input label="Purchase Price (₹)" type="number" required />
                        <Input label="Warranty End Date" type="date" required />
                    </div>
                </Modal>
            </div>
        </Sidebar>
    );
}
