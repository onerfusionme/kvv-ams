// Authorization utilities for role-based access control
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export type Role = 'Super Admin' | 'College Admin' | 'Hospital Admin' | 'Dept Head' | 'Asset Manager' | 'User'

export interface AuthUser {
    id: string
    email: string
    role: Role
    departmentId?: string | null
    collegeId?: string | null
    hospitalId?: string | null
}

const AUTH_SECRET = process.env.AUTH_SECRET || 'krishna-asset-management-secret-key-2024'

// Get current user from request
export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
    const token = await getToken({ req: request, secret: AUTH_SECRET })
    if (!token) return null

    return {
        id: token.id as string,
        email: token.email as string,
        role: token.role as Role,
        departmentId: token.departmentId as string | null,
        collegeId: token.collegeId as string | null,
        hospitalId: token.hospitalId as string | null,
    }
}

// Check if user has Super Admin role
export function isSuperAdmin(user: AuthUser | null): boolean {
    return user?.role === 'Super Admin'
}

// Check if user can perform admin actions (Super Admin or College/Hospital Admin)
export function isAdmin(user: AuthUser | null): boolean {
    if (!user) return false
    return ['Super Admin', 'College Admin', 'Hospital Admin'].includes(user.role)
}

// Check if user can manage assets (Super Admin, Admin, Dept Head, or Asset Manager)
export function canManageAssets(user: AuthUser | null): boolean {
    if (!user) return false
    return ['Super Admin', 'College Admin', 'Hospital Admin', 'Dept Head', 'Asset Manager'].includes(user.role)
}

// Check if user can create/edit users (Super Admin or College/Hospital Admin only)
export function canManageUsers(user: AuthUser | null): boolean {
    return isAdmin(user)
}

// Unauthorized response helper
export function unauthorized(message: string = 'Unauthorized: Insufficient permissions') {
    return NextResponse.json({ error: message }, { status: 403 })
}

// Authentication required response helper
export function unauthenticated(message: string = 'Authentication required') {
    return NextResponse.json({ error: message }, { status: 401 })
}

// Authorization check middleware helper
export async function withAuth(
    request: NextRequest,
    requiredRole: 'super_admin' | 'admin' | 'asset_manager' | 'any' = 'any'
): Promise<{ user: AuthUser | null; error: NextResponse | null }> {
    const user = await getCurrentUser(request)

    if (!user) {
        return { user: null, error: unauthenticated() }
    }

    switch (requiredRole) {
        case 'super_admin':
            if (!isSuperAdmin(user)) {
                return { user, error: unauthorized('Super Admin access required') }
            }
            break
        case 'admin':
            if (!isAdmin(user)) {
                return { user, error: unauthorized('Admin access required') }
            }
            break
        case 'asset_manager':
            if (!canManageAssets(user)) {
                return { user, error: unauthorized('Asset management permission required') }
            }
            break
    }

    return { user, error: null }
}
