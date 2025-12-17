import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST /api/auth/register - Create new user account
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { firstName, lastName, email, employeeId, password } = body

        // Validate required fields
        if (!firstName || !lastName || !email || !employeeId || !password) {
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

        // Check if employeeId already exists
        const existingEmployee = await prisma.user.findUnique({
            where: { employeeId }
        })

        if (existingEmployee) {
            return NextResponse.json(
                { error: 'Employee ID already registered' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user with default role 'User'
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                employeeId,
                password: hashedPassword,
                role: 'User',
                isActive: true,
            },
        })

        return NextResponse.json({
            message: 'Account created successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        )
    }
}
