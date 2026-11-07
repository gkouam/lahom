import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailToken } from '@/lib/security/email-verification'
import { auditLog } from '@/lib/security/account-security'

// Every outcome lands on a page. Errors go to /auth/verify-email with a short
// code the page turns into a message and a "send a new link" form; the page
// never prints text taken from the URL.
export async function GET(request: NextRequest) {
  const fail = (code: 'missing' | 'invalid' | 'expired' | 'failed') =>
    NextResponse.redirect(new URL(`/auth/verify-email?error=${code}`, request.url))

  try {
    const token = request.nextUrl.searchParams.get('token')
    if (!token) return fail('missing')

    const result = await verifyEmailToken(token)
    if (!result.success) return fail(result.error === 'expired' ? 'expired' : 'invalid')

    const { prisma } = await import('@/lib/db')
    const user = await prisma.user.findUnique({
      where: { email: result.email! },
      select: { id: true },
    })

    if (user) {
      await auditLog({
        userId: user.id,
        action: 'email_verified',
        resource: 'user',
        resourceId: user.id,
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || '0.0.0.0',
        userAgent: request.headers.get('user-agent') || undefined,
        metadata: { email: result.email },
      })
    }

    return NextResponse.redirect(new URL('/auth/signin?verified=true', request.url))
  } catch (error) {
    console.error('Email verification error:', error)
    return fail('failed')
  }
}
