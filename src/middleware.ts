import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('plateshare-auth-token')?.value;
  const role = request.cookies.get('plateshare-user-role')?.value?.toLowerCase();
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/auth');
  const isDonorRoute = pathname.startsWith('/donor');
  const isNgoRoute = pathname.startsWith('/ngo');

  // If user is logged in, prevent them from accessing auth pages
  if (token && isAuthRoute) {
      const dashboardUrl = role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // Protect donor routes
  if (isDonorRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/donor/login', request.url));
    }
    if (role !== 'donor') {
      // If logged in as wrong role, redirect to their own dashboard or home
      return NextResponse.redirect(new URL(role === 'ngo' ? '/ngo/dashboard' : '/', request.url));
    }
  }

  // Protect NGO routes
  if (isNgoRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/ngo/login', request.url));
    }
    if (role !== 'ngo') {
       // If logged in as wrong role, redirect to their own dashboard or home
      return NextResponse.redirect(new URL(role === 'donor' ? '/donor/dashboard' : '/', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/donor/:path*',
    '/ngo/:path*',
    '/auth/:path*',
  ],
}
