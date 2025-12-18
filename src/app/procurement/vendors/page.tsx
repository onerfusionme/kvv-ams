export const dynamic = 'force-dynamic';

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
import DataTable, { Column } from '@/components/ui/DataTable';
import StatCard from '@/components/ui/StatCard';
import { Vendor } from '@/types';
import {
    PlusIcon,
    TruckIcon,
    MagnifyingGlassIcon,
    StarIcon,
    PhoneIcon,
    EnvelopeIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

export default function VendorsPage() {
    const { vendors, contracts, addVendor, updateVendor, deleteVendor } = useAssetStore();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

    // Form State
    const initialFormState = {
        name: '',
        code: '',
        type: '' as 'Supplier' | 'Service Provider' | 'Both' | '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        gstNumber: '',
        panNumber: '',
        rating: 4,
    };
    const [formData, setFormData] = useState(initialFormState);

    const pageSize = 10;

    const filteredVendors = vendors.filter((vendor) =>
        !search || vendor.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVendors.length / pageSize);
    const paginatedVendors = filteredVendors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getContractCount = (vendorId: string) => contracts.filter((c) => c.vendorId === vendorId).length;
    const getActiveContracts = (vendorId: string) => contracts.filter((c) => c.vendorId === vendorId && c.status === 'Active').length;

    const handleEdit = (vendor: Vendor) => {
        setEditingVendor(vendor);
        setFormData({
            name: vendor.name,
            code: vendor.code,
            type: vendor.type,
            contactPerson: vendor.contactPerson,
            email: vendor.email,
            phone: vendor.phone,
            address: vendor.address,
            gstNumber: vendor.gstNumber,
            panNumber: vendor.panNumber,
            rating: vendor.rating,
        });
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this vendor?')) {
            deleteVendor(id);
        }
    };

    const handleSave = () => {
        if (editingVendor) {
            updateVendor(editingVendor.id, {
                ...formData,
                type: formData.type as 'Supplier' | 'Service Provider' | 'Both',
            });
        } else {
            const newVendor: Vendor = {
                id: `vendor-${Date.now()}`,
                ...formData,
                type: formData.type as 'Supplier' | 'Service Provider' | 'Both',
                isActive: true,
                contracts: [],
            };
            addVendor(newVendor);
        }
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingVendor(null);
        setFormData(initialFormState);
    };

    const columns: Column<Vendor>[] = [
        {
            key: 'name',
            header: 'Vendor',
            render: (vendor) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                        <TruckIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <p className="font-medium text-white">{vendor.name}</p>
                        <p className="text-xs text-slate-400">{vendor.code}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            header: 'Type',
            render: (vendor) => (
                <Badge variant={vendor.type === 'Both' ? 'purple' : vendor.type === 'Supplier' ? 'info' : 'success'}>
                    {vendor.type}
                </Badge>
            ),
        },
        {
            key: 'contactPerson',
            header: 'Contact',
            render: (vendor) => (
                <div>
                    <p className="text-white">{vendor.contactPerson}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <EnvelopeIcon className="w-3 h-3" />
                        {vendor.email}
                    </p>
                </div>
            ),
        },
        {
            key: 'phone',
            header: 'Phone',
            render: (vendor) => (
                <span className="text-slate-300 flex items-center gap-1">
                    <PhoneIcon className="w-3 h-3" />
                    {vendor.phone}
                </span>
            ),
        },
        {
            key: 'rating',
            header: 'Rating',
            render: (vendor) => (
                <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-white font-medium">{vendor.rating}</span>
                </div>
            ),
        },
        {
            key: 'contracts',
            header: 'Contracts',
            render: (vendor) => (
                <div>
                    <p className="text-white font-medium">{getContractCount(vendor.id)}</p>
                    <p className="text-xs text-slate-400">{getActiveContracts(vendor.id)} active</p>
                </div>
            ),
        },
        {
            key: 'isActive',
            header: 'Status',
            render: (vendor) => (
                <Badge variant={vendor.isActive ? 'success' : 'danger'} dot>
                    {vendor.isActive ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (vendor) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(vendor); }}
                        className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(vendor.id); }}
                        className="p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Vendor Management</h1>
                        <p className="text-slate-400 mt-1">Manage suppliers and service providers</p>
                    </div>
                    <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />} onClick={() => setShowModal(true)}>
                        Add Vendor
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Vendors"
                        value={vendors.length}
                        icon={<TruckIcon className="w-5 h-5 text-white" />}
                        iconBg="from-indigo-500 to-purple-600"
                    />
                    <StatCard
                        title="Suppliers"
                        value={vendors.filter((v) => v.type === 'Supplier' || v.type === 'Both').length}
                        icon={<TruckIcon className="w-5 h-5 text-white" />}
                        iconBg="from-blue-500 to-cyan-600"
                    />
                    <StatCard
                        title="Service Providers"
                        value={vendors.filter((v) => v.type === 'Service Provider' || v.type === 'Both').length}
                        icon={<TruckIcon className="w-5 h-5 text-white" />}
                        iconBg="from-emerald-500 to-green-600"
                    />
                    <StatCard
                        title="Active Contracts"
                        value={contracts.filter((c) => c.status === 'Active').length}
                        icon={<TruckIcon className="w-5 h-5 text-white" />}
                        iconBg="from-amber-500 to-orange-600"
                    />
                </div>

                {/* Search */}
                <Card>
                    <CardContent>
                        <Input
                            placeholder="Search vendors..."
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
                            data={paginatedVendors}
                            columns={columns}
                            keyExtractor={(item) => item.id}
                            emptyMessage="No vendors found."
                            pagination={{
                                currentPage,
                                totalPages,
                                pageSize,
                                totalItems: filteredVendors.length,
                                onPageChange: setCurrentPage,
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Vendor Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    title={editingVendor ? "Edit Vendor" : "Add New Vendor"}
                    size="lg"
                    footer={
                        <>
                            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                            <Button variant="primary" onClick={handleSave}>
                                {editingVendor ? "Save Changes" : "Create Vendor"}
                            </Button>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Vendor Name"
                            placeholder="ABC Technologies Pvt Ltd"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Vendor Code"
                            placeholder="VND-001"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                        />
                        <Select
                            label="Type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            options={[
                                { value: '', label: 'Select Type' },
                                { value: 'Supplier', label: 'Supplier' },
                                { value: 'Service Provider', label: 'Service Provider' },
                                { value: 'Both', label: 'Both' },
                            ]}
                            required
                        />
                        <Input
                            label="Contact Person"
                            placeholder="John Doe"
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="contact@vendor.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Phone"
                            placeholder="+91-9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Address"
                                placeholder="123 Business Park, City"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <Input
                            label="GST Number"
                            placeholder="22AAAAA0000A1Z5"
                            value={formData.gstNumber}
                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                        />
                        <Input
                            label="PAN Number"
                            placeholder="AAAAA0000A"
                            value={formData.panNumber}
                            onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                        />
                    </div>
                </Modal>
            </div>
        </Sidebar>
    );
}
