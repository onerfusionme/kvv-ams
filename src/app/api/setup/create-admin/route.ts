import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// The setup key - should be stored securely in env variable in production
const SETUP_KEY = process.env.SETUP_KEY || 'kvv-admin-setup-2024'

// POST /api/setup/create-admin - Create initial Super Admin
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { firstName, lastName, email, password, setupKey } = body

        // Validate setup key
        if (setupKey !== SETUP_KEY) {
            return NextResponse.json(
                { error: 'Invalid setup key' },
                { status: 403 }
            )
        }

        // Check if Super Admin already exists
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'Super Admin' }
        })

        if (existingAdmin) {
            return NextResponse.json(
                { error: 'Super Admin already exists. Use login page.' },
                { status: 400 }
            )
        }

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create Super Admin user
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                employeeId: 'ADMIN-001',
                password: hashedPassword,
                role: 'Super Admin',
                isActive: true,
            },
        })

        return NextResponse.json({
            message: 'Super Admin created successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Create admin error:', error)
        return NextResponse.json(
            { error: 'Failed to create Super Admin' },
            { status: 500 }
        )
    }
}
