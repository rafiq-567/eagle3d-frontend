
import { NextRequest, NextResponse } from 'next/server';


const PROTECTED_PATHS = [
  
  '/products',
  '/analytics',
  '/logout',
  '/app',   
];

function isProtected(pathname: string) {
  
  return PROTECTED_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  
  if (isProtected(pathname)) {
    
    const cookie = req.cookies.get('session')?.value;

   
    if (!cookie) {
      const loginUrl = new URL('/login', req.url);
     
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    
    return NextResponse.next();
  }

 
  return NextResponse.next();
}


export const config = {
  matcher: [ '/products/:path*', '/analytics/:path*', '/logout'],
};
