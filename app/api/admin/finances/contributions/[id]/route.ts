import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirePermission, PERMISSIONS } from '@/lib/security/permissions'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { auditLog } from '@/lib/security/account-security'
import { Prisma } from '@prisma/client'

const patchSchema = z.object({
  amount: z.string().refine(v => {
    const d = new Prisma.Decimal(v)
    return d.greaterThan(0)
  }, 'Amount must be greater than 0').optional(),
  date: z.string().min(1).optional(),
  method: z.string().max(100).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_FINANCES)
    if (denied) return denied

    const { id } = await params
    const body = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const actingUserId = session!.user.id

    const updated = await prisma.$transaction(async (tx) => {
      const before = await tx.contribution.findUnique({ where: { id } })
      if (!before) throw new Error('NOT_FOUND')

      const data: Record<string, unknown> = {}
      if (parsed.data.amount !== undefined) data.amount = new Prisma.Decimal(parsed.data.amount)
      if (parsed.data.date !== undefined) data.date = new Date(parsed.data.date)
      if (parsed.data.method !== undefined) data.method = parsed.data.method
      if (parsed.data.description !== undefined) data.description = parsed.data.description

      const after = await tx.contribution.update({ where: { id }, data })

      const agg = await tx.contribution.aggregate({
        where: { userId: before.userId },
        _sum: { amount: true },
      })
      const newTotal = agg._sum.amount || new Prisma.Decimal(0)

      await tx.memberFinancialStatus.upsert({
        where: { userId: before.userId },
        update: { totalContributed: newTotal, lastUpdatedById: actingUserId },
        create: {
          userId: before.userId,
          totalContributed: newTotal,
          lastUpdatedById: actingUserId,
        },
      })

      await auditLog({
        userId: actingUserId,
        action: 'contribution_edited',
        resource: 'contribution',
        resourceId: id,
        metadata: {
          contributionId: id,
          before: {
            amount: before.amount.toString(),
            date: before.date.toISOString(),
            method: before.method,
            description: before.description,
          },
          after: {
            amount: after.amount.toString(),
            date: after.date.toISOString(),
            method: after.method,
            description: after.description,
          },
          editedById: actingUserId,
        },
      })

      return after
    })

    return NextResponse.json({
      contribution: { ...updated, amount: updated.amount.toString() },
    })
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_FINANCES)
    if (denied) return denied

    const { id } = await params
    const actingUserId = session!.user.id

    await prisma.$transaction(async (tx) => {
      const row = await tx.contribution.findUnique({ where: { id } })
      if (!row) throw new Error('NOT_FOUND')

      await tx.contribution.delete({ where: { id } })

      const agg = await tx.contribution.aggregate({
        where: { userId: row.userId },
        _sum: { amount: true },
      })
      const newTotal = agg._sum.amount || new Prisma.Decimal(0)

      await tx.memberFinancialStatus.upsert({
        where: { userId: row.userId },
        update: { totalContributed: newTotal, lastUpdatedById: actingUserId },
        create: {
          userId: row.userId,
          totalContributed: newTotal,
          lastUpdatedById: actingUserId,
        },
      })

      await auditLog({
        userId: actingUserId,
        action: 'contribution_deleted',
        resource: 'contribution',
        resourceId: id,
        metadata: {
          fullDeletedRow: {
            id: row.id,
            userId: row.userId,
            amount: row.amount.toString(),
            date: row.date.toISOString(),
            method: row.method,
            description: row.description,
            recordedById: row.recordedById,
            createdAt: row.createdAt.toISOString(),
          },
          deletedById: actingUserId,
        },
      })
    })

    return NextResponse.json({ ok: true })
  })
}
