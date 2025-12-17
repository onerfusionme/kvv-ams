import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/auth-utils';

// GET /api/departments - Any authenticated user can view
export async function GET(request: NextRequest) {
    try {
        const { error } = await withAuth(request);
        if (error) return error;

        const departments = await prisma.department.findMany({
            include: {
                head: true,
                location: true,
                _count: {
                    select: {
                        users: true,
                        assets: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
    }
}

// POST /api/departments - Admin only (Super Admin, College Admin, Hospital Admin)
export async function POST(request: NextRequest) {
    try {
        // Only admins can create departments
        const { error } = await withAuth(request, 'admin');
        if (error) return error;

        const body = await request.json();

        const department = await prisma.department.create({
            data: {
                name: body.name,
                code: body.code,
                headId: body.headId,
                locationId: body.locationId,
                parentDepartmentId: body.parentDepartmentId,
                budget: body.budget || 0,
                isActive: body.isActive ?? true,
            },
        });

        return NextResponse.json(department, { status: 201 });
    } catch (error) {
        console.error('Error creating department:', error);
        return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
    }
}
