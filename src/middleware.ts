import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Skip middleware for static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2)$/)
    ) {
        return NextResponse.next()
    }

    // Check for auth session cookie (NextAuth v5 uses different cookie names)
    const hasSession =
        request.cookies.has('authjs.session-token') ||
        request.cookies.has('__Secure-authjs.session-token') ||
        request.cookies.has('next-auth.session-token') ||
        request.cookies.has('__Secure-next-auth.session-token')

    const isLoginPage = pathname === '/login'
    const isSetupPage = pathname === '/setup'
    const isPublicPage = isLoginPage || isSetupPage

    // If logged in and on login page, redirect to home
    if (hasSession && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // If not logged in and not on public page, redirect to login
    if (!hasSession && !isPublicPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api routes (handled separately)
         */
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
}
