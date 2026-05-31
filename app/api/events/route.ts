import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Returns upcoming events (date >= start of today). With ?include=past, also returns
// the 50 most recent past events. Requires an authenticated, APPROVED member.
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { accountStatus: true },
  })
  if (me?.accountStatus !== 'APPROVED') {
    return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
  }

  const userId = session.user.id
  const includePast = request.nextUrl.searchParams.get('include') === 'past'

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const shape = (e: {
    id: string; title: string | null; titleFr: string | null
    description: string | null; descriptionFr: string | null
    date: Date; time: string | null; location: string | null
    color: string; capacity: number | null
    rsvps: { userId: string; response: string }[]
  }) => {
    const going = e.rsvps.filter(r => r.response === 'GOING').length
    const maybe = e.rsvps.filter(r => r.response === 'MAYBE').length
    const notGoing = e.rsvps.filter(r => r.response === 'NOT_GOING').length
    const myRsvp = e.rsvps.find(r => r.userId === userId)?.response || null
    return {
      id: e.id,
      title: e.title,
      titleFr: e.titleFr,
      description: e.description,
      descriptionFr: e.descriptionFr,
      date: e.date,
      time: e.time,
      location: e.location,
      color: e.color,
      capacity: e.capacity,
      counts: { going, maybe, notGoing },
      capacityFull: e.capacity !== null && going >= e.capacity,
      myRsvp,
    }
  }

  const upcoming = await prisma.event.findMany({
    where: { date: { gte: startOfToday } },
    orderBy: { date: 'asc' },
    include: { rsvps: { select: { userId: true, response: true } } },
  })

  const response: Record<string, unknown> = { upcoming: upcoming.map(shape) }

  if (includePast) {
    const past = await prisma.event.findMany({
      where: { date: { lt: startOfToday } },
      orderBy: { date: 'desc' },
      take: 50,
      include: { rsvps: { select: { userId: true, response: true } } },
    })
    response.past = past.map(shape)
  }

  return NextResponse.json(response)
}
