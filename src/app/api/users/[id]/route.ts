import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/auth-utils';

// GET /api/users/[id] - Any authenticated user can view
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { error } = await withAuth(request);
        if (error) return error;

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                department: true,
                location: true,
                assignedAssets: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

// PUT /api/users/[id] - Admin only
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Only admins can update users
        const { error } = await withAuth(request, 'admin');
        if (error) return error;

        const { id } = await params;
        const body = await request.json();

        const user = await prisma.user.update({
            where: { id },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                role: body.role,
                departmentId: body.departmentId,
                designation: body.designation,
                isActive: body.isActive,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE /api/users/[id] - Super Admin only
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Only Super Admin can delete users
        const { error } = await withAuth(request, 'super_admin');
        if (error) return error;

        const { id } = await params;

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
