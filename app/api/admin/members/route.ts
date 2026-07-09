import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirePermission, PERMISSIONS } from '@/lib/security/permissions'

export async function GET() {
  const session = await getServerSession(authOptions)
  const denied = requirePermission(session, PERMISSIONS.MANAGE_MEMBERS)
  if (denied) return denied

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      hometown: true,
      role: true,
      accountStatus: true,
      emailVerified: true,
      createdAt: true,
      officerTitle: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ users })
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = requirePermission(session, PERMISSIONS.MANAGE_MEMBERS)
  if (denied) return denied

  const { userId, action } = await request.json()

  if (!userId || !['approve', 'reject', 'resend_verification', 'reset_registration'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // ── Resend verification: fresh 24h link for an unverified account ──
  if (action === 'resend_verification') {
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, emailVerified: true },
    })
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (target.emailVerified) {
      return NextResponse.json({ error: 'This account is already verified.' }, { status: 400 })
    }

    const { resendVerificationEmail } = await import('@/lib/security/email-verification')
    const result = await resendVerificationEmail(target.email)
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send verification email' }, { status: 500 })
    }

    const { auditLog } = await import('@/lib/security/account-security')
    await auditLog({
      userId: session!.user.id,
      action: 'verification_resent_by_admin',
      resource: 'user',
      resourceId: target.id,
      metadata: { targetEmail: target.email, resentById: session!.user.id },
    })

    return NextResponse.json({ ok: true, message: 'Verification email sent.' })
  }

  // ── Reset registration: delete a stuck account so the person can start over ──
  if (action === 'reset_registration') {
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, emailVerified: true, accountStatus: true, createdAt: true },
    })
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (target.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot reset a Super Admin account.' }, { status: 400 })
    }
    // Only stuck accounts are resettable: unverified email, or still pending
    // approval. A verified AND approved member is established — never reset.
    if (target.emailVerified && target.accountStatus === 'APPROVED') {
      return NextResponse.json(
        { error: 'This member is verified and approved — reset is only for stuck registrations.' },
        { status: 400 },
      )
    }

    await prisma.verificationToken.deleteMany({ where: { identifier: target.email } })
    await prisma.user.delete({ where: { id: userId } })

    const { auditLog } = await import('@/lib/security/account-security')
    await auditLog({
      userId: session!.user.id,
      action: 'registration_reset_by_admin',
      resource: 'user',
      resourceId: target.id,
      metadata: {
        deletedUser: {
          id: target.id,
          email: target.email,
          name: target.name,
          emailVerified: target.emailVerified?.toISOString() ?? null,
          accountStatus: target.accountStatus,
          createdAt: target.createdAt.toISOString(),
        },
        resetById: session!.user.id,
      },
    })

    // Awaited: Vercel freezes the function once the response returns.
    const { emailService } = await import('@/lib/email/service')
    await emailService.sendRegistrationReset(target.email, target.name || 'Member')

    return NextResponse.json({ ok: true, message: 'Registration reset — the person was invited to sign up again.' })
  }

  const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'

  const user = await prisma.user.update({
    where: { id: userId },
    data: { accountStatus: newStatus },
    select: { id: true, email: true, name: true, accountStatus: true },
  })

  if (action === 'approve') {
    // Awaited: Vercel freezes the function once the response returns, so an
    // un-awaited send is silently dropped and the member never gets notified.
    const { emailService } = await import('@/lib/email/service')
    await emailService.sendAccountApproved(user.email, user.name || 'Member')
  }

  return NextResponse.json({ user })
}
