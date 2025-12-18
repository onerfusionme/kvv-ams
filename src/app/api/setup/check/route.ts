import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/setup/check - Check if Super Admin exists (PUBLIC - no auth required)
export async function GET() {
    try {
        const adminCount = await prisma.user.count({
            where: { role: 'Super Admin' }
        })

        return NextResponse.json({
            hasAdmin: adminCount > 0,
            count: adminCount,
            status: 'ok'
        })
    } catch (error) {
        console.error('Setup check error:', error)
        // Return detailed error for debugging
        return NextResponse.json({
            hasAdmin: false,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 200 }) // Return 200 to avoid 500 error
    }
}

