import { describe, it, expect, vi } from 'vitest'
import {
    validateAndTransform,
    assetMappings,
    userMappings,
    generateTemplate
} from '@/lib/imports'

describe('Import Utilities', () => {
    describe('validateAndTransform', () => {
        it('should validate and transform valid asset data', () => {
            const rawData = [
                {
                    'Asset ID': 'AST-001',
                    'Name': 'Test Asset',
                    'Category': 'IT',
                    'Purchase Price': '50000',
                }
            ]

            const result = validateAndTransform(rawData, assetMappings)

            expect(result.success).toBe(true)
            expect(result.successCount).toBe(1)
            expect(result.errorCount).toBe(0)
            expect(result.data[0]).toMatchObject({
                assetId: 'AST-001',
                name: 'Test Asset',
                category: 'IT',
                purchasePrice: 50000,
            })
        })

        it('should report errors for missing required fields', () => {
            const rawData = [
                {
                    'Name': 'Test Asset',
                    // Missing Asset ID and Category
                }
            ]

            const result = validateAndTransform(rawData, assetMappings)

            expect(result.success).toBe(false)
            expect(result.errorCount).toBe(1)
            expect(result.errors.length).toBeGreaterThan(0)
        })

        it('should transform date fields correctly', () => {
            const rawData = [
                {
                    'Asset ID': 'AST-002',
                    'Name': 'Another Asset',
                    'Category': 'Academic',
                    'Purchase Date': '2024-01-15',
                }
            ]

            const result = validateAndTransform(rawData, assetMappings)

            expect(result.data[0].purchaseDate).toBeInstanceOf(Date)
        })
    })

    describe('generateTemplate', () => {
        it('should generate CSV template with correct headers', () => {
            const template = generateTemplate(assetMappings)

            expect(template).toContain('Asset ID')
            expect(template).toContain('Name')
            expect(template).toContain('Category')
            expect(template).toContain('Purchase Price')
        })

        it('should generate user template with correct headers', () => {
            const template = generateTemplate(userMappings)

            expect(template).toContain('Employee ID')
            expect(template).toContain('First Name')
            expect(template).toContain('Email')
        })
    })
})
