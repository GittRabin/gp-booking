// middleware.ts

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow the request if the following is true...
  // 1) The token exists
  if (token || pathname.includes('/auth')) {
    return NextResponse.next();
  }

  // Redirect them to login if they don't have a token and are requesting a protected route
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
}

// Specify the paths that need to be protected
export const config = {
  matcher: ['/dashboard/:path*'],
};
