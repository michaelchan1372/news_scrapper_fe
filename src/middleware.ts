import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const pathname = req.nextUrl.pathname

  const isLoginPage = pathname === '/login'

  // If no token and trying to access /dashboard, redirect to /login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If token exists and trying to access /login, redirect to /dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/summary', '/keywords'],
}