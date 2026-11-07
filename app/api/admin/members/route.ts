import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirePermission, requireAnyPermission, PERMISSIONS } from '@/lib/security/permissions'

export async function GET() {
  const session = await getServerSession(authOptions)
  // Viewing the list needs either permission; changing anything needs MANAGE_MEMBERS.
  const denied = requireAnyPermission(session, [PERMISSIONS.MANAGE_MEMBERS, PERMISSIONS.VIEW_MEMBERS])
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
    if (target.id === session!.user.id) {
      return NextResponse.json({ error: 'You cannot reset your own account.' }, { status: 400 })
    }

    // Reset deletes the account, so it is refused for anyone who holds
    // permissions or has records other people rely on (payments, notes).
    const [perms, contributions, recorded, notes, announcements] = await Promise.all([
      prisma.userPermission.count({ where: { userId } }),
      prisma.contribution.count({ where: { userId } }),
      prisma.contribution.count({ where: { recordedById: userId } }),
      prisma.meetingNote.count({ where: { authorId: userId } }),
      prisma.announcement.count({ where: { authorId: userId } }),
    ])
    if (perms + contributions + recorded + notes + announcements > 0) {
      return NextResponse.json(
        { error: 'This account holds permissions or has payments or notes on record, so it can’t be reset. Reject it instead.' },
        { status: 400 },
      )
    }

    await prisma.$transaction([
      prisma.verificationToken.deleteMany({ where: { identifier: target.email } }),
      prisma.user.delete({ where: { id: userId } }),
    ])

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

  const before = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, accountStatus: true },
  })
  if (!before) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (action === 'reject' && (before.role === 'SUPER_ADMIN' || before.id === session!.user.id)) {
    return NextResponse.json({ error: 'This account can’t be rejected.' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { accountStatus: newStatus },
    select: { id: true, email: true, name: true, accountStatus: true },
  })

  const { auditLog } = await import('@/lib/security/account-security')
  await auditLog({
    userId: session!.user.id,
    action: action === 'approve' ? 'member_approved' : 'member_rejected',
    resource: 'user',
    resourceId: user.id,
    metadata: { email: user.email, previousStatus: before.accountStatus, newStatus },
  })

  // Awaited: Vercel freezes the function once the response returns, so an
  // un-awaited send is silently dropped and the member never gets notified.
  // Only a real change sends mail (re-clicking doesn't email twice).
  let emailSent: boolean | null = null
  if (before.accountStatus !== newStatus) {
    const { emailService } = await import('@/lib/email/service')
    const result = action === 'approve'
      ? await emailService.sendAccountApproved(user.email, user.name || 'Member')
      : await emailService.sendAccountRejected(user.email, user.name || 'Member')
    emailSent = result.success
  }

  return NextResponse.json({ user, emailSent })
}
