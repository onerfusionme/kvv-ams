import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
    generatePDF,
    generateExcel,
    assetReportColumns,
    maintenanceReportColumns,
    userReportColumns,
    ReportColumn
} from '@/lib/reports'

// GET /api/reports - Generate report
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || 'assets'
        const format = searchParams.get('format') || 'pdf'

        let data: Record<string, unknown>[] = []
        let columns: ReportColumn[] = []
        let title = ''

        switch (type) {
            case 'assets':
                const assets = await prisma.asset.findMany({
                    include: {
                        department: true,
                        location: true,
                    },
                    orderBy: { createdAt: 'desc' },
                })
                data = assets.map(asset => ({
                    ...asset,
                    departmentName: asset.department?.name || '-',
                    locationName: asset.location?.name || '-',
                    purchaseDate: asset.purchaseDate?.toLocaleDateString() || '-',
                }))
                columns = assetReportColumns
                title = 'Asset Inventory Report'
                break

            case 'maintenance':
                const maintenance = await prisma.maintenanceRecord.findMany({
                    include: {
                        asset: true,
                    },
                    orderBy: { createdAt: 'desc' },
                })
                data = maintenance.map(record => ({
                    ...record,
                    assetName: record.asset?.name || '-',
                    scheduledDate: record.scheduledDate?.toLocaleDateString() || '-',
                    completedDate: record.completedDate?.toLocaleDateString() || '-',
                }))
                columns = maintenanceReportColumns
                title = 'Maintenance Records Report'
                break

            case 'users':
                const users = await prisma.user.findMany({
                    include: {
                        department: true,
                    },
                    orderBy: { createdAt: 'desc' },
                })
                data = users.map(user => ({
                    ...user,
                    name: `${user.firstName} ${user.lastName}`,
                    departmentName: user.department?.name || '-',
                    isActive: user.isActive ? 'Active' : 'Inactive',
                }))
                columns = userReportColumns
                title = 'User Directory Report'
                break

            default:
                return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
        }

        const filename = `${type}_report_${new Date().toISOString().split('T')[0]}`

        let blob: Blob
        let contentType: string

        if (format === 'excel') {
            blob = generateExcel({ title, columns, data, filename })
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        } else {
            blob = generatePDF({ title, columns, data, filename })
            contentType = 'application/pdf'
        }

        const arrayBuffer = await blob.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}.${format === 'excel' ? 'xlsx' : 'pdf'}"`,
            },
        })
    } catch (error) {
        console.error('Error generating report:', error)
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
    }
}
