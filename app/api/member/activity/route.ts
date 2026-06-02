import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Curated community + personal activity feed for the member dashboard.
// Built from focused queries against existing tables — NOT the audit log.
// All queries run in parallel; the client resolves language and builds strings.
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { accountStatus: true },
  })
  if (me?.accountStatus !== 'APPROVED') {
    return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
  }

  const now = new Date()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    notes,
    eventsCreated,
    capacityEvents,
    myRsvps,
    myContribs,
    newMembers,
    memberCount,
    attendanceCount,
  ] = await Promise.all([
    prisma.meetingNote.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, titleFr: true, createdAt: true },
    }),
    prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, titleFr: true, date: true, createdAt: true },
    }),
    prisma.event.findMany({
      where: { capacity: { not: null }, date: { gte: startOfToday } },
      select: {
        id: true, title: true, titleFr: true, capacity: true,
        _count: { select: { rsvps: { where: { response: 'GOING' } } } },
      },
    }),
    prisma.rsvp.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true, response: true, updatedAt: true,
        event: { select: { id: true, title: true, titleFr: true } },
      },
    }),
    prisma.contribution.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, amount: true, date: true, createdAt: true },
    }),
    prisma.user.findMany({
      where: { accountStatus: 'APPROVED', updatedAt: { gte: sevenDaysAgo } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, name: true, updatedAt: true },
    }),
    prisma.user.count({ where: { accountStatus: 'APPROVED' } }),
    prisma.rsvp.count({ where: { userId, response: 'GOING' } }),
  ])

  type FeedItem = {
    id: string
    category: 'community' | 'personal'
    kind: string
    timestamp: string
    link: string | null
    title?: string | null
    titleFr?: string | null
    date?: string | null
    amount?: string | null
    name?: string | null
    response?: string | null
    spotsLeft?: number | null
  }

  const feed: FeedItem[] = []

  for (const n of notes) {
    feed.push({
      id: `note-${n.id}`, category: 'community', kind: 'meeting_note',
      timestamp: n.createdAt.toISOString(), link: '/dashboard/meetings',
      title: n.title, titleFr: n.titleFr,
    })
  }

  for (const e of eventsCreated) {
    feed.push({
      id: `event-${e.id}`, category: 'community', kind: 'event_created',
      timestamp: e.createdAt.toISOString(), link: '/dashboard/events',
      title: e.title, titleFr: e.titleFr, date: e.date.toISOString(),
    })
  }

  for (const e of capacityEvents) {
    const going = e._count.rsvps
    const cap = e.capacity!
    if (going >= Math.ceil(cap * 0.75) && going < cap) {
      // State-based signal: timestamp "now" so it surfaces near the top.
      feed.push({
        id: `filling-${e.id}`, category: 'community', kind: 'event_filling',
        timestamp: now.toISOString(), link: '/dashboard/events',
        title: e.title, titleFr: e.titleFr, spotsLeft: cap - going,
      })
    }
  }

  for (const r of myRsvps) {
    feed.push({
      id: `rsvp-${r.id}`, category: 'personal', kind: 'rsvp',
      timestamp: r.updatedAt.toISOString(), link: '/dashboard/events',
      title: r.event.title, titleFr: r.event.titleFr, response: r.response,
    })
  }

  for (const c of myContribs) {
    feed.push({
      id: `contrib-${c.id}`, category: 'personal', kind: 'contribution',
      timestamp: c.createdAt.toISOString(), link: null,
      amount: c.amount.toString(), date: c.date.toISOString(),
    })
  }

  for (const m of newMembers) {
    if (m.id === userId) continue // don't welcome yourself
    feed.push({
      id: `member-${m.id}`, category: 'community', kind: 'new_member',
      timestamp: m.updatedAt.toISOString(), link: null,
      name: m.name || null,
    })
  }

  feed.sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  return NextResponse.json({
    feed: feed.slice(0, 20),
    stats: { memberCount, attendanceCount },
  })
}
