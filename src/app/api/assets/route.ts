import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth, isAdmin, canManageAssets } from '@/lib/auth-utils';

// GET /api/assets - Get all assets (any authenticated user can view)
export async function GET(request: NextRequest) {
    try {
        const { user, error } = await withAuth(request);
        if (error) return error;

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const departmentId = searchParams.get('departmentId');
        const locationId = searchParams.get('locationId');

        const where: Record<string, unknown> = {};
        if (category) where.category = category;
        if (status) where.status = status;
        if (departmentId) where.departmentId = departmentId;
        if (locationId) where.locationId = locationId;

        // Non-admins can only see assets in their department
        if (!isAdmin(user) && user?.departmentId) {
            where.departmentId = user.departmentId;
        }

        const assets = await prisma.asset.findMany({
            where,
            include: {
                department: true,
                location: true,
                vendor: true,
                assignedTo: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(assets);
    } catch (error) {
        console.error('Error fetching assets:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'Failed to fetch assets', details: errorMessage }, { status: 500 });
    }
}

// POST /api/assets - Create new asset (Asset Manager or higher)
export async function POST(request: NextRequest) {
    try {
        // Only Asset Managers and above can create assets
        const { user, error } = await withAuth(request, 'asset_manager');
        if (error) return error;

        const body = await request.json();

        const asset = await prisma.asset.create({
            data: {
                assetId: body.assetId,
                name: body.name,
                description: body.description,
                category: body.category,
                subCategory: body.subCategory,
                assetType: body.assetType,
                make: body.make,
                model: body.model,
                serialNumber: body.serialNumber,
                tagType: body.tagType,
                tagId: body.tagId,
                status: body.status || 'Active',
                condition: body.condition || 'Good',
                purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
                purchasePrice: body.purchasePrice || 0,
                currentValue: body.currentValue || body.purchasePrice || 0,
                warrantyStartDate: body.warrantyStartDate ? new Date(body.warrantyStartDate) : null,
                warrantyEndDate: body.warrantyEndDate ? new Date(body.warrantyEndDate) : null,
                depreciationMethod: body.depreciationMethod,
                depreciationRate: body.depreciationRate || 0,
                usefulLife: body.usefulLife || 5,
                salvageValue: body.salvageValue || 0,
                locationId: body.locationId,
                departmentId: body.departmentId,
                assignedToId: body.assignedToId,
                vendorId: body.vendorId,
                createdById: user?.id,
                specifications: body.specifications ? JSON.stringify(body.specifications) : null,
                images: body.images ? JSON.stringify(body.images) : null,
            },
        });

        return NextResponse.json(asset, { status: 201 });
    } catch (error) {
        console.error('Error creating asset:', error);
        return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
    }
}
