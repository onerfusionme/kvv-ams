// Bulk Import Utilities
// Uses papaparse for CSV and xlsx for Excel parsing

import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export interface ImportResult {
    success: boolean
    totalRows: number
    successCount: number
    errorCount: number
    errors: { row: number; message: string }[]
    data: Record<string, unknown>[]
}

export interface ImportMapping {
    csvHeader: string
    dbField: string
    required?: boolean
    transform?: (value: string) => unknown
}

// Parse CSV file
export async function parseCSV(file: File): Promise<Record<string, string>[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data as Record<string, string>[])
            },
            error: (error) => {
                reject(error)
            },
        })
    })
}

// Parse Excel file
export async function parseExcel(file: File): Promise<Record<string, string>[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: 'array' })
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet)
                resolve(jsonData)
            } catch (error) {
                reject(error)
            }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsArrayBuffer(file)
    })
}

// Asset import mappings
export const assetMappings: ImportMapping[] = [
    { csvHeader: 'Asset ID', dbField: 'assetId', required: true },
    { csvHeader: 'Name', dbField: 'name', required: true },
    { csvHeader: 'Description', dbField: 'description' },
    { csvHeader: 'Category', dbField: 'category', required: true },
    { csvHeader: 'Sub Category', dbField: 'subCategory' },
    { csvHeader: 'Status', dbField: 'status' },
    { csvHeader: 'Make', dbField: 'make' },
    { csvHeader: 'Model', dbField: 'model' },
    { csvHeader: 'Serial Number', dbField: 'serialNumber' },
    {
        csvHeader: 'Purchase Date',
        dbField: 'purchaseDate',
        transform: (val) => val ? new Date(val) : null
    },
    {
        csvHeader: 'Purchase Price',
        dbField: 'purchasePrice',
        transform: (val) => parseFloat(val) || 0
    },
    {
        csvHeader: 'Current Value',
        dbField: 'currentValue',
        transform: (val) => parseFloat(val) || 0
    },
    { csvHeader: 'Department Code', dbField: 'departmentCode' },
    { csvHeader: 'Location Code', dbField: 'locationCode' },
]

// User import mappings
export const userMappings: ImportMapping[] = [
    { csvHeader: 'Employee ID', dbField: 'employeeId', required: true },
    { csvHeader: 'First Name', dbField: 'firstName', required: true },
    { csvHeader: 'Last Name', dbField: 'lastName', required: true },
    { csvHeader: 'Email', dbField: 'email', required: true },
    { csvHeader: 'Phone', dbField: 'phone' },
    { csvHeader: 'Role', dbField: 'role' },
    { csvHeader: 'Department Code', dbField: 'departmentCode' },
    { csvHeader: 'Designation', dbField: 'designation' },
]

// Validate and transform data
export function validateAndTransform(
    rawData: Record<string, string>[],
    mappings: ImportMapping[]
): ImportResult {
    const result: ImportResult = {
        success: true,
        totalRows: rawData.length,
        successCount: 0,
        errorCount: 0,
        errors: [],
        data: [],
    }

    rawData.forEach((row, index) => {
        const transformedRow: Record<string, unknown> = {}
        let rowValid = true

        mappings.forEach((mapping) => {
            const value = row[mapping.csvHeader]?.trim() || ''

            // Check required fields
            if (mapping.required && !value) {
                result.errors.push({
                    row: index + 2, // +2 for header row and 1-based index
                    message: `Missing required field: ${mapping.csvHeader}`,
                })
                rowValid = false
                return
            }

            // Transform value
            if (value) {
                transformedRow[mapping.dbField] = mapping.transform
                    ? mapping.transform(value)
                    : value
            }
        })

        if (rowValid) {
            result.data.push(transformedRow)
            result.successCount++
        } else {
            result.errorCount++
        }
    })

    result.success = result.errorCount === 0
    return result
}

// Generate sample CSV template
export function generateTemplate(mappings: ImportMapping[]): string {
    const headers = mappings.map(m => m.csvHeader)
    return headers.join(',') + '\n'
}

// Generate DOCX template using docx library
export async function generateDocxTemplate(
    mappings: ImportMapping[],
    templateType: 'assets' | 'users'
): Promise<Blob> {
    const { Document, Paragraph, Table, TableRow, TableCell, HeadingLevel, TextRun, WidthType, BorderStyle, AlignmentType, Packer } = await import('docx')

    const headers = mappings.map(m => m.csvHeader)
    const requiredFields = mappings.filter(m => m.required).map(m => m.csvHeader)

    // Create table header cells
    const headerCells = headers.map(header =>
        new TableCell({
            children: [new Paragraph({
                children: [new TextRun({ text: header, bold: true, size: 22 })],
                alignment: AlignmentType.CENTER,
            })],
            shading: { fill: '4F46E5' },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
        })
    )

    // Create sample data row
    const sampleCells = headers.map(header =>
        new TableCell({
            children: [new Paragraph({
                children: [new TextRun({
                    text: `<Enter ${header}>`,
                    italics: true,
                    color: '666666',
                    size: 20
                })],
            })],
            margins: { top: 50, bottom: 50, left: 100, right: 100 },
        })
    )

    const doc = new Document({
        sections: [{
            properties: {
                page: { size: { orientation: 'landscape' } },
            },
            children: [
                new Paragraph({
                    text: `${templateType === 'assets' ? 'Asset' : 'User'} Import Template`,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: 'KVV Asset Management System',
                    heading: HeadingLevel.HEADING_2,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Instructions:', bold: true }),
                    ],
                }),
                new Paragraph({
                    text: '1. Fill in the data in the table below (replace sample values)',
                }),
                new Paragraph({
                    text: '2. Required fields are marked with * in the header',
                }),
                new Paragraph({
                    text: '3. Save as .xlsx or .csv file for import',
                }),
                new Paragraph({
                    text: `4. Required fields: ${requiredFields.join(', ')}`,
                }),
                new Paragraph({ text: '' }),
                new Table({
                    rows: [
                        new TableRow({ children: headerCells }),
                        new TableRow({ children: sampleCells }),
                    ],
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                        left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                        right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                    },
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Note: ', bold: true }),
                        new TextRun({ text: 'Add more rows as needed. Each row represents one record to import.' }),
                    ],
                }),
            ],
        }],
    })

    return await Packer.toBlob(doc)
}

