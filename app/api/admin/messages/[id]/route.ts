import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requireAnyPermission, PERMISSIONS } from '@/lib/security/permissions'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { auditLog } from '@/lib/security/account-security'

const patchSchema = z.object({ action: z.enum(['approve', 'decline']) })

// Approve/decline a message from the website. Approve marks it APPROVED and
// emails the person a link to create their member account (the sign-up form,
// with their address filled in); the account itself still goes through email
// verification and officer approval. Decline marks it REJECTED, sends nothing.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requireAnyPermission(session, [PERMISSIONS.MANAGE_MEMBERS])
    if (denied) return denied

    const { id } = await params
    const parsed = patchSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const existing = await prisma.membershipRequest.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    const status = parsed.data.action === 'approve' ? 'APPROVED' : 'REJECTED'
    const updated = await prisma.membershipRequest.update({ where: { id }, data: { status } })

    let inviteSent: boolean | null = null
    if (status === 'APPROVED' && existing.status !== 'APPROVED') {
      const { emailService } = await import('@/lib/email/service')
      const result = await emailService.sendMemberInvite(existing.email, existing.name)
      inviteSent = result.success
    }

    await auditLog({
      userId: session!.user.id,
      action: parsed.data.action === 'approve' ? 'membership_request_approved' : 'membership_request_declined',
      resource: 'membership_request',
      resourceId: id,
      metadata: { email: existing.email, name: existing.name, previousStatus: existing.status, newStatus: status, inviteSent },
    })

    return NextResponse.json({ request: updated, inviteSent })
  })
}
