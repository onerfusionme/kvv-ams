import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || 'krishna-asset-management-secret-key-2024'
    })
    const isLoggedIn = !!token
    const isLoginPage = request.nextUrl.pathname === '/login'
    const isApiRoute = request.nextUrl.pathname.startsWith('/api')
    const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')
    const isStaticRoute = request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2)$/)

    // Allow static files
    if (isStaticRoute) {
        return NextResponse.next()
    }

    // Allow auth routes to pass through
    if (isAuthRoute) {
        return NextResponse.next()
    }

    // If logged in and trying to access login page, redirect to home
    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && !isLoginPage && !isApiRoute) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    // Protect API routes (except auth routes)
    if (!isLoggedIn && isApiRoute && !isAuthRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Match all routes except static files, _next, and public assets
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
