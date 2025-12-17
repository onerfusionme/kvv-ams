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
