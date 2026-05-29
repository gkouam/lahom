import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const status = await prisma.memberFinancialStatus.findUnique({
    where: { userId },
    select: {
      standing: true,
      totalContributed: true,
      updatedAt: true,
    },
  })

  const contributions = await prisma.contribution.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    select: {
      id: true,
      amount: true,
      date: true,
      method: true,
      description: true,
      createdAt: true,
    },
  })

  return NextResponse.json({
    standing: status?.standing || 'NEW',
    totalContributed: status?.totalContributed?.toString() || '0.00',
    lastUpdated: status?.updatedAt || null,
    contributions: contributions.map(c => ({
      ...c,
      amount: c.amount.toString(),
    })),
  })
}
