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
import { Department } from '@/types';
import {
    PlusIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    CubeIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';

export default function DepartmentsPage() {
    const { departments, users, assets, locations, addDepartment, updateDepartment, deleteDepartment } = useAssetStore();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [selectedDept, setSelectedDept] = useState<any | null>(null);

    // Form State
    const initialFormState = {
        name: '',
        code: '',
        headId: '',
        locationId: '',
        budget: 0,
    };
    const [formData, setFormData] = useState(initialFormState);

    // Define extended type for department with stats
    type DepartmentWithStats = typeof departments[0] & {
        assetCount: number;
        userCount: number;
        totalValue: number;
        activeAssets: number;
    };

    const deptStats = useMemo(() => {
        return departments.map((dept) => {
            const deptAssets = assets.filter((a) => a.departmentId === dept.id);
            const deptUsers = users.filter((u) => u.departmentId === dept.id);
            const totalValue = deptAssets.reduce((sum, a) => sum + a.currentValue, 0);
            return {
                ...dept,
                assetCount: deptAssets.length,
                userCount: deptUsers.length,
                totalValue,
                activeAssets: deptAssets.filter((a) => a.status === 'Active').length,
            };
        });
    }, [departments, assets, users]);

    const filteredDepts = deptStats.filter((dept) =>
        !search || dept.name.toLowerCase().includes(search.toLowerCase())
    );

    const overallStats = {
        total: departments.length,
        totalAssets: assets.length,
        totalUsers: users.length,
        totalValue: assets.reduce((sum, a) => sum + a.currentValue, 0),
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

    const getDeptHead = (headId: string) => {
        const user = users.find((u) => u.id === headId);
        return user ? `${user.firstName} ${user.lastName}` : '-';
    };

    const getLocation = (locationId: string) => {
        return locations.find((l) => l.id === locationId)?.name || '-';
    };

    const getDeptColor = (index: number) => {
        const colors = [
            'from-indigo-500 to-purple-600',
            'from-blue-500 to-cyan-600',
            'from-emerald-500 to-green-600',
            'from-amber-500 to-orange-600',
            'from-pink-500 to-rose-600',
            'from-violet-500 to-purple-600',
        ];
        return colors[index % colors.length];
    };

    const handleEdit = (dept: DepartmentWithStats) => {
        setEditingDept(dept);
        setFormData({
            name: dept.name,
            code: dept.code,
            headId: dept.headId,
            locationId: dept.locationId,
            budget: dept.budget,
        });
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this department?')) {
            deleteDepartment(id);
        }
    };

    const handleSave = () => {
        if (editingDept) {
            updateDepartment(editingDept.id, formData);
        } else {
            const newDept: Department = {
                id: `dept-${Date.now()}`,
                ...formData,
                parentDepartmentId: null,
                assetCount: 0,
                isActive: true,
            };
            addDepartment(newDept);
        }
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingDept(null);
        setFormData(initialFormState);
    };

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Department Management</h1>
                        <p className="text-slate-400 mt-1">Manage departments and their assets</p>
                    </div>
                    <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setShowModal(true)}>
                        Add Department
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Departments"
                        value={overallStats.total}
                        icon={<BuildingOfficeIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-purple-600"
                    />
                    <StatCard
                        title="Total Assets"
                        value={overallStats.totalAssets}
                        icon={<CubeIcon className="w-5 h-5 text-white" />}
                        iconBg="from-emerald-500 to-green-600"
                    />
                    <StatCard
                        title="Total Users"
                        value={overallStats.totalUsers}
                        icon={<UserGroupIcon className="w-5 h-5 text-white" />}
                        iconBg="from-blue-500 to-cyan-600"
                    />
                    <StatCard
                        title="Total Asset Value"
                        value={formatCurrency(overallStats.totalValue)}
                        icon={<CurrencyRupeeIcon className="w-5 h-5 text-white" />}
                        iconBg="from-amber-500 to-orange-600"
                    />
                </div>

                {/* Search */}
                <Card>
                    <CardContent>
                        <Input
                            placeholder="Search departments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                        />
                    </CardContent>
                </Card>

                {/* Department Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDepts.map((dept, index) => (
                        <Card key={dept.id} hover onClick={() => setSelectedDept(dept)}>
                            <CardContent>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getDeptColor(index)} flex items-center justify-center`}>
                                            <BuildingOfficeIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">{dept.name}</h3>
                                            <p className="text-xs text-slate-400">{dept.code}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(dept); }}
                                            className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(dept.id); }}
                                            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                                        <p className="text-2xl font-bold text-white">{dept.assetCount}</p>
                                        <p className="text-xs text-slate-400">Assets</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                                        <p className="text-2xl font-bold text-white">{dept.userCount}</p>
                                        <p className="text-xs text-slate-400">Users</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                                        <p className="text-2xl font-bold text-emerald-400">{dept.activeAssets}</p>
                                        <p className="text-xs text-slate-400">Active</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Asset Value</span>
                                        <span className="text-white font-medium">{formatCurrency(dept.totalValue)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Head</span>
                                        <span className="text-white">{getDeptHead(dept.headId)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Location</span>
                                        <span className="text-white">{getLocation(dept.locationId)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Department Detail Modal */}
                <Modal
                    isOpen={!!selectedDept}
                    onClose={() => setSelectedDept(null)}
                    title="Department Details"
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setSelectedDept(null)}>Close</Button>
                            <Button variant="primary" icon={<PencilIcon className="w-4 h-4" />} onClick={() => { handleEdit(selectedDept); setSelectedDept(null); }}>Edit</Button>
                        </>
                    }
                >
                    {selectedDept && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getDeptColor(0)} flex items-center justify-center`}>
                                    <BuildingOfficeIcon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-white">{selectedDept.name}</p>
                                    <p className="text-slate-400">{selectedDept.code}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                                    <p className="text-3xl font-bold text-white">{selectedDept.assetCount}</p>
                                    <p className="text-sm text-slate-400">Total Assets</p>
                                </div>
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                    <p className="text-3xl font-bold text-emerald-400">{selectedDept.activeAssets}</p>
                                    <p className="text-sm text-slate-400">Active Assets</p>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                                    <p className="text-3xl font-bold text-blue-400">{selectedDept.userCount}</p>
                                    <p className="text-sm text-slate-400">Users</p>
                                </div>
                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                                    <p className="text-2xl font-bold text-amber-400">{formatCurrency(selectedDept.totalValue)}</p>
                                    <p className="text-sm text-slate-400">Asset Value</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Department Head</p>
                                    <p className="text-white font-medium mt-1">{getDeptHead(selectedDept.headId)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Location</p>
                                    <p className="text-white font-medium mt-1">{getLocation(selectedDept.locationId)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Budget</p>
                                    <p className="text-white font-medium mt-1">{formatCurrency(selectedDept.budget)}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50">
                                    <p className="text-xs text-slate-400">Status</p>
                                    <Badge variant={selectedDept.isActive ? 'success' : 'danger'} className="mt-1">
                                        {selectedDept.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Recent Assets in Department */}
                            <div>
                                <p className="text-sm font-medium text-slate-300 mb-3">Recent Assets</p>
                                <div className="space-y-2">
                                    {assets
                                        .filter((a) => a.departmentId === selectedDept.id)
                                        .slice(0, 5)
                                        .map((asset) => (
                                            <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                                <div>
                                                    <p className="text-sm font-medium text-white">{asset.assetId}</p>
                                                    <p className="text-xs text-slate-400">{asset.name}</p>
                                                </div>
                                                <Badge variant={asset.status === 'Active' ? 'success' : 'warning'} size="sm">
                                                    {asset.status}
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Add/Edit Department Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    title={editingDept ? "Edit Department" : "Add New Department"}
                    size="md"
                    footer={
                        <>
                            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                            <Button variant="primary" onClick={handleSave}>
                                {editingDept ? "Save Changes" : "Create Department"}
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <Input
                            label="Department Name"
                            placeholder="e.g., Computer Science"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Department Code"
                            placeholder="e.g., CSE"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                        />
                        <Select
                            label="Department Head"
                            value={formData.headId}
                            onChange={(e) => setFormData({ ...formData, headId: e.target.value })}
                            options={[
                                { value: '', label: 'Select Head' },
                                ...users.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` })),
                            ]}
                        />
                        <Select
                            label="Location"
                            value={formData.locationId}
                            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                            options={[
                                { value: '', label: 'Select Location' },
                                ...locations.map((l) => ({ value: l.id, label: l.name })),
                            ]}
                        />
                        <Input
                            label="Budget"
                            type="number"
                            placeholder="Annual budget"
                            value={formData.budget.toString()}
                            onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                </Modal>
            </div>
        </Sidebar>
    );
}
