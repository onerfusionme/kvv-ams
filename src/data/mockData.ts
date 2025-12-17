// Mock Data for Asset Management System
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
    CategoryStats,
    SoftwareLicense,
    DisposalRecord,
    ComplianceRecord,
    CalibrationRecord,
} from '@/types';

// Locations
export const locations: Location[] = [
    { id: 'loc-1', name: 'Main Campus', type: 'Campus', parentId: null, code: 'MC', address: '123 University Ave', isActive: true },
    { id: 'loc-2', name: 'Science Building', type: 'Building', parentId: 'loc-1', code: 'MC-SB', isActive: true },
    { id: 'loc-3', name: 'Engineering Block', type: 'Building', parentId: 'loc-1', code: 'MC-EB', isActive: true },
    { id: 'loc-4', name: 'Medical Campus', type: 'Campus', parentId: null, code: 'MED', address: '456 Health St', isActive: true },
    { id: 'loc-5', name: 'Hospital Main', type: 'Building', parentId: 'loc-4', code: 'MED-HM', isActive: true },
    { id: 'loc-6', name: 'Admin Building', type: 'Building', parentId: 'loc-1', code: 'MC-AB', isActive: true },
    { id: 'loc-7', name: 'Floor 1', type: 'Floor', parentId: 'loc-2', code: 'MC-SB-F1', isActive: true },
    { id: 'loc-8', name: 'Floor 2', type: 'Floor', parentId: 'loc-2', code: 'MC-SB-F2', isActive: true },
    { id: 'loc-9', name: 'Lab 101', type: 'Room', parentId: 'loc-7', code: 'MC-SB-F1-101', isActive: true },
    { id: 'loc-10', name: 'Lab 102', type: 'Room', parentId: 'loc-7', code: 'MC-SB-F1-102', isActive: true },
    { id: 'loc-11', name: 'ICU Ward', type: 'Room', parentId: 'loc-5', code: 'MED-HM-ICU', isActive: true },
    { id: 'loc-12', name: 'Radiology', type: 'Room', parentId: 'loc-5', code: 'MED-HM-RAD', isActive: true },
];

// Departments
export const departments: Department[] = [
    { id: 'dept-1', name: 'Computer Science', code: 'CS', headId: 'user-2', locationId: 'loc-3', parentDepartmentId: null, budget: 5000000, assetCount: 245, isActive: true },
    { id: 'dept-2', name: 'Electrical Engineering', code: 'EE', headId: 'user-3', locationId: 'loc-3', parentDepartmentId: null, budget: 4500000, assetCount: 189, isActive: true },
    { id: 'dept-3', name: 'Physics', code: 'PHY', headId: 'user-4', locationId: 'loc-2', parentDepartmentId: null, budget: 3500000, assetCount: 156, isActive: true },
    { id: 'dept-4', name: 'Chemistry', code: 'CHEM', headId: 'user-5', locationId: 'loc-2', parentDepartmentId: null, budget: 3800000, assetCount: 203, isActive: true },
    { id: 'dept-5', name: 'Cardiology', code: 'CARD', headId: 'user-6', locationId: 'loc-5', parentDepartmentId: null, budget: 15000000, assetCount: 87, isActive: true },
    { id: 'dept-6', name: 'Radiology', code: 'RAD', headId: 'user-7', locationId: 'loc-5', parentDepartmentId: null, budget: 25000000, assetCount: 45, isActive: true },
    { id: 'dept-7', name: 'IT Services', code: 'ITS', headId: 'user-8', locationId: 'loc-6', parentDepartmentId: null, budget: 8000000, assetCount: 567, isActive: true },
    { id: 'dept-8', name: 'Administration', code: 'ADMIN', headId: 'user-9', locationId: 'loc-6', parentDepartmentId: null, budget: 2000000, assetCount: 123, isActive: true },
];

