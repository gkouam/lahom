import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requireAnyPermission, PERMISSIONS } from '@/lib/security/permissions'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { auditLog } from '@/lib/security/account-security'

const patchSchema = z.object({ action: z.enum(['approve', 'decline']) })

// Approve/decline a membership request. Approve marks it APPROVED so the
// requester can be invited to register; decline marks it REJECTED. Neither
// creates a User account (self-registration happens at /auth/signup).
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

    await auditLog({
      userId: session!.user.id,
      action: parsed.data.action === 'approve' ? 'membership_request_approved' : 'membership_request_declined',
      resource: 'membership_request',
      resourceId: id,
      metadata: { email: existing.email, name: existing.name, previousStatus: existing.status, newStatus: status },
    })

    return NextResponse.json({ request: updated })
  })
}
