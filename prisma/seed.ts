import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = 'postgresql://neondb_owner:npg_KQT9Gk7cHUId@ep-odd-tree-a43m83k9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
console.log('Connecting to Neon PostgreSQL...');

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Create Locations
    const campus = await prisma.location.upsert({
        where: { code: 'MAIN' },
        update: {},
        create: {
            name: 'Main Campus',
            type: 'Campus',
            code: 'MAIN',
            address: '123 University Road, City',
            isActive: true,
        },
    });

    const building1 = await prisma.location.upsert({
        where: { code: 'ADMIN-BLK' },
        update: {},
        create: {
            name: 'Administrative Block',
            type: 'Building',
            code: 'ADMIN-BLK',
            parentId: campus.id,
            isActive: true,
        },
    });

    const building2 = await prisma.location.upsert({
        where: { code: 'IT-BLK' },
        update: {},
        create: {
            name: 'IT Block',
            type: 'Building',
            code: 'IT-BLK',
            parentId: campus.id,
            isActive: true,
        },
    });

    // Create Colleges
    const medicalCollege = await prisma.college.upsert({
        where: { code: 'CMS' },
        update: {},
        create: {
            name: 'College of Medical Sciences',
            code: 'CMS',
            shortName: 'Medical',
            locationId: campus.id,
            isActive: true,
        },
    });

    const dentalCollege = await prisma.college.upsert({
        where: { code: 'SDS' },
        update: {},
        create: {
            name: 'School of Dental Sciences',
            code: 'SDS',
            shortName: 'Dental',
            locationId: campus.id,
            isActive: true,
        },
    });

    const nursingCollege = await prisma.college.upsert({
        where: { code: 'KCNS' },
        update: {},
        create: {
            name: 'Krishna College of Nursing Sciences',
            code: 'KCNS',
            shortName: 'Nursing',
            locationId: campus.id,
            isActive: true,
        },
    });

    // Create Hospital
    const mainHospital = await prisma.hospital.upsert({
        where: { code: 'KMH' },
        update: {},
        create: {
            name: 'Krishna Medical Hospital',
            code: 'KMH',
            shortName: 'KMH',
            locationId: campus.id,
            isActive: true,
        },
    });

    // Create Departments
    const itDept = await prisma.department.upsert({
        where: { code: 'ICT' },
        update: {},
        create: {
            name: 'Information & Communication Technology',
            code: 'ICT',
            type: 'NonTeaching',
            locationId: building2.id,
            budget: 5000000,
            isActive: true,
        },
    });

    const adminDept = await prisma.department.upsert({
        where: { code: 'ADMIN' },
        update: {},
        create: {
            name: 'Administration',
            code: 'ADMIN',
            type: 'NonTeaching',
            locationId: building1.id,
            budget: 2000000,
            isActive: true,
        },
    });

    const hrDept = await prisma.department.upsert({
        where: { code: 'HR' },
        update: {},
        create: {
            name: 'Human Resources',
            code: 'HR',
            type: 'NonTeaching',
            locationId: building1.id,
            budget: 1500000,
            isActive: true,
        },
    });

    // Academic department under Medical College
    const anatomyDept = await prisma.department.upsert({
        where: { code: 'ANAT' },
        update: {},
        create: {
            name: 'Anatomy',
            code: 'ANAT',
            type: 'Academic',
            collegeId: medicalCollege.id,
            budget: 1000000,
            isActive: true,
        },
    });

    // Hospital department
    const emergencyDept = await prisma.department.upsert({
        where: { code: 'EMERG' },
        update: {},
        create: {
            name: 'Emergency Department',
            code: 'EMERG',
            type: 'Hospital',
            hospitalId: mainHospital.id,
            budget: 3000000,
            isActive: true,
        },
    });

    // Create Super Admin User
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@company.com' },
        update: { password: adminPassword },
        create: {
            employeeId: 'EMP001',
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@company.com',
            password: adminPassword,
            phone: '+91-9876543210',
            role: 'Super Admin',
            departmentId: adminDept.id,
            locationId: building1.id,
            designation: 'System Administrator',
            isActive: true,
        },
    });

    // Create College Admin
    const collegeAdmin = await prisma.user.upsert({
        where: { email: 'college.admin@company.com' },
        update: { password: userPassword },
        create: {
            employeeId: 'EMP002',
            firstName: 'Priya',
            lastName: 'Singh',
            email: 'college.admin@company.com',
            password: userPassword,
            phone: '+91-9876543211',
            role: 'College Admin',
            collegeId: medicalCollege.id,
            departmentId: anatomyDept.id,
            locationId: building2.id,
            designation: 'College Administrator',
            isActive: true,
        },
    });

    // Create Asset Manager
    const assetManager = await prisma.user.upsert({
        where: { email: 'asset.manager@company.com' },
        update: { password: userPassword },
        create: {
            employeeId: 'EMP003',
            firstName: 'Amit',
            lastName: 'Kumar',
            email: 'asset.manager@company.com',
            password: userPassword,
            phone: '+91-9876543212',
            role: 'Asset Manager',
            departmentId: itDept.id,
            locationId: building2.id,
            designation: 'IT Asset Manager',
            isActive: true,
        },
    });

    // Create Vendors
    const dellVendor = await prisma.vendor.upsert({
        where: { code: 'VND-DELL' },
        update: {},
        create: {
            name: 'Dell Technologies',
            code: 'VND-DELL',
            type: 'Supplier',
            contactPerson: 'John Smith',
            email: 'sales@dell.com',
            phone: '+1-800-624-9896',
            address: 'Round Rock, Texas, USA',
            gstNumber: '07AAACR5055K1ZM',
            rating: 4.5,
            isActive: true,
        },
    });

    const hpVendor = await prisma.vendor.upsert({
        where: { code: 'VND-HP' },
        update: {},
        create: {
            name: 'HP Inc.',
            code: 'VND-HP',
            type: 'Supplier',
            contactPerson: 'Jane Doe',
            email: 'sales@hp.com',
            phone: '+1-800-474-6836',
            address: 'Palo Alto, California, USA',
            gstNumber: '07AAACH2702H1ZG',
            rating: 4.3,
            isActive: true,
        },
    });

    // Create Assets
    await prisma.asset.upsert({
        where: { assetId: 'AST-IT-001' },
        update: {},
        create: {
            assetId: 'AST-IT-001',
            name: 'Dell OptiPlex 7090',
            description: 'Desktop Workstation',
            category: 'IT',
            subCategory: 'Computer',
            assetType: 'Desktop',
            make: 'Dell',
            model: 'OptiPlex 7090',
            serialNumber: 'DLL7090001',
            status: 'Active',
            condition: 'Excellent',
            purchaseDate: new Date('2024-01-15'),
            purchasePrice: 85000,
            currentValue: 75000,
            locationId: building2.id,
            departmentId: itDept.id,
            assignedToId: assetManager.id,
            vendorId: dellVendor.id,
        },
    });

    await prisma.asset.upsert({
        where: { assetId: 'AST-IT-002' },
        update: {},
        create: {
            assetId: 'AST-IT-002',
            name: 'HP ProBook 450 G8',
            description: 'Business Laptop',
            category: 'IT',
            subCategory: 'Computer',
            assetType: 'Laptop',
            make: 'HP',
            model: 'ProBook 450 G8',
            serialNumber: 'HPP450G8002',
            status: 'Active',
            condition: 'Good',
            purchaseDate: new Date('2024-03-01'),
            purchasePrice: 65000,
            currentValue: 58000,
            locationId: building1.id,
            departmentId: adminDept.id,
            vendorId: hpVendor.id,
        },
    });

    console.log('✅ Seeding complete!');
    console.log(`Created:
  - ${await prisma.location.count()} locations
  - ${await prisma.college.count()} colleges
  - ${await prisma.hospital.count()} hospitals
  - ${await prisma.department.count()} departments
  - ${await prisma.user.count()} users (with passwords)
  - ${await prisma.vendor.count()} vendors
  - ${await prisma.asset.count()} assets`);

    console.log('\n📋 Test Credentials:');
    console.log('  Super Admin: admin@company.com / admin123');
    console.log('  College Admin: college.admin@company.com / user123');
    console.log('  Asset Manager: asset.manager@company.com / user123');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
