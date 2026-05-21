import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'th', 'ja', 'cn'],
  defaultLocale: 'en'
});

export default async function middleware(request: NextRequest) {
  // Handle internationalization
  const response = intlMiddleware(request);
  
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip authentication for login page and API routes
    if (request.nextUrl.pathname === '/admin/login' || 
        request.nextUrl.pathname.startsWith('/api/')) {
      return response;
    }

    // Check for admin session cookie
    const sessionToken = request.cookies.get('admin_session')?.value;
    
    if (!sessionToken) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Let the page handle session validation
    // This avoids Edge Runtime issues with database connections
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};