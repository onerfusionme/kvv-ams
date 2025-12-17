// Asset Management System - Type Definitions

export type AssetCategory = 'IT' | 'Academic' | 'Hospital' | 'Infrastructure';
export type AssetStatus = 'Active' | 'In-Repair' | 'Idle' | 'Condemned' | 'Disposed' | 'Under-Maintenance';
export type AssetCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
export type TagType = 'Barcode' | 'QR' | 'RFID';
export type DepreciationMethod = 'SLM' | 'WDV';
export type MaintenanceType = 'Preventive' | 'Breakdown' | 'Corrective' | 'Predictive';
export type MaintenanceStatus = 'Scheduled' | 'In-Progress' | 'Completed' | 'Overdue' | 'Cancelled';
export type AuditStatus = 'Planned' | 'In-Progress' | 'Completed' | 'Pending-Review';
export type UserRole = 'Super Admin' | 'Asset Manager' | 'Department Admin' | 'Auditor' | 'Technician' | 'User';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Escalated';
export type ContractType = 'AMC' | 'CMC' | 'Warranty';
export type NotificationType = 'Warning' | 'Alert' | 'Info' | 'Success';
export type ComplianceType = 'NABH' | 'NABL' | 'NAAC' | 'ISO' | 'Other';

// Asset Master
export interface Asset {
    id: string;
    assetId: string;
    name: string;
    description: string;
    category: AssetCategory;
    subCategory: string;
    assetType: string;
    make: string;
    model: string;
    serialNumber: string;
    tagType: TagType;
    tagId: string;
    status: AssetStatus;
    condition: AssetCondition;
    purchaseDate: string;
    purchasePrice: number;
    currentValue: number;
    warrantyStartDate: string;
    warrantyEndDate: string;
    depreciationMethod: DepreciationMethod;
    depreciationRate: number;
    usefulLife: number;
    salvageValue: number;
    locationId: string;
    departmentId: string;
    assignedToId: string | null;
    vendorId: string;
    purchaseOrderId: string;
    specifications: Record<string, string>;
    images: string[];
    documents: Document[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

// Location Hierarchy
export interface Location {
    id: string;
    name: string;
    type: 'Campus' | 'Building' | 'Floor' | 'Room' | 'Zone';
    parentId: string | null;
    code: string;
    address?: string;
    gpsCoordinates?: { lat: number; lng: number };
    capacity?: number;
    isActive: boolean;
}

// Department
export interface Department {
    id: string;
    name: string;
    code: string;
    headId: string;
    locationId: string;
    parentDepartmentId: string | null;
    budget: number;
    assetCount: number;
    isActive: boolean;
}

// User/Employee
export interface User {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    departmentId: string;
    locationId: string;
    designation: string;
    avatar?: string;
    isActive: boolean;
    permissions: string[];
    lastLogin?: string;
}

// Vendor/Supplier
export interface Vendor {
    id: string;
    name: string;
    code: string;
    type: 'Supplier' | 'Service Provider' | 'Both';
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    gstNumber: string;
    panNumber: string;
    rating: number;
    isActive: boolean;
    contracts: Contract[];
}

// Contract (AMC/CMC/Warranty)
export interface Contract {
    id: string;
    contractNumber: string;
    type: ContractType;
    vendorId: string;
    assetIds: string[];
    startDate: string;
    endDate: string;
    value: number;
    terms: string;
    documents: Document[];
    status: 'Active' | 'Expired' | 'Pending-Renewal';
    renewalReminderDays: number;
}

// Maintenance
export interface MaintenanceRecord {
    id: string;
    ticketNumber: string;
    assetId: string;
    type: MaintenanceType;
    status: MaintenanceStatus;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    reportedBy: string;
    reportedDate: string;
    assignedTo: string;
    scheduledDate: string;
    completedDate?: string;
    resolution?: string;
    cost: number;
    spareParts: SparePart[];
    downtime: number;
    vendorId?: string;
    documents: Document[];
}

// Spare Part
export interface SparePart {
    id: string;
    name: string;
    partNumber: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
}

// Asset Transfer
export interface AssetTransfer {
    id: string;
    assetId: string;
    fromLocationId: string;
    toLocationId: string;
    fromDepartmentId: string;
    toDepartmentId: string;
    fromUserId: string | null;
    toUserId: string | null;
    transferType: 'Permanent' | 'Temporary';
    reason: string;
    requestedBy: string;
    requestedDate: string;
    approvalStatus: ApprovalStatus;
    approvedBy?: string;
    approvedDate?: string;
    transferDate?: string;
    remarks?: string;
}

// Asset Audit
export interface AssetAudit {
    id: string;
    auditNumber: string;
    name: string;
    type: 'Annual' | 'Quarterly' | 'Monthly' | 'Ad-hoc';
    status: AuditStatus;
    locationId: string;
    departmentId?: string;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate?: string;
    actualEndDate?: string;
    auditorId: string;
    totalAssets: number;
    verifiedAssets: number;
    missingAssets: number;
    excessAssets: number;
    discrepancies: AuditDiscrepancy[];
    remarks?: string;
}

// Audit Discrepancy
export interface AuditDiscrepancy {
    id: string;
    auditId: string;
    assetId: string;
    type: 'Missing' | 'Excess' | 'Wrong-Location' | 'Condition-Mismatch' | 'Data-Mismatch';
    description: string;
    resolution?: string;
    resolvedDate?: string;
    resolvedBy?: string;
}

// Purchase Order
export interface PurchaseOrder {
    id: string;
    poNumber: string;
    vendorId: string;
    orderDate: string;
    expectedDelivery: string;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Ordered' | 'Received' | 'Closed';
    items: PurchaseOrderItem[];
    totalAmount: number;
    grnId?: string;
    remarks?: string;
}

export interface PurchaseOrderItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    receivedQuantity: number;
}

// Goods Receipt Note
export interface GoodsReceiptNote {
    id: string;
    grnNumber: string;
    poId: string;
    vendorId: string;
    receiptDate: string;
    receivedBy: string;
    items: GRNItem[];
    qualityCheck: 'Passed' | 'Failed' | 'Pending';
    remarks?: string;
}

export interface GRNItem {
    id: string;
    poItemId: string;
    receivedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
    condition: AssetCondition;
}

// Document
export interface Document {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
    uploadedBy: string;
    uploadedAt: string;
}

// Notification
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    category: 'Warranty' | 'AMC' | 'Maintenance' | 'Audit' | 'Transfer' | 'Compliance' | 'System';
    relatedId?: string;
    relatedType?: string;
    isRead: boolean;
    createdAt: string;
    userId: string;
}

