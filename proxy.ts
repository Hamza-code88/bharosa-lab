import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🛑 FIX: Next.js 16 uses 'proxy.ts' instead of 'middleware.ts'
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. SUPER ADMIN ROUTES KO SECURE KARNA
  const isSuperAdminRoute = path.startsWith('/super-admin/') && path !== '/super-admin';
  
  if (isSuperAdminRoute) {
    const superAdminCookie = request.cookies.get('super_admin_auth');
    
    if (!superAdminCookie || superAdminCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/super-admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/super-admin/:path*'],
};