import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
    parseCSV,
    parseExcel,
    validateAndTransform,
    assetMappings,
    userMappings,
    generateTemplate,
    generateDocxTemplate
} from '@/lib/imports'

// POST /api/imports - Import data from CSV/Excel
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const type = formData.get('type') as string || 'assets'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Parse file based on type
        const fileExtension = file.name.split('.').pop()?.toLowerCase()
        let rawData: Record<string, string>[]

        if (fileExtension === 'csv') {
            rawData = await parseCSV(file)
        } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
            rawData = await parseExcel(file)
        } else {
            return NextResponse.json({ error: 'Unsupported file format. Use CSV or Excel.' }, { status: 400 })
        }

        // Get mappings based on import type
        const mappings = type === 'users' ? userMappings : assetMappings

        // Validate and transform data
        const result = validateAndTransform(rawData, mappings)

        if (result.data.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No valid data to import',
                errors: result.errors,
            }, { status: 400 })
        }

        // Import to database
        let importedCount = 0
        const importErrors: { row: number; message: string }[] = [...result.errors]

        if (type === 'assets') {
            // Get department and location lookups
            const departments = await prisma.department.findMany()
            const locations = await prisma.location.findMany()
            const deptMap = new Map(departments.map((d: { code: string; id: string }) => [d.code, d.id]))
            const locMap = new Map(locations.map((l: { code: string; id: string }) => [l.code, l.id]))

            for (let i = 0; i < result.data.length; i++) {
                const asset = result.data[i] as Record<string, unknown>
                try {
                    // Map department and location codes to IDs
                    const departmentId = asset.departmentCode
                        ? deptMap.get(asset.departmentCode as string)
                        : null
                    const locationId = asset.locationCode
                        ? locMap.get(asset.locationCode as string)
                        : null

                    await prisma.asset.create({
                        data: {
                            assetId: asset.assetId as string,
                            name: asset.name as string,
                            description: asset.description as string || null,
                            category: asset.category as string,
                            subCategory: asset.subCategory as string || null,
                            status: (asset.status as string) || 'Active',
                            make: asset.make as string || null,
                            model: asset.model as string || null,
                            serialNumber: asset.serialNumber as string || null,
                            purchaseDate: asset.purchaseDate as Date || null,
                            purchasePrice: asset.purchasePrice as number || 0,
                            currentValue: asset.currentValue as number || 0,
                            departmentId,
                            locationId,
                        },
                    })
                    importedCount++
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                    importErrors.push({
                        row: i + 2,
                        message: `Failed to import: ${errorMessage}`,
                    })
                }
            }
        } else if (type === 'users') {
            const departments = await prisma.department.findMany()
            const deptMap = new Map(departments.map((d: { code: string; id: string }) => [d.code, d.id]))

            for (let i = 0; i < result.data.length; i++) {
                const user = result.data[i] as Record<string, unknown>
                try {
                    const departmentId = user.departmentCode
                        ? deptMap.get(user.departmentCode as string)
                        : null

                    await prisma.user.create({
                        data: {
                            employeeId: user.employeeId as string,
                            firstName: user.firstName as string,
                            lastName: user.lastName as string,
                            email: user.email as string,
                            phone: user.phone as string || null,
                            role: (user.role as string) || 'User',
                            designation: user.designation as string || null,
                            departmentId,
                        },
                    })
                    importedCount++
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                    importErrors.push({
                        row: i + 2,
                        message: `Failed to import: ${errorMessage}`,
                    })
                }
            }
        }

        return NextResponse.json({
            success: importErrors.length === 0,
            message: `Imported ${importedCount} of ${result.totalRows} records`,
            imported: importedCount,
            total: result.totalRows,
            errors: importErrors,
        })

    } catch (error) {
        console.error('Import error:', error)
        return NextResponse.json({ error: 'Failed to process import' }, { status: 500 })
    }
}

// GET /api/imports/template - Download import template
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'assets'
    const format = searchParams.get('format') || 'csv'

    const mappings = type === 'users' ? userMappings : assetMappings

    // Return DOCX format if requested
    if (format === 'docx') {
        try {
            const blob = await generateDocxTemplate(mappings, type as 'assets' | 'users')
            const buffer = await blob.arrayBuffer()

            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition': `attachment; filename="${type}_import_template.docx"`,
                },
            })
        } catch (error) {
            console.error('DOCX generation error:', error)
            return NextResponse.json({ error: 'Failed to generate DOCX template' }, { status: 500 })
        }
    }

    // Default to CSV format
    const template = generateTemplate(mappings)

    return new NextResponse(template, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${type}_import_template.csv"`,
        },
    })
}

