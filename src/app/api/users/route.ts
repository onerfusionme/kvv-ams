import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth, isAdmin } from '@/lib/auth-utils';

// GET /api/users - Get all users (any authenticated user can view)
export async function GET(request: NextRequest) {
    try {
        const { user, error } = await withAuth(request);
        if (error) return error;

        const { searchParams } = new URL(request.url);
        const departmentId = searchParams.get('departmentId');
        const role = searchParams.get('role');

        const where: Record<string, unknown> = {};
        if (departmentId) where.departmentId = departmentId;
        if (role) where.role = role;

        // Non-admins can only see users in their department
        if (!isAdmin(user) && user?.departmentId) {
            where.departmentId = user.departmentId;
        }

        const users = await prisma.user.findMany({
            where,
            include: {
                department: true,
                location: true,
            },
            orderBy: { lastName: 'asc' },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST /api/users - Create new user (Admin only)
export async function POST(request: NextRequest) {
    try {
        // Only Super Admin, College Admin, or Hospital Admin can create users
        const { user, error } = await withAuth(request, 'admin');
        if (error) return error;

        const body = await request.json();

        const newUser = await prisma.user.create({
            data: {
                employeeId: body.employeeId,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                role: body.role || 'User',
                departmentId: body.departmentId,
                locationId: body.locationId,
                designation: body.designation,
                isActive: body.isActive ?? true,
                permissions: body.permissions ? JSON.stringify(body.permissions) : null,
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
