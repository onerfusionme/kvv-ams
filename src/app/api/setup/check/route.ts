import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/setup/check - Check if Super Admin exists
export async function GET() {
    try {
        const adminCount = await prisma.user.count({
            where: { role: 'Super Admin' }
        })

        return NextResponse.json({ hasAdmin: adminCount > 0 })
    } catch (error) {
        console.error('Setup check error:', error)
        return NextResponse.json({ hasAdmin: false })
    }
}
