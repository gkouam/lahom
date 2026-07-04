import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requireAnyPermission, PERMISSIONS } from '@/lib/security/permissions'
import { Prisma } from '@prisma/client'

// Community-health aggregates for the admin reports page.
// period: 'ytd' | '12mo' | 'all' (affects dues total, attendance avg, table).
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const denied = requireAnyPermission(session, [PERMISSIONS.MANAGE_MEMBERS, PERMISSIONS.MANAGE_FINANCES])
  if (denied) return denied

  const period = request.nextUrl.searchParams.get('period') || 'ytd'
  const now = new Date()
  let start: Date | null
  if (period === 'all') start = null
  else if (period === '12mo') start = new Date(now.getFullYear(), now.getMonth() - 11, 1)
  else start = new Date(now.getFullYear(), 0, 1) // ytd

  const dateFilter = start ? { gte: start } : undefined

  const [activeMembers, behindOnDues, contributions, events, growthUsers] = await Promise.all([
    prisma.user.count({ where: { accountStatus: 'APPROVED' } }),
    prisma.memberFinancialStatus.count({ where: { standing: 'BEHIND' } }),
    prisma.contribution.findMany({
      where: dateFilter ? { date: dateFilter } : undefined,
      select: { amount: true, date: true },
    }),
    prisma.event.findMany({
      where: dateFilter ? { date: dateFilter } : undefined,
      orderBy: { date: 'desc' },
      select: {
        id: true, title: true, titleFr: true, date: true,
        rsvps: { select: { response: true } },
      },
    }),
    prisma.user.findMany({
      where: { accountStatus: 'APPROVED' },
      select: { createdAt: true },
    }),
  ])

  // Dues collected in range
  const duesCollected = contributions
    .reduce((acc, c) => acc.plus(c.amount), new Prisma.Decimal(0))
    .toFixed(2)

  // Average event attendance (GOING per event) across events in range
  const eventStats = events.map(e => {
    const going = e.rsvps.filter(r => r.response === 'GOING').length
    const total = e.rsvps.length
    const turnout = total > 0 ? Math.round((going / total) * 100) : 0
    return { id: e.id, title: e.title, titleFr: e.titleFr, date: e.date, rsvpd: total, attended: going, turnout }
  })
  const avgAttendance = eventStats.length
    ? Math.round(eventStats.reduce((s, e) => s + e.attended, 0) / eventStats.length)
    : 0

  // Trailing 6 months of buckets for the two charts
  const months: { key: string; label: string }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
    })
  }
  const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

  const membershipGrowth = months.map(m => ({
    label: m.label,
    value: growthUsers.filter(u => monthKey(u.createdAt) === m.key).length,
  }))
  const contributionsByMonth = months.map(m => ({
    label: m.label,
    value: Number(
      contributions
        .filter(c => monthKey(c.date) === m.key)
        .reduce((acc, c) => acc.plus(c.amount), new Prisma.Decimal(0))
        .toFixed(2),
    ),
  }))

  return NextResponse.json({
    period,
    stats: { activeMembers, duesCollected, avgAttendance, behindOnDues },
    charts: { membershipGrowth, contributionsByMonth },
    attendance: eventStats.slice(0, 10).map(e => ({
      id: e.id, title: e.title, titleFr: e.titleFr,
      date: e.date, rsvpd: e.rsvpd, attended: e.attended, turnout: e.turnout,
    })),
  })
}
