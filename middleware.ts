import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response: NextResponse

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    response = NextResponse.next()
  } else {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    const protectedRoutes: Record<string, string> = {
      '/dashboard': '/auth/signin?callbackUrl=/dashboard',
      '/admin': '/auth/signin?callbackUrl=/admin',
    }

    const matchedRoute = Object.keys(protectedRoutes).find(
      route => pathname === route || pathname.startsWith(`${route}/`)
    )

    if (matchedRoute) {
      if (!token) {
        response = NextResponse.redirect(new URL(protectedRoutes[matchedRoute], request.url))
      } else if (matchedRoute === '/admin') {
        if (token.role !== 'ADMIN') {
          response = NextResponse.redirect(new URL('/', request.url))
        } else {
          response = NextResponse.next()
        }
      } else {
        const emailVerified = token.emailVerified as Date | null
        const accountStatus = token.accountStatus as string
        if (!emailVerified) {
          response = NextResponse.redirect(new URL('/auth/verify-email-required', request.url))
        } else if (accountStatus !== 'APPROVED') {
          response = NextResponse.redirect(new URL('/auth/pending-approval', request.url))
        } else {
          response = NextResponse.next()
        }
      }
    } else {
      response = NextResponse.next()
    }
  }

  // Security headers
  const headers = response.headers
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')
  headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
