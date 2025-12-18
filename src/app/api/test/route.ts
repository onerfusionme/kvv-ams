import { NextResponse } from 'next/server'

// GET /api/test - Simple test endpoint (no auth required)
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'API is working',
        timestamp: new Date().toISOString(),
        env: {
            hasDbUrl: !!process.env.DATABASE_URL,
            hasAuthSecret: !!process.env.AUTH_SECRET,
            nodeEnv: process.env.NODE_ENV,
        }
    })
}
