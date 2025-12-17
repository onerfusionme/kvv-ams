import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
    try {
        const [
            totalAssets,
            activeAssets,
            assetsUnderMaintenance,
            totalUsers,
            totalDepartments,
            totalVendors,
            pendingMaintenanceTickets,
            totalMaintenanceCost,
        ] = await Promise.all([
            prisma.asset.count(),
            prisma.asset.count({ where: { status: 'Active' } }),
            prisma.asset.count({ where: { status: 'Under-Maintenance' } }),
            prisma.user.count(),
            prisma.department.count(),
            prisma.vendor.count(),
            prisma.maintenanceRecord.count({ where: { status: { in: ['Scheduled', 'In-Progress'] } } }),
            prisma.maintenanceRecord.aggregate({ _sum: { cost: true } }),
        ]);

        // Assets by category
        const assetsByCategory = await prisma.asset.groupBy({
            by: ['category'],
            _count: { id: true },
        });

        // Assets by status
        const assetsByStatus = await prisma.asset.groupBy({
            by: ['status'],
            _count: { id: true },
        });

        // Total asset value
        const totalAssetValue = await prisma.asset.aggregate({
            _sum: { currentValue: true },
        });

        return NextResponse.json({
            totalAssets,
            activeAssets,
            assetsUnderMaintenance,
            assetsInRepair: await prisma.asset.count({ where: { status: 'In-Repair' } }),
            totalUsers,
            totalDepartments,
            totalVendors,
            pendingMaintenanceTickets,
            totalMaintenanceCost: totalMaintenanceCost._sum.cost || 0,
            totalAssetValue: totalAssetValue._sum.currentValue || 0,
            assetsByCategory: assetsByCategory.map(c => ({
                category: c.category,
                count: c._count.id,
            })),
            assetsByStatus: assetsByStatus.map(s => ({
                status: s.status,
                count: s._count.id,
            })),
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
