import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Single event detail including the full named roster per response.
// Names are exposed only to authenticated, APPROVED members.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params
  const userId = session.user.id

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      rsvps: {
        select: {
          userId: true,
          response: true,
          user: { select: { name: true, email: true } },
        },
      },
    },
  })

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  const roster = (resp: string) =>
    event.rsvps
      .filter(r => r.response === resp)
      .map(r => ({ name: r.user.name || r.user.email }))

  const going = roster('GOING')
  const maybe = roster('MAYBE')
  const notGoing = roster('NOT_GOING')

  return NextResponse.json({
    event: {
      id: event.id,
      title: event.title,
      titleFr: event.titleFr,
      description: event.description,
      descriptionFr: event.descriptionFr,
      date: event.date,
      time: event.time,
      location: event.location,
      color: event.color,
      capacity: event.capacity,
      counts: { going: going.length, maybe: maybe.length, notGoing: notGoing.length },
      capacityFull: event.capacity !== null && going.length >= event.capacity,
      myRsvp: event.rsvps.find(r => r.userId === userId)?.response || null,
      roster: { going, maybe, notGoing },
    },
  })
}
