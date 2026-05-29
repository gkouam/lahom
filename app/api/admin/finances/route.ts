import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirePermission, PERMISSIONS } from '@/lib/security/permissions'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { auditLog } from '@/lib/security/account-security'

export async function GET() {
  const session = await getServerSession(authOptions)
  const denied = requirePermission(session, PERMISSIONS.MANAGE_FINANCES)
  if (denied) return denied

  const users = await prisma.user.findMany({
    where: { accountStatus: 'APPROVED' },
    select: {
      id: true,
      name: true,
      email: true,
      financialStatus: {
        select: {
          standing: true,
          totalContributed: true,
          notes: true,
          updatedAt: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  const result = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    standing: u.financialStatus?.standing || 'NEW',
    totalContributed: u.financialStatus?.totalContributed?.toString() || '0.00',
    notes: u.financialStatus?.notes || null,
    lastUpdated: u.financialStatus?.updatedAt || null,
  }))

  return NextResponse.json({ users: result })
}

const patchSchema = z.object({
  userId: z.string().min(1),
  standing: z.enum(['NEW', 'GOOD_STANDING', 'BEHIND', 'EXEMPT']).optional(),
  notes: z.string().max(2000).nullable().optional(),
})

export async function PATCH(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_FINANCES)
    if (denied) return denied

    const body = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { userId, standing, notes } = parsed.data
    const actingUserId = session!.user.id

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existing = await prisma.memberFinancialStatus.findUnique({
      where: { userId },
    })

    const before = existing
      ? { standing: existing.standing, notes: existing.notes }
      : { standing: 'NEW', notes: null }

    const data: Record<string, unknown> = { lastUpdatedById: actingUserId }
    if (standing !== undefined) data.standing = standing
    if (notes !== undefined) data.notes = notes

    await prisma.memberFinancialStatus.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        standing: standing || 'NEW',
        notes: notes ?? null,
        lastUpdatedById: actingUserId,
      },
    })

    const after = {
      standing: standing ?? before.standing,
      notes: notes !== undefined ? notes : before.notes,
    }

    await auditLog({
      userId: actingUserId,
      action: 'financial_standing_changed',
      resource: 'member_financial_status',
      resourceId: userId,
      metadata: { before, after, changedById: actingUserId, targetEmail: targetUser.email },
    })

    return NextResponse.json({ ok: true })
  })
}
