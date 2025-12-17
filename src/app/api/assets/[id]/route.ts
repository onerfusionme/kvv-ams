import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/auth-utils';

// GET /api/assets/[id] - Get single asset (any authenticated user)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { error } = await withAuth(request);
        if (error) return error;

        const { id } = await params;

        const asset = await prisma.asset.findUnique({
            where: { id },
            include: {
                department: true,
                location: true,
                vendor: true,
                assignedTo: true,
                maintenance: true,
                transfers: true,
            },
        });

        if (!asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        return NextResponse.json(asset);
    } catch (error) {
        console.error('Error fetching asset:', error);
        return NextResponse.json({ error: 'Failed to fetch asset' }, { status: 500 });
    }
}

// PUT /api/assets/[id] - Update asset (Asset Manager or higher)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Only Asset Managers and above can update assets
        const { error } = await withAuth(request, 'asset_manager');
        if (error) return error;

        const { id } = await params;
        const body = await request.json();

        const asset = await prisma.asset.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                category: body.category,
                subCategory: body.subCategory,
                status: body.status,
                condition: body.condition,
                currentValue: body.currentValue,
                locationId: body.locationId,
                departmentId: body.departmentId,
                assignedToId: body.assignedToId,
            },
        });

        return NextResponse.json(asset);
    } catch (error) {
        console.error('Error updating asset:', error);
        return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
    }
}

// DELETE /api/assets/[id] - Delete asset (Admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Only Admins can delete assets
        const { error } = await withAuth(request, 'admin');
        if (error) return error;

        const { id } = await params;

        await prisma.asset.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        console.error('Error deleting asset:', error);
        return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
    }
}
