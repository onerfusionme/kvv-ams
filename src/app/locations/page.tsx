'use client';

import { useState } from 'react';
import { useAssetStore } from '@/store/useAssetStore';
import Sidebar from '@/components/layout/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
    PlusIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    ChevronRightIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

export default function LocationsPage() {
    const { locations, assets } = useAssetStore();
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [expandedLocations, setExpandedLocations] = useState<string[]>(['loc-1', 'loc-4']);

    // Build location tree
    const buildTree = (parentId: string | null): typeof locations => {
        return locations
            .filter((l) => l.parentId === parentId)
            .map((location) => ({
                ...location,
                children: buildTree(location.id),
            }));
    };

    const locationTree = buildTree(null);

    const getAssetCount = (locationId: string): number => {
        const directAssets = assets.filter((a) => a.locationId === locationId).length;
        const childLocations = locations.filter((l) => l.parentId === locationId);
        const childAssets = childLocations.reduce((sum, child) => sum + getAssetCount(child.id), 0);
        return directAssets + childAssets;
    };

    const toggleExpand = (id: string) => {
        setExpandedLocations((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const getLocationTypeColor = (type: string) => {
        switch (type) {
            case 'Campus': return 'from-indigo-500 to-purple-600';
            case 'Building': return 'from-blue-500 to-cyan-600';
            case 'Floor': return 'from-emerald-500 to-green-600';
            case 'Room': return 'from-amber-500 to-orange-600';
            case 'Zone': return 'from-pink-500 to-rose-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    const renderLocationTree = (locs: typeof locationTree, level: number = 0) => {
        return locs.map((location) => {
            const hasChildren = locations.some((l) => l.parentId === location.id);
            const isExpanded = expandedLocations.includes(location.id);
            const assetCount = getAssetCount(location.id);
            const childLocations = locations.filter((l) => l.parentId === location.id);

            return (
                <div key={location.id}>
                    <div
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${selectedLocation === location.id
                                ? 'bg-indigo-500/20 border border-indigo-500/30'
                                : 'hover:bg-white/5'
                            }`}
                        style={{ marginLeft: `${level * 24}px` }}
                        onClick={() => setSelectedLocation(location.id)}
                    >
                        {hasChildren && (
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleExpand(location.id); }}
                                className="p-1 rounded hover:bg-white/10"
                            >
                                <ChevronRightIcon
                                    className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                />
                            </button>
                        )}
                        {!hasChildren && <div className="w-6" />}
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getLocationTypeColor(location.type)} flex items-center justify-center`}>
                            {location.type === 'Campus' ? (
                                <BuildingOfficeIcon className="w-4 h-4 text-white" />
                            ) : (
                                <MapPinIcon className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{location.name}</p>
                            <p className="text-xs text-slate-400">{location.code}</p>
                        </div>
                        <Badge variant="default" size="sm">{location.type}</Badge>
                        <span className="text-sm text-slate-400">{assetCount} assets</span>
                    </div>
                    {hasChildren && isExpanded && (
                        <div className="mt-1">
                            {renderLocationTree(childLocations as typeof locationTree, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    const currentLocation = locations.find((l) => l.id === selectedLocation);
    const currentLocationAssets = assets.filter((a) => a.locationId === selectedLocation);
    const childLocations = locations.filter((l) => l.parentId === selectedLocation);

    return (
        <Sidebar>
            <div className="p-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Location Management</h1>
                        <p className="text-slate-400 mt-1">Manage campus, buildings, floors, and rooms</p>
                    </div>
                    <Button
                        variant="primary"
                        icon={<PlusIcon className="w-4 h-4" />}
                        onClick={() => setShowAddModal(true)}
                    >
                        Add Location
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {['Campus', 'Building', 'Floor', 'Room', 'Zone'].map((type) => {
                        const count = locations.filter((l) => l.type === type).length;
                        return (
                            <div key={type} className={`p-4 rounded-xl bg-gradient-to-br ${getLocationTypeColor(type)} bg-opacity-10 border border-white/10`}>
                                <p className="text-sm text-slate-300">{type}s</p>
                                <p className="text-2xl font-bold text-white mt-1">{count}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Location Tree */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-white">Location Hierarchy</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 max-h-[600px] overflow-y-auto">
                                    {renderLocationTree(locationTree)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Location Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {currentLocation ? (
                            <>
                                <Card>
                                    <CardHeader
                                        action={
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" icon={<PencilIcon className="w-4 h-4" />}>
                                                    Edit
                                                </Button>
                                                <Button variant="ghost" size="sm" icon={<TrashIcon className="w-4 h-4" />} className="text-red-400 hover:text-red-300">
                                                    Delete
                                                </Button>
                                            </div>
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getLocationTypeColor(currentLocation.type)} flex items-center justify-center`}>
                                                {currentLocation.type === 'Campus' ? (
                                                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                                                ) : (
                                                    <MapPinIcon className="w-6 h-6 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{currentLocation.name}</h3>
                                                <p className="text-sm text-slate-400">{currentLocation.code} • {currentLocation.type}</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="p-4 rounded-xl bg-slate-800/50">
                                                <p className="text-sm text-slate-400">Total Assets</p>
                                                <p className="text-2xl font-bold text-white mt-1">{getAssetCount(currentLocation.id)}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-800/50">
                                                <p className="text-sm text-slate-400">Direct Assets</p>
                                                <p className="text-2xl font-bold text-white mt-1">{currentLocationAssets.length}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-800/50">
                                                <p className="text-sm text-slate-400">Sub-Locations</p>
                                                <p className="text-2xl font-bold text-white mt-1">{childLocations.length}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-800/50">
                                                <p className="text-sm text-slate-400">Status</p>
                                                <Badge variant={currentLocation.isActive ? 'success' : 'danger'} className="mt-2">
                                                    {currentLocation.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                        </div>
                                        {currentLocation.address && (
                                            <div className="mt-4 p-4 rounded-xl bg-slate-800/50">
                                                <p className="text-sm text-slate-400">Address</p>
                                                <p className="text-white mt-1">{currentLocation.address}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Sub-locations */}
                                {childLocations.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <h3 className="text-lg font-semibold text-white">Sub-Locations</h3>
                                        </CardHeader>
                                        <CardContent padding={false}>
                                            <div className="divide-y divide-white/5">
                                                {childLocations.map((child) => (
                                                    <div
                                                        key={child.id}
                                                        className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer"
                                                        onClick={() => setSelectedLocation(child.id)}
                                                    >
                                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getLocationTypeColor(child.type)} flex items-center justify-center`}>
                                                            <MapPinIcon className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-white">{child.name}</p>
                                                            <p className="text-sm text-slate-400">{child.code}</p>
                                                        </div>
                                                        <Badge variant="default">{child.type}</Badge>
                                                        <span className="text-sm text-slate-400">{getAssetCount(child.id)} assets</span>
                                                        <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Assets at this location */}
                                {currentLocationAssets.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <h3 className="text-lg font-semibold text-white">Assets at This Location</h3>
                                        </CardHeader>
                                        <CardContent padding={false}>
                                            <div className="divide-y divide-white/5">
                                                {currentLocationAssets.slice(0, 5).map((asset) => (
                                                    <div key={asset.id} className="flex items-center gap-4 p-4 hover:bg-white/5">
                                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                                            <span className="text-indigo-400 font-semibold text-sm">{asset.category.charAt(0)}</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-white">{asset.name}</p>
                                                            <p className="text-sm text-slate-400">{asset.assetId}</p>
                                                        </div>
                                                        <Badge variant={asset.status === 'Active' ? 'success' : 'warning'}>
                                                            {asset.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        ) : (
                            <Card>
                                <CardContent>
                                    <div className="text-center py-12">
                                        <MapPinIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-white mb-2">Select a Location</h3>
                                        <p className="text-slate-400">Click on a location from the hierarchy to view details</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Add Location Modal */}
                <Modal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    title="Add New Location"
                    size="md"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button variant="primary">Create Location</Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <Input label="Location Name" placeholder="e.g., Engineering Block" required />
                        <Input label="Location Code" placeholder="e.g., MC-EB" required />
                        <Select
                            label="Location Type"
                            options={[
                                { value: '', label: 'Select Type' },
                                { value: 'Campus', label: 'Campus' },
                                { value: 'Building', label: 'Building' },
                                { value: 'Floor', label: 'Floor' },
                                { value: 'Room', label: 'Room' },
                                { value: 'Zone', label: 'Zone' },
                            ]}
                            required
                        />
                        <Select
                            label="Parent Location"
                            options={[
                                { value: '', label: 'None (Top Level)' },
                                ...locations.map((l) => ({ value: l.id, label: `${l.name} (${l.type})` })),
                            ]}
                        />
                        <Input label="Address (Optional)" placeholder="Full address" />
                    </div>
                </Modal>
            </div>
        </Sidebar>
    );
}
