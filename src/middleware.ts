import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define the protected routes
const protectedRoutes = ['/admin'];
const authRoutes = ['/login', '/signup'];

const JWT_SECRET = process.env.JWT_SECRET || "ocean-aquarium-super-secret-key-123";
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if it's a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    // Check if it's an auth route (login/signup)
    const isAuthRoute = authRoutes.includes(pathname);

    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    // Let's verify the token if it exists
    let isValidUser = false;
    if (token) {
        try {
            await jwtVerify(token, key);
            isValidUser = true;
        } catch (error) {
            // Invalid token
            isValidUser = false;
        }
    }

    // Case 1: Trying to access protected route without valid auth
    if (isProtectedRoute && !isValidUser) {
        const loginUrl = new URL('/login', request.url);
        // Optionally preserve the attempted URL to redirect back after login
        // loginUrl.searchParams.set('callbackUrl', encodeURI(pathname));
        return NextResponse.redirect(loginUrl);
    }

    // Case 2: Trying to access auth routes (login/signup) while already logged in
    if (isAuthRoute && isValidUser) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public static assets)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
