import { describe, it, expect } from 'vitest'
import {
    assetReportColumns,
    maintenanceReportColumns,
    userReportColumns
} from '@/lib/reports'

describe('Report Configuration', () => {
    describe('assetReportColumns', () => {
        it('should have all required columns', () => {
            const headers = assetReportColumns.map(c => c.header)

            expect(headers).toContain('Asset ID')
            expect(headers).toContain('Name')
            expect(headers).toContain('Category')
            expect(headers).toContain('Status')
            expect(headers).toContain('Department')
        })

        it('should have accessor for each column', () => {
            assetReportColumns.forEach(col => {
                expect(col.accessor).toBeDefined()
                expect(typeof col.accessor).toBe('string')
            })
        })
    })

    describe('maintenanceReportColumns', () => {
        it('should have maintenance-specific columns', () => {
            const headers = maintenanceReportColumns.map(c => c.header)

            expect(headers).toContain('Ticket #')
            expect(headers).toContain('Asset')
            expect(headers).toContain('Status')
            expect(headers).toContain('Priority')
        })
    })

    describe('userReportColumns', () => {
        it('should have user-specific columns', () => {
            const headers = userReportColumns.map(c => c.header)

            expect(headers).toContain('Employee ID')
            expect(headers).toContain('Name')
            expect(headers).toContain('Email')
            expect(headers).toContain('Role')
        })
    })
})
