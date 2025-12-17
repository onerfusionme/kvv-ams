'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Asset } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

export default function NewAssetPage() {
    const router = useRouter();
    const { addAsset, departments, locations, vendors } = useAssetStore();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        subCategory: '',
        assetType: '',
        make: '',
        model: '',
        serialNumber: '',
        tagType: 'QR',
        purchaseDate: '',
        purchasePrice: '',
        warrantyStartDate: '',
        warrantyEndDate: '',
        depreciationMethod: 'SLM',
        depreciationRate: '15',
        usefulLife: '5',
        salvageValue: '',
        locationId: '',
        departmentId: '',
        vendorId: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateAssetId = () => {
        const prefix = formData.category === 'IT' ? 'IT' :
            formData.category === 'Hospital' ? 'MED' :
                formData.category === 'Academic' ? 'LAB' : 'INF';
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${year}-${random}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const assetId = generateAssetId();
            const newAsset: Asset = {
                id: uuidv4(),
                assetId,
                name: formData.name,
                description: formData.description,
                category: formData.category as Asset['category'],
                subCategory: formData.subCategory,
                assetType: formData.assetType,
                make: formData.make,
                model: formData.model,
                serialNumber: formData.serialNumber,
                tagType: formData.tagType as Asset['tagType'],
                tagId: `${formData.tagType}-${assetId}`,
                status: 'Active',
                condition: 'Excellent',
                purchaseDate: formData.purchaseDate,
                purchasePrice: parseFloat(formData.purchasePrice) || 0,
                currentValue: parseFloat(formData.purchasePrice) || 0,
                warrantyStartDate: formData.warrantyStartDate,
                warrantyEndDate: formData.warrantyEndDate,
                depreciationMethod: formData.depreciationMethod as Asset['depreciationMethod'],
                depreciationRate: parseFloat(formData.depreciationRate) || 15,
                usefulLife: parseInt(formData.usefulLife) || 5,
                salvageValue: parseFloat(formData.salvageValue) || 0,
                locationId: formData.locationId,
                departmentId: formData.departmentId,
                assignedToId: null,
                vendorId: formData.vendorId,
                purchaseOrderId: '',
                specifications: {},
                images: [],
                documents: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'user-1',
            };

            addAsset(newAsset);
            toast.success('Asset created successfully!');
            setTimeout(() => router.push('/assets'), 1500);
        } catch (error) {
            toast.error('Failed to create asset. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const subCategories: Record<string, string[]> = {
        IT: ['Desktop', 'Laptop', 'Server', 'Network', 'Printer', 'Peripheral'],
        Academic: ['Laboratory', 'Classroom', 'Library', 'Research'],
        Hospital: ['Imaging', 'Monitoring', 'Surgical', 'Laboratory', 'ICU'],
        Infrastructure: ['HVAC', 'Electrical', 'Furniture', 'Safety'],
    };

    const steps = [
        { id: 1, name: 'Basic Info' },
        { id: 2, name: 'Specifications' },
        { id: 3, name: 'Financial' },
        { id: 4, name: 'Assignment' },
    ];

    return (
        <Sidebar>
            <Toaster position="top-right" />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Add New Asset</h1>
                        <p className="text-slate-400 mt-1">Register a new asset in the system</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="relative">
                    <div className="flex items-center justify-between">
                        {steps.map((s, index) => (
                            <div key={s.id} className="flex-1 flex items-center">
                                <div className="relative flex flex-col items-center flex-1">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step > s.id
                                                ? 'bg-emerald-500 text-white'
                                                : step === s.id
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-slate-700 text-slate-400'
                                            }`}
                                    >
                                        {step > s.id ? <CheckIcon className="w-5 h-5" /> : s.id}
                                    </div>
                                    <span className={`mt-2 text-sm ${step >= s.id ? 'text-white' : 'text-slate-400'}`}>
                                        {s.name}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 ${step > s.id ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Asset Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g., Dell OptiPlex 7090"
                                        required
                                    />
                                    <Select
                                        label="Category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { value: '', label: 'Select Category' },
                                            { value: 'IT', label: 'IT Assets' },
                                            { value: 'Academic', label: 'Academic Equipment' },
                                            { value: 'Hospital', label: 'Hospital/Medical' },
                                            { value: 'Infrastructure', label: 'Infrastructure' },
                                        ]}
                                    />
                                    <Select
                                        label="Sub-Category"
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { value: '', label: 'Select Sub-Category' },
                                            ...(formData.category
                                                ? subCategories[formData.category].map((s) => ({ value: s, label: s }))
                                                : []),
                                        ]}
                                    />
                                    <Input
                                        label="Asset Type"
                                        name="assetType"
                                        value={formData.assetType}
                                        onChange={handleChange}
                                        placeholder="e.g., Desktop Computer"
                                        required
                                    />
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                                            placeholder="Describe the asset..."
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex justify-end">
                                    <Button type="button" onClick={() => setStep(2)}>
                                        Next Step
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Step 2: Specifications */}
                    {step === 2 && (
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Specifications</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Make / Manufacturer"
                                        name="make"
                                        value={formData.make}
                                        onChange={handleChange}
                                        placeholder="e.g., Dell"
                                        required
                                    />
                                    <Input
                                        label="Model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        placeholder="e.g., OptiPlex 7090"
                                        required
                                    />
                                    <Input
                                        label="Serial Number"
                                        name="serialNumber"
                                        value={formData.serialNumber}
                                        onChange={handleChange}
                                        placeholder="e.g., ABC123XYZ"
                                        required
                                    />
                                    <Select
                                        label="Tag Type"
                                        name="tagType"
                                        value={formData.tagType}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'QR', label: 'QR Code' },
                                            { value: 'Barcode', label: 'Barcode' },
                                            { value: 'RFID', label: 'RFID' },
                                        ]}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex justify-between">
                                    <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                                        Previous
                                    </Button>
                                    <Button type="button" onClick={() => setStep(3)}>
                                        Next Step
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Step 3: Financial */}
                    {step === 3 && (
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Financial Information</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Purchase Date"
                                        name="purchaseDate"
                                        type="date"
                                        value={formData.purchaseDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Purchase Price (₹)"
                                        name="purchasePrice"
                                        type="number"
                                        value={formData.purchasePrice}
                                        onChange={handleChange}
                                        placeholder="e.g., 85000"
                                        required
                                    />
                                    <Input
                                        label="Warranty Start Date"
                                        name="warrantyStartDate"
                                        type="date"
                                        value={formData.warrantyStartDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Warranty End Date"
                                        name="warrantyEndDate"
                                        type="date"
                                        value={formData.warrantyEndDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Select
                                        label="Depreciation Method"
                                        name="depreciationMethod"
                                        value={formData.depreciationMethod}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'SLM', label: 'Straight Line Method (SLM)' },
                                            { value: 'WDV', label: 'Written Down Value (WDV)' },
                                        ]}
                                    />
                                    <Input
                                        label="Depreciation Rate (%)"
                                        name="depreciationRate"
                                        type="number"
                                        value={formData.depreciationRate}
                                        onChange={handleChange}
                                        placeholder="e.g., 15"
                                    />
                                    <Input
                                        label="Useful Life (Years)"
                                        name="usefulLife"
                                        type="number"
                                        value={formData.usefulLife}
                                        onChange={handleChange}
                                        placeholder="e.g., 5"
                                    />
                                    <Input
                                        label="Salvage Value (₹)"
                                        name="salvageValue"
                                        type="number"
                                        value={formData.salvageValue}
                                        onChange={handleChange}
                                        placeholder="e.g., 8500"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex justify-between">
                                    <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                                        Previous
                                    </Button>
                                    <Button type="button" onClick={() => setStep(4)}>
                                        Next Step
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Step 4: Assignment */}
                    {step === 4 && (
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Assignment & Location</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Select
                                        label="Department"
                                        name="departmentId"
                                        value={formData.departmentId}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { value: '', label: 'Select Department' },
                                            ...departments.map((d) => ({ value: d.id, label: d.name })),
                                        ]}
                                    />
                                    <Select
                                        label="Location"
                                        name="locationId"
                                        value={formData.locationId}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { value: '', label: 'Select Location' },
                                            ...locations.map((l) => ({ value: l.id, label: `${l.name} (${l.code})` })),
                                        ]}
                                    />
                                    <Select
                                        label="Vendor / Supplier"
                                        name="vendorId"
                                        value={formData.vendorId}
                                        onChange={handleChange}
                                        options={[
                                            { value: '', label: 'Select Vendor' },
                                            ...vendors.map((v) => ({ value: v.id, label: v.name })),
                                        ]}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex justify-between">
                                    <Button type="button" variant="secondary" onClick={() => setStep(3)}>
                                        Previous
                                    </Button>
                                    <Button type="submit" loading={loading}>
                                        Create Asset
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    )}
                </form>
            </div>
        </Sidebar>
    );
}
