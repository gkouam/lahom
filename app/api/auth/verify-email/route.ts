import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailToken } from '@/lib/security/email-verification'
import { auditLog } from '@/lib/security/account-security'

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 })
    }

    const result = await verifyEmailToken(token)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Audit log
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

    // Redirect to sign-in with success message
    return NextResponse.redirect(new URL('/auth/signin?verified=true', request.url))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 })
  }
}
