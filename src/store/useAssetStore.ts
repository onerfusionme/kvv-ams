// Zustand Store for Asset Management System
import { create } from 'zustand';
import {
    Asset,
    Location,
    Department,
    User,
    Vendor,
    Contract,
    MaintenanceRecord,
    AssetTransfer,
    AssetAudit,
    Notification,
    DashboardStats,
    SoftwareLicense,
    DisposalRecord,
    ComplianceRecord,
    CalibrationRecord,
    PurchaseOrder,
} from '@/types';
import {
    assets as mockAssets,
    locations as mockLocations,
    departments as mockDepartments,
    users as mockUsers,
    vendors as mockVendors,
    contracts as mockContracts,
    maintenanceRecords as mockMaintenanceRecords,
    assetTransfers as mockAssetTransfers,
    assetAudits as mockAssetAudits,
    notifications as mockNotifications,
    dashboardStats as mockDashboardStats,
    softwareLicenses as mockSoftwareLicenses,
    disposalRecords as mockDisposalRecords,
    complianceRecords as mockComplianceRecords,
    calibrationRecords as mockCalibrationRecords,
} from '@/data/mockData';

interface AssetStore {
    // Data
    assets: Asset[];
    locations: Location[];
    departments: Department[];
    users: User[];
    vendors: Vendor[];
    contracts: Contract[];
    maintenanceRecords: MaintenanceRecord[];
    assetTransfers: AssetTransfer[];
    assetAudits: AssetAudit[];
    notifications: Notification[];
    dashboardStats: DashboardStats;
    softwareLicenses: SoftwareLicense[];
    disposalRecords: DisposalRecord[];
    complianceRecords: ComplianceRecord[];
    calibrationRecords: CalibrationRecord[];

    // UI State
    currentUser: User | null;
    sidebarOpen: boolean;
    darkMode: boolean;

    // Actions
    setCurrentUser: (user: User | null) => void;
    toggleSidebar: () => void;
    toggleDarkMode: () => void;

    // Asset Actions
    addAsset: (asset: Asset) => void;
    updateAsset: (id: string, updates: Partial<Asset>) => void;
    deleteAsset: (id: string) => void;

    // User Actions
    addUser: (user: User) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    deleteUser: (id: string) => void;

    // Maintenance Actions
    addMaintenanceRecord: (record: MaintenanceRecord) => void;
    updateMaintenanceRecord: (id: string, updates: Partial<MaintenanceRecord>) => void;

    // Transfer Actions
    addTransfer: (transfer: AssetTransfer) => void;
    approveTransfer: (id: string, approvedBy: string) => void;
    rejectTransfer: (id: string) => void;

    // Notification Actions
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;

    // Vendor Actions
    addVendor: (vendor: Vendor) => void;
    updateVendor: (id: string, updates: Partial<Vendor>) => void;
    deleteVendor: (id: string) => void;

    // Contract Actions
    addContract: (contract: Contract) => void;
    updateContract: (id: string, updates: Partial<Contract>) => void;

    // Audit Actions
    addAudit: (audit: AssetAudit) => void;
    updateAudit: (id: string, updates: Partial<AssetAudit>) => void;

    // Department Actions
    addDepartment: (department: Department) => void;
    updateDepartment: (id: string, updates: Partial<Department>) => void;
    deleteDepartment: (id: string) => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
    // Initialize with mock data
    assets: mockAssets,
    locations: mockLocations,
    departments: mockDepartments,
    users: mockUsers,
    vendors: mockVendors,
    contracts: mockContracts,
    maintenanceRecords: mockMaintenanceRecords,
    assetTransfers: mockAssetTransfers,
    assetAudits: mockAssetAudits,
    notifications: mockNotifications,
    dashboardStats: mockDashboardStats,
    softwareLicenses: mockSoftwareLicenses,
    disposalRecords: mockDisposalRecords,
    complianceRecords: mockComplianceRecords,
    calibrationRecords: mockCalibrationRecords,

    // UI State
    currentUser: mockUsers[0], // Default to super admin
    sidebarOpen: true,
    darkMode: true,

