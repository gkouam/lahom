import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirePermission, PERMISSIONS } from '@/lib/security/permissions'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { auditLog } from '@/lib/security/account-security'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = requirePermission(session, PERMISSIONS.MANAGE_FINANCES)
  if (denied) return denied

  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  const contributions = await prisma.contribution.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    select: {
      id: true,
      amount: true,
      date: true,
      method: true,
      description: true,
      recordedById: true,
      createdAt: true,
    },
  })

  const result = contributions.map(c => ({
    ...c,
    amount: c.amount.toString(),
  }))

  return NextResponse.json({ contributions: result })
}

const postSchema = z.object({
  userId: z.string().min(1),
  amount: z.string().refine(v => {
    const d = new Prisma.Decimal(v)
    return d.greaterThan(0)
  }, 'Amount must be greater than 0'),
  date: z.string().min(1),
  method: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
})

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_FINANCES)
    if (denied) return denied

    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { userId, amount, date, method, description } = parsed.data
    const actingUserId = session!.user.id

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const contribution = await prisma.$transaction(async (tx) => {
      const row = await tx.contribution.create({
        data: {
          userId,
          amount: new Prisma.Decimal(amount),
          date: new Date(date),
          method: method || null,
          description: description || null,
          recordedById: actingUserId,
        },
      })

      const agg = await tx.contribution.aggregate({
        where: { userId },
        _sum: { amount: true },
      })
      const newTotal = agg._sum.amount || new Prisma.Decimal(0)

      await tx.memberFinancialStatus.upsert({
        where: { userId },
        update: { totalContributed: newTotal, lastUpdatedById: actingUserId },
        create: {
          userId,
          totalContributed: newTotal,
          lastUpdatedById: actingUserId,
        },
      })

      await auditLog({
        userId: actingUserId,
        action: 'contribution_recorded',
        resource: 'contribution',
        resourceId: row.id,
        metadata: {
          userId,
          amount: row.amount.toString(),
          date: row.date.toISOString(),
          method: row.method,
          description: row.description,
          recordedById: actingUserId,
          targetEmail: targetUser.email,
        },
      })

      return row
    })

    return NextResponse.json({
      contribution: { ...contribution, amount: contribution.amount.toString() },
    })
  })
}
