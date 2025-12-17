import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth } from '@/lib/auth-utils';

// GET /api/vendors - Any authenticated user can view
export async function GET(request: NextRequest) {
    try {
        const { error } = await withAuth(request);
        if (error) return error;

        const vendors = await prisma.vendor.findMany({
            include: {
                contracts: true,
                _count: {
                    select: {
                        assets: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(vendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
    }
}

// POST /api/vendors - Admin only (Super Admin, College Admin, Hospital Admin)
export async function POST(request: NextRequest) {
    try {
        // Only admins can create vendors
        const { error } = await withAuth(request, 'admin');
        if (error) return error;

        const body = await request.json();

        const vendor = await prisma.vendor.create({
            data: {
                name: body.name,
                code: body.code,
                type: body.type || 'Supplier',
                contactPerson: body.contactPerson,
                email: body.email,
                phone: body.phone,
                address: body.address,
                gstNumber: body.gstNumber,
                panNumber: body.panNumber,
                rating: body.rating || 0,
                isActive: body.isActive ?? true,
            },
        });

        return NextResponse.json(vendor, { status: 201 });
    } catch (error) {
        console.error('Error creating vendor:', error);
        return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
    }
}