// Compliance Record
export interface ComplianceRecord {
    id: string;
    assetId: string;
    type: ComplianceType;
    standard: string;
    certificateNumber?: string;
    issueDate: string;
    expiryDate: string;
    status: 'Valid' | 'Expired' | 'Pending-Renewal';
    documents: Document[];
    remarks?: string;
}

// Calibration Record
export interface CalibrationRecord {
    id: string;
    assetId: string;
    calibrationDate: string;
    nextDueDate: string;
    calibratedBy: string;
    certificateNumber: string;
    result: 'Pass' | 'Fail' | 'Conditional';
    deviations?: string;
    documents: Document[];
}

// Disposal Record
export interface DisposalRecord {
    id: string;
    assetId: string;
    disposalMethod: 'Scrap' | 'Auction' | 'Trade-In' | 'Donation' | 'E-Waste';
    condemnationDate: string;
    condemnationCommittee: string[];
    approvalStatus: ApprovalStatus;
    approvedBy?: string;
    approvedDate?: string;
    disposalDate?: string;
    disposalValue?: number;
    bookValue: number;
    gainLoss?: number;
    buyerDetails?: string;
    certificateNumber?: string;
    environmentalCompliance: boolean;
    documents: Document[];
    remarks?: string;
}

// Dashboard Statistics
export interface DashboardStats {
    totalAssets: number;
    totalUsers: number;
    activeAssets: number;
    assetsUnderMaintenance: number;
    assetsInRepair: number;
    idleAssets: number;
    condemnedAssets: number;
    disposedAssets: number;
    totalValue: number;
    depreciatedValue: number;
    maintenanceCostMTD: number;
    maintenanceCostYTD: number;
    warrantyExpiringSoon: number;
    amcExpiringSoon: number;
    calibrationDueSoon: number;
    pendingTransfers: number;
    pendingAudits: number;
    complianceIssues: number;
}

// Category Statistics
export interface CategoryStats {
    category: AssetCategory;
    count: number;
    value: number;
    depreciatedValue: number;
    maintenanceCost: number;
}

// Report Types
export interface Report {
    id: string;
    name: string;
    type: string;
    generatedAt: string;
    generatedBy: string;
    parameters: Record<string, unknown>;
    fileUrl: string;
}

// Activity Log
export interface ActivityLog {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    details: string;
    ipAddress: string;
    timestamp: string;
}

// Software License (IT Assets)
export interface SoftwareLicense {
    id: string;
    name: string;
    vendor: string;
    licenseKey: string;
    licenseType: 'Perpetual' | 'Subscription' | 'Volume' | 'OEM';
    purchaseDate: string;
    expiryDate?: string;
    totalSeats: number;
    usedSeats: number;
    assignedAssetIds: string[];
    cost: number;
    status: 'Active' | 'Expired' | 'Expiring-Soon';
}

// IT Asset Extended Details
export interface ITAssetDetails {
    assetId: string;
    ipAddress?: string;
    macAddress?: string;
    hostname?: string;
    operatingSystem?: string;
    osVersion?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    installedSoftware: string[];
    lastScanned?: string;
    antivirus?: string;
    domainJoined?: boolean;
    intuneManagedId?: string;
}

// Hospital/Lab Asset Extended Details
export interface MedicalAssetDetails {
    assetId: string;
    biomedicalId?: string;
    equipmentClass: 'Class-I' | 'Class-II' | 'Class-III' | 'Class-IV';
    riskCategory: 'Low' | 'Medium' | 'High' | 'Critical';
    fdaApproval?: string;
    ceMarking?: boolean;
    lastCalibrationDate?: string;
    nextCalibrationDate?: string;
    maintenanceFrequency: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
    safetyDocuments: Document[];
    usageHours?: number;
    patientContact: boolean;
}
