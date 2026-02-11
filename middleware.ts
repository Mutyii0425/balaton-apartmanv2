import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Csak akkor irányít át, ha PONTOSAN a főoldalra érkeznek
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/info', request.url));
  }

  // Az admin védelem marad zavartalanul
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};