import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Csak az /admin-nal kezdődő útvonalakat védjük
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // 2. Megnézzük, van-e nálad "belépőkártya" (admin_token süti)
    // Ezt a Login oldal adja, ha helyes a jelszó.
    const token = request.cookies.get('admin_token');

    // 3. Ha NINCS süti (nem lépett be), akkor elküldjük a /login oldalra
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. Ha van süti, vagy nem védett oldal, mehet tovább
  return NextResponse.next();
}

// Beállítjuk, hogy mely útvonalakon fusson le az ellenőrzés
export const config = {
  matcher: '/admin/:path*',
};