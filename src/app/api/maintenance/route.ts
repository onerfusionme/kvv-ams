import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/maintenance
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const type = searchParams.get('type');

        const where: any = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (type) where.type = type;

        const records = await prisma.maintenanceRecord.findMany({
            where,
            include: {
                asset: true,
                assignedTo: true,
                reportedBy: true,
            },
            orderBy: { reportedDate: 'desc' },
        });

        return NextResponse.json(records);
    } catch (error) {
        console.error('Error fetching maintenance records:', error);
        return NextResponse.json({ error: 'Failed to fetch maintenance records' }, { status: 500 });
    }
}

// POST /api/maintenance
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Generate ticket number
        const count = await prisma.maintenanceRecord.count();
        const ticketNumber = `MT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

        const record = await prisma.maintenanceRecord.create({
            data: {
                ticketNumber,
                assetId: body.assetId,
                type: body.type || 'Preventive',
                status: body.status || 'Scheduled',
                priority: body.priority || 'Medium',
                description: body.description,
                reportedById: body.reportedById,
                assignedToId: body.assignedToId,
                scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
                cost: body.cost || 0,
                vendorId: body.vendorId,
            },
        });

        return NextResponse.json(record, { status: 201 });
    } catch (error) {
        console.error('Error creating maintenance record:', error);
        return NextResponse.json({ error: 'Failed to create maintenance record' }, { status: 500 });
    }
}
