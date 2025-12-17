// Zustand Store for Asset Management System - API Connected
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
} from '@/types';

// Default empty dashboard stats (matching DashboardStats interface from types)
const defaultDashboardStats: DashboardStats = {
    totalAssets: 0,
    totalUsers: 0,
    activeAssets: 0,
    assetsUnderMaintenance: 0,
    assetsInRepair: 0,
    idleAssets: 0,
    condemnedAssets: 0,
    disposedAssets: 0,
    totalValue: 0,
    depreciatedValue: 0,
    maintenanceCostMTD: 0,
    maintenanceCostYTD: 0,
    warrantyExpiringSoon: 0,
    amcExpiringSoon: 0,
    calibrationDueSoon: 0,
    pendingTransfers: 0,
    pendingAudits: 0,
    complianceIssues: 0,
};

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

    // Loading states
    isLoading: boolean;
    error: string | null;

    // UI State
    currentUser: User | null;
    sidebarOpen: boolean;

    // Fetch Actions (API)
    fetchAssets: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    fetchDepartments: () => Promise<void>;
    fetchVendors: () => Promise<void>;
    fetchDashboardStats: () => Promise<void>;
    fetchAll: () => Promise<void>;

    // Actions
    setCurrentUser: (user: User | null) => void;
    toggleSidebar: () => void;
    setAssets: (assets: Asset[]) => void;
    setUsers: (users: User[]) => void;
    setDepartments: (departments: Department[]) => void;
    setVendors: (vendors: Vendor[]) => void;

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

export const useAssetStore = create<AssetStore>((set, get) => ({
    // Initialize with empty data
    assets: [],
    locations: [],
    departments: [],
    users: [],
    vendors: [],
    contracts: [],
    maintenanceRecords: [],
    assetTransfers: [],
    assetAudits: [],
    notifications: [],
    dashboardStats: defaultDashboardStats,
    softwareLicenses: [],
    disposalRecords: [],
    complianceRecords: [],
    calibrationRecords: [],

    // Loading states
    isLoading: false,
    error: null,

    // UI State
    currentUser: null,
    sidebarOpen: true,

    // Fetch Actions
    fetchAssets: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch('/api/assets');
            if (!res.ok) throw new Error('Failed to fetch assets');
            const data = await res.json();
            set({ assets: data, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    fetchUsers: async () => {
        try {
            const res = await fetch('/api/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            set({ users: data });
        } catch (error) {
            console.error('Fetch users error:', error);
        }
    },

    fetchDepartments: async () => {
        try {
            const res = await fetch('/api/departments');
            if (!res.ok) throw new Error('Failed to fetch departments');
            const data = await res.json();
            set({ departments: data });
        } catch (error) {
            console.error('Fetch departments error:', error);
        }
    },

    fetchVendors: async () => {
        try {
            const res = await fetch('/api/vendors');
            if (!res.ok) throw new Error('Failed to fetch vendors');
            const data = await res.json();
            set({ vendors: data });
        } catch (error) {
            console.error('Fetch vendors error:', error);
        }
    },

    fetchDashboardStats: async () => {
        try {
            const res = await fetch('/api/dashboard/stats');
            if (!res.ok) throw new Error('Failed to fetch stats');
            const data = await res.json();
            set({ dashboardStats: { ...defaultDashboardStats, ...data } });
        } catch (error) {
            console.error('Fetch dashboard stats error:', error);
        }
    },

    fetchAll: async () => {
        set({ isLoading: true });
        const { fetchAssets, fetchUsers, fetchDepartments, fetchVendors, fetchDashboardStats } = get();
        await Promise.all([
            fetchAssets(),
            fetchUsers(),
            fetchDepartments(),
            fetchVendors(),
            fetchDashboardStats(),
        ]);
        set({ isLoading: false });
    },

    // Setters
    setCurrentUser: (user) => set({ currentUser: user }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setAssets: (assets) => set({ assets }),
    setUsers: (users) => set({ users }),
    setDepartments: (departments) => set({ departments }),
    setVendors: (vendors) => set({ vendors }),

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
        users: [...state.users, user]
    })),

    updateUser: (id, updates) => set((state) => ({
        users: state.users.map((u) => u.id === id ? { ...u, ...updates } : u)
    })),

    deleteUser: (id) => set((state) => ({
        users: state.users.filter((u) => u.id !== id)
    })),

    // Maintenance Actions
    addMaintenanceRecord: (record) => set((state) => ({
        maintenanceRecords: [...state.maintenanceRecords, record]
    })),

    updateMaintenanceRecord: (id, updates) => set((state) => ({
        maintenanceRecords: state.maintenanceRecords.map((r) =>
            r.id === id ? { ...r, ...updates } : r
        )
    })),

    // Transfer Actions
    addTransfer: (transfer) => set((state) => ({
        assetTransfers: [...state.assetTransfers, transfer]
    })),

    approveTransfer: (id, approvedBy) => set((state) => ({
        assetTransfers: state.assetTransfers.map((t) =>
            t.id === id ? { ...t, status: 'Completed' as const, approvedBy, approvedDate: new Date().toISOString() } : t
        )
    })),

    rejectTransfer: (id) => set((state) => ({
        assetTransfers: state.assetTransfers.map((t) =>
            t.id === id ? { ...t, status: 'Cancelled' as const } : t
        )
    })),

    // Notification Actions
    markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
        )
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