// Users
export const users: User[] = [
    { id: 'user-1', employeeId: 'EMP001', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.kumar@university.edu', phone: '+91-9876543210', role: 'Super Admin', departmentId: 'dept-7', locationId: 'loc-6', designation: 'Director - IT', isActive: true, permissions: ['*'], avatar: '/avatars/admin.png' },
    { id: 'user-2', employeeId: 'EMP002', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@university.edu', phone: '+91-9876543211', role: 'Asset Manager', departmentId: 'dept-1', locationId: 'loc-3', designation: 'HOD - Computer Science', isActive: true, permissions: ['assets.*', 'maintenance.*', 'reports.*'] },
    { id: 'user-3', employeeId: 'EMP003', firstName: 'Amit', lastName: 'Patel', email: 'amit.patel@university.edu', phone: '+91-9876543212', role: 'Department Admin', departmentId: 'dept-2', locationId: 'loc-3', designation: 'HOD - Electrical Engineering', isActive: true, permissions: ['assets.view', 'assets.request', 'maintenance.request'] },
    { id: 'user-4', employeeId: 'EMP004', firstName: 'Sunita', lastName: 'Verma', email: 'sunita.verma@university.edu', phone: '+91-9876543213', role: 'Department Admin', departmentId: 'dept-3', locationId: 'loc-2', designation: 'HOD - Physics', isActive: true, permissions: ['assets.view', 'assets.request', 'maintenance.request'] },
    { id: 'user-5', employeeId: 'EMP005', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@university.edu', phone: '+91-9876543214', role: 'Department Admin', departmentId: 'dept-4', locationId: 'loc-2', designation: 'HOD - Chemistry', isActive: true, permissions: ['assets.view', 'assets.request', 'maintenance.request'] },
    { id: 'user-6', employeeId: 'EMP006', firstName: 'Dr. Meera', lastName: 'Reddy', email: 'meera.reddy@hospital.edu', phone: '+91-9876543215', role: 'Department Admin', departmentId: 'dept-5', locationId: 'loc-5', designation: 'HOD - Cardiology', isActive: true, permissions: ['assets.view', 'assets.request', 'maintenance.request', 'compliance.*'] },
    { id: 'user-7', employeeId: 'EMP007', firstName: 'Dr. Arun', lastName: 'Joshi', email: 'arun.joshi@hospital.edu', phone: '+91-9876543216', role: 'Department Admin', departmentId: 'dept-6', locationId: 'loc-5', designation: 'HOD - Radiology', isActive: true, permissions: ['assets.view', 'assets.request', 'maintenance.request', 'compliance.*'] },
    { id: 'user-8', employeeId: 'EMP008', firstName: 'Kavitha', lastName: 'Nair', email: 'kavitha.nair@university.edu', phone: '+91-9876543217', role: 'Asset Manager', departmentId: 'dept-7', locationId: 'loc-6', designation: 'IT Asset Manager', isActive: true, permissions: ['assets.*', 'maintenance.*', 'reports.*', 'audit.*'] },
    { id: 'user-9', employeeId: 'EMP009', firstName: 'Rahul', lastName: 'Gupta', email: 'rahul.gupta@university.edu', phone: '+91-9876543218', role: 'Auditor', departmentId: 'dept-8', locationId: 'loc-6', designation: 'Internal Auditor', isActive: true, permissions: ['assets.view', 'audit.*', 'reports.*'] },
    { id: 'user-10', employeeId: 'EMP010', firstName: 'Suresh', lastName: 'Menon', email: 'suresh.menon@university.edu', phone: '+91-9876543219', role: 'Technician', departmentId: 'dept-7', locationId: 'loc-6', designation: 'Senior Technician', isActive: true, permissions: ['assets.view', 'maintenance.*'] },
];

// Vendors
export const vendors: Vendor[] = [
    { id: 'vendor-1', name: 'Dell Technologies India', code: 'DELL', type: 'Both', contactPerson: 'Ajay Mehta', email: 'ajay.mehta@dell.com', phone: '+91-8001234567', address: 'Bangalore, Karnataka', gstNumber: '29AABCD1234E1Z5', panNumber: 'AABCD1234E', rating: 4.5, isActive: true, contracts: [] },
    { id: 'vendor-2', name: 'HP India Sales Pvt Ltd', code: 'HP', type: 'Both', contactPerson: 'Sneha Kapoor', email: 'sneha.kapoor@hp.com', phone: '+91-8001234568', address: 'Mumbai, Maharashtra', gstNumber: '27AABCH1234F1Z6', panNumber: 'AABCH1234F', rating: 4.3, isActive: true, contracts: [] },
    { id: 'vendor-3', name: 'Siemens Healthcare', code: 'SIEM', type: 'Both', contactPerson: 'Dr. Ravi Kumar', email: 'ravi.kumar@siemens.com', phone: '+91-8001234569', address: 'Gurgaon, Haryana', gstNumber: '06AABCS1234G1Z7', panNumber: 'AABCS1234G', rating: 4.8, isActive: true, contracts: [] },
    { id: 'vendor-4', name: 'GE Healthcare India', code: 'GE', type: 'Both', contactPerson: 'Anita Desai', email: 'anita.desai@ge.com', phone: '+91-8001234570', address: 'Bangalore, Karnataka', gstNumber: '29AABCG1234H1Z8', panNumber: 'AABCG1234H', rating: 4.6, isActive: true, contracts: [] },
    { id: 'vendor-5', name: 'Thermo Fisher Scientific', code: 'TFS', type: 'Supplier', contactPerson: 'Michael Chen', email: 'michael.chen@thermofisher.com', phone: '+91-8001234571', address: 'Mumbai, Maharashtra', gstNumber: '27AABCT1234I1Z9', panNumber: 'AABCT1234I', rating: 4.4, isActive: true, contracts: [] },
    { id: 'vendor-6', name: 'Agilent Technologies', code: 'AGIL', type: 'Both', contactPerson: 'Prashant Rao', email: 'prashant.rao@agilent.com', phone: '+91-8001234572', address: 'Bangalore, Karnataka', gstNumber: '29AABCA1234J1Z0', panNumber: 'AABCA1234J', rating: 4.2, isActive: true, contracts: [] },
    { id: 'vendor-7', name: 'Cisco Systems India', code: 'CISCO', type: 'Both', contactPerson: 'Deepak Sharma', email: 'deepak.sharma@cisco.com', phone: '+91-8001234573', address: 'Bangalore, Karnataka', gstNumber: '29AABCC1234K1Z1', panNumber: 'AABCC1234K', rating: 4.7, isActive: true, contracts: [] },
];

// Assets
export const assets: Asset[] = [
    {
        id: 'asset-1', assetId: 'IT-2024-001', name: 'Dell OptiPlex 7090', description: 'Desktop Computer for Faculty Use',
        category: 'IT', subCategory: 'Desktop', assetType: 'Computer', make: 'Dell', model: 'OptiPlex 7090',
        serialNumber: 'DELLOP7090001', tagType: 'QR', tagId: 'QR-IT-001', status: 'Active', condition: 'Excellent',
        purchaseDate: '2024-01-15', purchasePrice: 85000, currentValue: 72250, warrantyStartDate: '2024-01-15',
        warrantyEndDate: '2027-01-14', depreciationMethod: 'SLM', depreciationRate: 15, usefulLife: 5, salvageValue: 8500,
        locationId: 'loc-9', departmentId: 'dept-1', assignedToId: 'user-2', vendorId: 'vendor-1', purchaseOrderId: 'PO-2024-001',
        specifications: { processor: 'Intel Core i7-11700', ram: '16GB DDR4', storage: '512GB NVMe SSD', graphics: 'Intel UHD 750' },
        images: [], documents: [], createdAt: '2024-01-16', updatedAt: '2024-06-15', createdBy: 'user-1'
    },
    {
        id: 'asset-2', assetId: 'IT-2024-002', name: 'HP ProBook 450 G8', description: 'Laptop for Research Staff',
        category: 'IT', subCategory: 'Laptop', assetType: 'Computer', make: 'HP', model: 'ProBook 450 G8',
        serialNumber: 'HPPB450G8002', tagType: 'QR', tagId: 'QR-IT-002', status: 'Active', condition: 'Good',
        purchaseDate: '2024-02-20', purchasePrice: 95000, currentValue: 85500, warrantyStartDate: '2024-02-20',
        warrantyEndDate: '2027-02-19', depreciationMethod: 'SLM', depreciationRate: 15, usefulLife: 5, salvageValue: 9500,
        locationId: 'loc-10', departmentId: 'dept-1', assignedToId: 'user-3', vendorId: 'vendor-2', purchaseOrderId: 'PO-2024-002',
        specifications: { processor: 'Intel Core i5-1135G7', ram: '16GB DDR4', storage: '512GB SSD', display: '15.6" FHD' },
        images: [], documents: [], createdAt: '2024-02-21', updatedAt: '2024-06-10', createdBy: 'user-1'
    },
    {
        id: 'asset-3', assetId: 'MED-2024-001', name: 'Siemens MAGNETOM Altea', description: '1.5T MRI System',
        category: 'Hospital', subCategory: 'Imaging', assetType: 'MRI Scanner', make: 'Siemens', model: 'MAGNETOM Altea 1.5T',
        serialNumber: 'SIEM-MRI-2024-001', tagType: 'RFID', tagId: 'RFID-MED-001', status: 'Active', condition: 'Excellent',
        purchaseDate: '2023-06-01', purchasePrice: 85000000, currentValue: 76500000, warrantyStartDate: '2023-06-01',
        warrantyEndDate: '2028-05-31', depreciationMethod: 'SLM', depreciationRate: 10, usefulLife: 10, salvageValue: 8500000,
        locationId: 'loc-12', departmentId: 'dept-6', assignedToId: null, vendorId: 'vendor-3', purchaseOrderId: 'PO-2023-MED-001',
        specifications: { fieldStrength: '1.5 Tesla', bore: '70cm Open Bore', channels: '48 Channels', gradientStrength: '45mT/m' },
        images: [], documents: [], createdAt: '2023-06-05', updatedAt: '2024-06-01', createdBy: 'user-1'
    },
    {
        id: 'asset-4', assetId: 'MED-2024-002', name: 'GE CARESCAPE Monitor B650', description: 'Patient Monitoring System',
        category: 'Hospital', subCategory: 'Monitoring', assetType: 'Patient Monitor', make: 'GE Healthcare', model: 'CARESCAPE B650',
        serialNumber: 'GE-MON-2024-001', tagType: 'RFID', tagId: 'RFID-MED-002', status: 'Active', condition: 'Good',
        purchaseDate: '2024-03-10', purchasePrice: 1500000, currentValue: 1425000, warrantyStartDate: '2024-03-10',
        warrantyEndDate: '2027-03-09', depreciationMethod: 'SLM', depreciationRate: 15, usefulLife: 7, salvageValue: 150000,
        locationId: 'loc-11', departmentId: 'dept-5', assignedToId: null, vendorId: 'vendor-4', purchaseOrderId: 'PO-2024-MED-002',
        specifications: { display: '15.6" TFT', parameters: 'ECG, SpO2, NIBP, Temp, IBP', connectivity: 'HL7, DICOM', battery: '4 hours' },
        images: [], documents: [], createdAt: '2024-03-12', updatedAt: '2024-06-05', createdBy: 'user-1'
    },
    {
        id: 'asset-5', assetId: 'LAB-2024-001', name: 'Thermo Fisher Spectrometer', description: 'UV-Vis Spectrophotometer',
        category: 'Academic', subCategory: 'Laboratory', assetType: 'Spectrophotometer', make: 'Thermo Fisher', model: 'Evolution 350',
        serialNumber: 'TF-SPEC-2024-001', tagType: 'QR', tagId: 'QR-LAB-001', status: 'Active', condition: 'Excellent',
        purchaseDate: '2024-01-25', purchasePrice: 2500000, currentValue: 2312500, warrantyStartDate: '2024-01-25',
        warrantyEndDate: '2026-01-24', depreciationMethod: 'SLM', depreciationRate: 15, usefulLife: 10, salvageValue: 250000,
        locationId: 'loc-10', departmentId: 'dept-4', assignedToId: null, vendorId: 'vendor-5', purchaseOrderId: 'PO-2024-LAB-001',
        specifications: { wavelengthRange: '190-1100nm', bandwidth: '1.0nm', accuracy: '±0.3nm', detector: 'Silicon Photodiode' },
        images: [], documents: [], createdAt: '2024-01-28', updatedAt: '2024-05-20', createdBy: 'user-1'
    },
    {
        id: 'asset-6', assetId: 'LAB-2024-002', name: 'Agilent Gas Chromatograph', description: 'GC for Organic Analysis',
        category: 'Academic', subCategory: 'Laboratory', assetType: 'Chromatograph', make: 'Agilent', model: '8890 GC System',
        serialNumber: 'AGIL-GC-2024-001', tagType: 'QR', tagId: 'QR-LAB-002', status: 'Under-Maintenance', condition: 'Good',
        purchaseDate: '2023-09-15', purchasePrice: 4500000, currentValue: 4050000, warrantyStartDate: '2023-09-15',
        warrantyEndDate: '2025-09-14', depreciationMethod: 'SLM', depreciationRate: 10, usefulLife: 10, salvageValue: 450000,
        locationId: 'loc-10', departmentId: 'dept-4', assignedToId: null, vendorId: 'vendor-6', purchaseOrderId: 'PO-2023-LAB-002',
        specifications: { inlets: '2 S/SL', detector: 'FID', oven: '450°C Max', carrierGas: 'Helium/Hydrogen/Nitrogen' },
        images: [], documents: [], createdAt: '2023-09-18', updatedAt: '2024-06-12', createdBy: 'user-1'
    },
    {
        id: 'asset-7', assetId: 'IT-2024-003', name: 'Cisco Catalyst 9300', description: 'Core Network Switch',
        category: 'IT', subCategory: 'Network', assetType: 'Switch', make: 'Cisco', model: 'Catalyst 9300-48P',
        serialNumber: 'CISCO-SW-2024-001', tagType: 'Barcode', tagId: 'BC-IT-003', status: 'Active', condition: 'Excellent',
        purchaseDate: '2024-02-01', purchasePrice: 850000, currentValue: 765000, warrantyStartDate: '2024-02-01',
        warrantyEndDate: '2027-01-31', depreciationMethod: 'SLM', depreciationRate: 20, usefulLife: 5, salvageValue: 85000,
        locationId: 'loc-6', departmentId: 'dept-7', assignedToId: null, vendorId: 'vendor-7', purchaseOrderId: 'PO-2024-IT-003',
        specifications: { ports: '48x 1GbE PoE+', uplinks: '4x 10GbE', poe: '437W', throughput: '480 Gbps' },
        images: [], documents: [], createdAt: '2024-02-03', updatedAt: '2024-06-01', createdBy: 'user-1'
    },
    {
        id: 'asset-8', assetId: 'INF-2024-001', name: 'Central AC Unit', description: 'HVAC System for Server Room',
        category: 'Infrastructure', subCategory: 'HVAC', assetType: 'Air Conditioner', make: 'Daikin', model: 'VRV IV',
        serialNumber: 'DAIKIN-HVAC-2024-001', tagType: 'Barcode', tagId: 'BC-INF-001', status: 'Active', condition: 'Good',
        purchaseDate: '2023-11-10', purchasePrice: 1200000, currentValue: 1080000, warrantyStartDate: '2023-11-10',
        warrantyEndDate: '2026-11-09', depreciationMethod: 'SLM', depreciationRate: 10, usefulLife: 15, salvageValue: 120000,
        locationId: 'loc-6', departmentId: 'dept-7', assignedToId: null, vendorId: 'vendor-1', purchaseOrderId: 'PO-2023-INF-001',
        specifications: { capacity: '20 TR', efficiency: 'ISEER 4.5', refrigerant: 'R-410A', coverage: '6000 sq ft' },
        images: [], documents: [], createdAt: '2023-11-12', updatedAt: '2024-05-15', createdBy: 'user-1'
    },
];

// Contracts
export const contracts: Contract[] = [
    { id: 'contract-1', contractNumber: 'AMC-2024-001', type: 'AMC', vendorId: 'vendor-3', assetIds: ['asset-3'], startDate: '2024-06-01', endDate: '2025-05-31', value: 2500000, terms: 'Comprehensive maintenance with 4-hour response time', documents: [], status: 'Active', renewalReminderDays: 60 },
    { id: 'contract-2', contractNumber: 'AMC-2024-002', type: 'AMC', vendorId: 'vendor-6', assetIds: ['asset-6'], startDate: '2024-01-01', endDate: '2024-12-31', value: 450000, terms: 'Annual maintenance with calibration', documents: [], status: 'Active', renewalReminderDays: 45 },
    { id: 'contract-3', contractNumber: 'CMC-2024-001', type: 'CMC', vendorId: 'vendor-4', assetIds: ['asset-4'], startDate: '2024-03-10', endDate: '2025-03-09', value: 75000, terms: 'Parts and labor for repairs', documents: [], status: 'Active', renewalReminderDays: 30 },
];

// Maintenance Records
export const maintenanceRecords: MaintenanceRecord[] = [
    { id: 'maint-1', ticketNumber: 'MT-2024-001', assetId: 'asset-6', type: 'Preventive', status: 'In-Progress', priority: 'Medium', description: 'Annual preventive maintenance and calibration', reportedBy: 'user-5', reportedDate: '2024-06-10', assignedTo: 'user-10', scheduledDate: '2024-06-15', cost: 25000, spareParts: [], downtime: 8, vendorId: 'vendor-6', documents: [] },
    { id: 'maint-2', ticketNumber: 'MT-2024-002', assetId: 'asset-1', type: 'Breakdown', status: 'Completed', priority: 'High', description: 'System not booting - replaced faulty SSD', reportedBy: 'user-2', reportedDate: '2024-05-20', assignedTo: 'user-10', scheduledDate: '2024-05-21', completedDate: '2024-05-22', resolution: 'Replaced 512GB NVMe SSD under warranty', cost: 0, spareParts: [{ id: 'sp-1', name: 'NVMe SSD 512GB', partNumber: 'DELL-SSD-512', quantity: 1, unitCost: 8500, totalCost: 8500 }], downtime: 16, documents: [] },
    { id: 'maint-3', ticketNumber: 'MT-2024-003', assetId: 'asset-3', type: 'Preventive', status: 'Scheduled', priority: 'High', description: 'Quarterly preventive maintenance for MRI', reportedBy: 'user-7', reportedDate: '2024-06-01', assignedTo: 'user-10', scheduledDate: '2024-06-20', cost: 150000, spareParts: [], downtime: 24, vendorId: 'vendor-3', documents: [] },
    { id: 'maint-4', ticketNumber: 'MT-2024-004', assetId: 'asset-7', type: 'Corrective', status: 'Completed', priority: 'Critical', description: 'Network switch port failure affecting connectivity', reportedBy: 'user-8', reportedDate: '2024-05-15', assignedTo: 'user-10', scheduledDate: '2024-05-15', completedDate: '2024-05-16', resolution: 'Firmware update resolved port issues', cost: 0, spareParts: [], downtime: 4, documents: [] },
];

// Asset Transfers
export const assetTransfers: AssetTransfer[] = [
    { id: 'transfer-1', assetId: 'asset-2', fromLocationId: 'loc-9', toLocationId: 'loc-10', fromDepartmentId: 'dept-1', toDepartmentId: 'dept-1', fromUserId: 'user-2', toUserId: 'user-3', transferType: 'Permanent', reason: 'User reassignment', requestedBy: 'user-2', requestedDate: '2024-06-01', approvalStatus: 'Approved', approvedBy: 'user-8', approvedDate: '2024-06-02', transferDate: '2024-06-03', remarks: 'Completed successfully' },
    { id: 'transfer-2', assetId: 'asset-5', fromLocationId: 'loc-9', toLocationId: 'loc-10', fromDepartmentId: 'dept-3', toDepartmentId: 'dept-4', fromUserId: null, toUserId: null, transferType: 'Temporary', reason: 'Joint research project', requestedBy: 'user-4', requestedDate: '2024-06-10', approvalStatus: 'Pending', remarks: 'Awaiting approval from Chemistry Dept' },
];

// Asset Audits
export const assetAudits: AssetAudit[] = [
    { id: 'audit-1', auditNumber: 'AUD-2024-Q2-001', name: 'Q2 IT Assets Verification', type: 'Quarterly', status: 'In-Progress', locationId: 'loc-1', departmentId: 'dept-7', plannedStartDate: '2024-06-01', plannedEndDate: '2024-06-15', actualStartDate: '2024-06-01', auditorId: 'user-9', totalAssets: 567, verifiedAssets: 423, missingAssets: 2, excessAssets: 0, discrepancies: [] },
    { id: 'audit-2', auditNumber: 'AUD-2024-Q2-002', name: 'Medical Equipment Annual Audit', type: 'Annual', status: 'Planned', locationId: 'loc-4', plannedStartDate: '2024-07-01', plannedEndDate: '2024-07-15', auditorId: 'user-9', totalAssets: 132, verifiedAssets: 0, missingAssets: 0, excessAssets: 0, discrepancies: [] },
];

// Notifications
export const notifications: Notification[] = [
    { id: 'notif-1', type: 'Warning', title: 'Warranty Expiring Soon', message: 'Agilent Gas Chromatograph (LAB-2024-002) warranty expires in 90 days', category: 'Warranty', relatedId: 'asset-6', relatedType: 'Asset', isRead: false, createdAt: '2024-06-15T09:00:00', userId: 'user-1' },
    { id: 'notif-2', type: 'Alert', title: 'Maintenance Overdue', message: 'Preventive maintenance for MRI Scanner scheduled for today', category: 'Maintenance', relatedId: 'maint-3', relatedType: 'Maintenance', isRead: false, createdAt: '2024-06-15T08:00:00', userId: 'user-1' },
    { id: 'notif-3', type: 'Info', title: 'Transfer Request', message: 'New asset transfer request pending your approval', category: 'Transfer', relatedId: 'transfer-2', relatedType: 'Transfer', isRead: true, createdAt: '2024-06-10T14:30:00', userId: 'user-1' },
    { id: 'notif-4', type: 'Success', title: 'Audit Completed', message: 'IT Assets Q1 audit completed successfully', category: 'Audit', isRead: true, createdAt: '2024-04-15T16:00:00', userId: 'user-1' },
    { id: 'notif-5', type: 'Warning', title: 'AMC Renewal Due', message: 'AMC contract for GC System expires in 30 days', category: 'AMC', relatedId: 'contract-2', relatedType: 'Contract', isRead: false, createdAt: '2024-06-14T10:00:00', userId: 'user-1' },
];

// Dashboard Statistics
export const dashboardStats: DashboardStats = {
    totalAssets: 1615,
    totalUsers: 15,
    activeAssets: 1423,
    assetsUnderMaintenance: 45,
    assetsInRepair: 28,
    idleAssets: 89,
    condemnedAssets: 23,
    disposedAssets: 7,
    totalValue: 245000000,
    depreciatedValue: 198500000,
    maintenanceCostMTD: 850000,
    maintenanceCostYTD: 12500000,
    warrantyExpiringSoon: 34,
    amcExpiringSoon: 12,
    calibrationDueSoon: 18,
    pendingTransfers: 5,
    pendingAudits: 2,
    complianceIssues: 3,
};

// Category Statistics
export const categoryStats: CategoryStats[] = [
    { category: 'IT', count: 567, value: 48000000, depreciatedValue: 38400000, maintenanceCost: 2400000 },
    { category: 'Academic', count: 548, value: 65000000, depreciatedValue: 52000000, maintenanceCost: 3250000 },
    { category: 'Hospital', count: 377, value: 125000000, depreciatedValue: 100000000, maintenanceCost: 6250000 },
    { category: 'Infrastructure', count: 123, value: 7000000, depreciatedValue: 8100000, maintenanceCost: 600000 },
];

// Software Licenses
export const softwareLicenses: SoftwareLicense[] = [
    { id: 'lic-1', name: 'Microsoft 365 E3', vendor: 'Microsoft', licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX', licenseType: 'Subscription', purchaseDate: '2024-01-01', expiryDate: '2024-12-31', totalSeats: 500, usedSeats: 456, assignedAssetIds: [], cost: 2500000, status: 'Active' },
    { id: 'lic-2', name: 'MATLAB Academic', vendor: 'MathWorks', licenseKey: 'XXXXX-XXXXX-XXXXX', licenseType: 'Subscription', purchaseDate: '2024-01-01', expiryDate: '2024-12-31', totalSeats: 100, usedSeats: 87, assignedAssetIds: [], cost: 800000, status: 'Active' },
    { id: 'lic-3', name: 'AutoCAD LT', vendor: 'Autodesk', licenseKey: 'XXXXX-XXXXX-XXXXX', licenseType: 'Subscription', purchaseDate: '2024-03-01', expiryDate: '2025-02-28', totalSeats: 50, usedSeats: 45, assignedAssetIds: [], cost: 450000, status: 'Active' },
    { id: 'lic-4', name: 'Adobe Creative Cloud', vendor: 'Adobe', licenseKey: 'XXXXX-XXXXX-XXXXX', licenseType: 'Subscription', purchaseDate: '2024-01-15', expiryDate: '2025-01-14', totalSeats: 25, usedSeats: 23, assignedAssetIds: [], cost: 375000, status: 'Active' },
    { id: 'lic-5', name: 'Windows Server 2022', vendor: 'Microsoft', licenseKey: 'XXXXX-XXXXX-XXXXX', licenseType: 'Perpetual', purchaseDate: '2023-06-01', totalSeats: 10, usedSeats: 8, assignedAssetIds: [], cost: 1200000, status: 'Active' },
];

// Disposal Records
export const disposalRecords: DisposalRecord[] = [
    { id: 'disp-1', assetId: 'asset-old-1', disposalMethod: 'E-Waste', condemnationDate: '2024-03-01', condemnationCommittee: ['user-1', 'user-8', 'user-9'], approvalStatus: 'Approved', approvedBy: 'user-1', approvedDate: '2024-03-15', disposalDate: '2024-04-01', disposalValue: 500, bookValue: 0, gainLoss: 500, certificateNumber: 'EWASTE-2024-001', environmentalCompliance: true, documents: [] },
];

// Compliance Records
export const complianceRecords: ComplianceRecord[] = [
    { id: 'comp-1', assetId: 'asset-3', type: 'NABH', standard: 'NABH Hospital Standards', certificateNumber: 'NABH-2024-MRI-001', issueDate: '2024-01-15', expiryDate: '2027-01-14', status: 'Valid', documents: [] },
    { id: 'comp-2', assetId: 'asset-4', type: 'ISO', standard: 'ISO 13485:2016', certificateNumber: 'ISO-2024-MON-001', issueDate: '2024-03-10', expiryDate: '2027-03-09', status: 'Valid', documents: [] },
];

// Calibration Records
export const calibrationRecords: CalibrationRecord[] = [
    { id: 'cal-1', assetId: 'asset-5', calibrationDate: '2024-06-01', nextDueDate: '2024-12-01', calibratedBy: 'vendor-5', certificateNumber: 'CAL-2024-SPEC-001', result: 'Pass', documents: [] },
    { id: 'cal-2', assetId: 'asset-6', calibrationDate: '2024-01-15', nextDueDate: '2025-01-15', calibratedBy: 'vendor-6', certificateNumber: 'CAL-2024-GC-001', result: 'Pass', documents: [] },
];

// Monthly maintenance cost data for charts
export const monthlyMaintenanceCost = [
    { month: 'Jan', cost: 980000, preventive: 650000, breakdown: 330000 },
    { month: 'Feb', cost: 1120000, preventive: 720000, breakdown: 400000 },
    { month: 'Mar', cost: 850000, preventive: 600000, breakdown: 250000 },
    { month: 'Apr', cost: 1250000, preventive: 800000, breakdown: 450000 },
    { month: 'May', cost: 1050000, preventive: 700000, breakdown: 350000 },
    { month: 'Jun', cost: 950000, preventive: 680000, breakdown: 270000 },
];

// Asset value by category for pie chart
export const assetValueByCategory = [
    { name: 'IT Assets', value: 48000000, color: '#6366f1' },
    { name: 'Academic', value: 65000000, color: '#8b5cf6' },
    { name: 'Hospital', value: 125000000, color: '#ec4899' },
    { name: 'Infrastructure', value: 7000000, color: '#14b8a6' },
];

// Asset status distribution
export const assetStatusDistribution = [
    { name: 'Active', value: 1423, color: '#22c55e' },
    { name: 'In-Repair', value: 28, color: '#f59e0b' },
    { name: 'Idle', value: 89, color: '#94a3b8' },
    { name: 'Under-Maintenance', value: 45, color: '#3b82f6' },
    { name: 'Condemned', value: 23, color: '#ef4444' },
    { name: 'Disposed', value: 7, color: '#6b7280' },
];

// Department asset count
export const departmentAssetCount = [
    { department: 'IT Services', count: 567, value: 48000000 },
    { department: 'Computer Science', count: 245, value: 18500000 },
    { department: 'Chemistry', count: 203, value: 28000000 },
    { department: 'Electrical Engineering', count: 189, value: 15000000 },
    { department: 'Physics', count: 156, value: 12000000 },
    { department: 'Administration', count: 123, value: 7000000 },
    { department: 'Cardiology', count: 87, value: 65000000 },
    { department: 'Radiology', count: 45, value: 51500000 },
];
