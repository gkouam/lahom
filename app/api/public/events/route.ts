import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Public, unauthenticated. Returns upcoming events with capacity STATUS only —
// never names or the RSVP roster (those are for approved members via /api/events).
export async function GET() {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const events = await prisma.event.findMany({
    where: { date: { gte: startOfToday } },
    orderBy: { date: 'asc' },
    take: 12,
    select: {
      id: true,
      title: true,
      titleFr: true,
      description: true,
      descriptionFr: true,
      date: true,
      time: true,
      location: true,
      color: true,
      capacity: true,
      _count: { select: { rsvps: { where: { response: 'GOING' } } } },
    },
  })

  const result = events.map(e => ({
    id: e.id,
    title: e.title,
    titleFr: e.titleFr,
    description: e.description,
    descriptionFr: e.descriptionFr,
    date: e.date,
    time: e.time,
    location: e.location,
    color: e.color,
    isFull: e.capacity !== null && e._count.rsvps >= e.capacity,
  }))

  return NextResponse.json({ events: result })
}