    // Actions
    setCurrentUser: (user) => set({ currentUser: user }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

    // Asset Actions
    addAsset: (asset) => set((state) => ({
        assets: [...state.assets, asset],
        dashboardStats: {
            ...state.dashboardStats,
            totalAssets: state.dashboardStats.totalAssets + 1,
            activeAssets: asset.status === 'Active' ? state.dashboardStats.activeAssets + 1 : state.dashboardStats.activeAssets,
        }
    })),

    updateAsset: (id, updates) => set((state) => ({
        assets: state.assets.map((a) => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)
    })),

    deleteAsset: (id) => set((state) => ({
        assets: state.assets.filter((a) => a.id !== id),
        dashboardStats: {
            ...state.dashboardStats,
            totalAssets: state.dashboardStats.totalAssets - 1,
        }
    })),

    // User Actions
    addUser: (user) => set((state) => ({
        users: [...state.users, user],
        dashboardStats: {
            ...state.dashboardStats,
            totalUsers: state.dashboardStats.totalUsers + 1,
        }
    })),

    updateUser: (id, updates) => set((state) => ({
        users: state.users.map((u) => u.id === id ? { ...u, ...updates } : u)
    })),

    deleteUser: (id) => set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        dashboardStats: {
            ...state.dashboardStats,
            totalUsers: state.dashboardStats.totalUsers - 1,
        }
    })),

    // Maintenance Actions
    addMaintenanceRecord: (record) => set((state) => ({
        maintenanceRecords: [...state.maintenanceRecords, record]
    })),

    updateMaintenanceRecord: (id, updates) => set((state) => ({
        maintenanceRecords: state.maintenanceRecords.map((r) => r.id === id ? { ...r, ...updates } : r)
    })),

    // Transfer Actions
    addTransfer: (transfer) => set((state) => ({
        assetTransfers: [...state.assetTransfers, transfer],
        dashboardStats: {
            ...state.dashboardStats,
            pendingTransfers: state.dashboardStats.pendingTransfers + 1,
        }
    })),

    approveTransfer: (id, approvedBy) => set((state) => ({
        assetTransfers: state.assetTransfers.map((t) =>
            t.id === id
                ? { ...t, approvalStatus: 'Approved' as const, approvedBy, approvedDate: new Date().toISOString().split('T')[0] }
                : t
        ),
        dashboardStats: {
            ...state.dashboardStats,
            pendingTransfers: Math.max(0, state.dashboardStats.pendingTransfers - 1),
        }
    })),

    rejectTransfer: (id) => set((state) => ({
        assetTransfers: state.assetTransfers.map((t) =>
            t.id === id ? { ...t, approvalStatus: 'Rejected' as const } : t
        ),
        dashboardStats: {
            ...state.dashboardStats,
            pendingTransfers: Math.max(0, state.dashboardStats.pendingTransfers - 1),
        }
    })),

    // Notification Actions
    markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n)
    })),

    markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
    })),

    // Vendor Actions
    addVendor: (vendor) => set((state) => ({
        vendors: [...state.vendors, vendor]
    })),

    updateVendor: (id, updates) => set((state) => ({
        vendors: state.vendors.map((v) => v.id === id ? { ...v, ...updates } : v)
    })),

    deleteVendor: (id) => set((state) => ({
        vendors: state.vendors.filter((v) => v.id !== id)
    })),

    // Contract Actions
    addContract: (contract) => set((state) => ({
        contracts: [...state.contracts, contract]
    })),

    updateContract: (id, updates) => set((state) => ({
        contracts: state.contracts.map((c) => c.id === id ? { ...c, ...updates } : c)
    })),

    // Audit Actions
    addAudit: (audit) => set((state) => ({
        assetAudits: [...state.assetAudits, audit]
    })),

    updateAudit: (id, updates) => set((state) => ({
        assetAudits: state.assetAudits.map((a) => a.id === id ? { ...a, ...updates } : a)
    })),

    // Department Actions
    addDepartment: (department) => set((state) => ({
        departments: [...state.departments, department]
    })),

    updateDepartment: (id, updates) => set((state) => ({
        departments: state.departments.map((d) => d.id === id ? { ...d, ...updates } : d)
    })),

    deleteDepartment: (id) => set((state) => ({
        departments: state.departments.filter((d) => d.id !== id)
    })),
}));
