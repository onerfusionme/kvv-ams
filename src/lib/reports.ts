// Report Generation Utilities
// Uses jsPDF for PDF and xlsx for Excel exports

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export interface ReportColumn {
    header: string
    accessor: string
    width?: number
}

export interface ReportOptions {
    title: string
    columns: ReportColumn[]
    data: Record<string, unknown>[]
    filename: string
    orientation?: 'portrait' | 'landscape'
}

// Generate PDF Report
export function generatePDF(options: ReportOptions): Blob {
    const { title, columns, data, orientation = 'landscape' } = options

    const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: 'a4',
    })

    // Add title
    doc.setFontSize(18)
    doc.setTextColor(40, 40, 40)
    doc.text(title, 14, 20)

    // Add generation date
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)

    // Generate table
    const tableHeaders = columns.map(col => col.header)
    const tableData = data.map(row =>
        columns.map(col => {
            const value = row[col.accessor]
            if (value === null || value === undefined) return '-'
            if (value instanceof Date) return value.toLocaleDateString()
            return String(value)
        })
    )

    autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 35,
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252],
        },
        columnStyles: columns.reduce((acc, col, index) => {
            if (col.width) {
                acc[index] = { cellWidth: col.width }
            }
            return acc
        }, {} as Record<number, { cellWidth: number }>),
    })

    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        )
    }

    return doc.output('blob')
}

// Generate Excel Report
export function generateExcel(options: ReportOptions): Blob {
    const { title, columns, data, filename } = options

    // Create worksheet data
    const wsData = [
        [title],
        [`Generated: ${new Date().toLocaleString()}`],
        [], // Empty row
        columns.map(col => col.header),
        ...data.map(row =>
            columns.map(col => {
                const value = row[col.accessor]
                if (value === null || value === undefined) return ''
                if (value instanceof Date) return value.toLocaleDateString()
                return value
            })
        ),
    ]

    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    const wb = XLSX.utils.book_new()

    // Set column widths
    ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }))

    // Merge title cell
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Report')

    // Generate buffer
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
}

// Asset Report Columns
export const assetReportColumns: ReportColumn[] = [
    { header: 'Asset ID', accessor: 'assetId', width: 15 },
    { header: 'Name', accessor: 'name', width: 25 },
    { header: 'Category', accessor: 'category', width: 12 },
    { header: 'Status', accessor: 'status', width: 12 },
    { header: 'Department', accessor: 'departmentName', width: 20 },
    { header: 'Location', accessor: 'locationName', width: 20 },
    { header: 'Purchase Date', accessor: 'purchaseDate', width: 15 },
    { header: 'Purchase Price', accessor: 'purchasePrice', width: 15 },
    { header: 'Current Value', accessor: 'currentValue', width: 15 },
]

// Maintenance Report Columns
export const maintenanceReportColumns: ReportColumn[] = [
    { header: 'Ticket #', accessor: 'ticketNumber', width: 15 },
    { header: 'Asset', accessor: 'assetName', width: 25 },
    { header: 'Type', accessor: 'type', width: 12 },
    { header: 'Status', accessor: 'status', width: 12 },
    { header: 'Priority', accessor: 'priority', width: 10 },
    { header: 'Scheduled', accessor: 'scheduledDate', width: 15 },
    { header: 'Completed', accessor: 'completedDate', width: 15 },
    { header: 'Cost', accessor: 'cost', width: 12 },
]

// User Report Columns
export const userReportColumns: ReportColumn[] = [
    { header: 'Employee ID', accessor: 'employeeId', width: 12 },
    { header: 'Name', accessor: 'name', width: 25 },
    { header: 'Email', accessor: 'email', width: 25 },
    { header: 'Role', accessor: 'role', width: 15 },
    { header: 'Department', accessor: 'departmentName', width: 20 },
    { header: 'Status', accessor: 'isActive', width: 10 },
]
