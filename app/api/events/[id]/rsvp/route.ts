import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { withRateLimit } from '@/lib/security/rate-limiter'

// Tighter than the default API limit to discourage rapid RSVP toggling.
const rsvpRateLimit = { windowMs: 60 * 1000, max: 20, skipSuccessfulRequests: false }

const postSchema = z.object({
  response: z.enum(['GOING', 'MAYBE', 'NOT_GOING']),
})

async function requireApproved(userId: string) {
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { accountStatus: true },
  })
  return me?.accountStatus === 'APPROVED'
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rsvpRateLimit, async () => {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!(await requireApproved(session.user.id))) {
      return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
    }

    const { id: eventId } = await params
    const userId = session.user.id
    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }
    const { response } = parsed.data

    try {
      const rsvp = await prisma.$transaction(async (tx) => {
        // Lock the event row for the duration of the transaction so concurrent
        // GOING RSVPs are serialized and the capacity check is race-safe.
        const locked = await tx.$queryRaw<
          { id: string; capacity: number | null; date: Date }[]
        >`SELECT id, capacity, date FROM "Event" WHERE id = ${eventId} FOR UPDATE`

        if (locked.length === 0) throw new Error('NOT_FOUND')
        const event = locked[0]

        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)
        if (event.date < startOfToday) throw new Error('EVENT_PASSED')

        if (response === 'GOING' && event.capacity !== null) {
          // Count Going excluding this member's own row; after this op the member
          // occupies one spot, so reject when the others already fill capacity.
          const othersGoing = await tx.rsvp.count({
            where: { eventId, response: 'GOING', userId: { not: userId } },
          })
          if (othersGoing >= event.capacity) throw new Error('EVENT_FULL')
        }

        return tx.rsvp.upsert({
          where: { userId_eventId: { userId, eventId } },
          update: { response },
          create: { userId, eventId, response },
        })
      })

      return NextResponse.json({ rsvp })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'UNKNOWN'
      if (msg === 'NOT_FOUND') return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      if (msg === 'EVENT_PASSED') return NextResponse.json({ error: 'This event has already passed.' }, { status: 400 })
      if (msg === 'EVENT_FULL') return NextResponse.json({ error: 'Event is full.' }, { status: 409 })
      throw err
    }
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rsvpRateLimit, async () => {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!(await requireApproved(session.user.id))) {
      return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
    }

    const { id: eventId } = await params
    const userId = session.user.id

    await prisma.rsvp.deleteMany({ where: { userId, eventId } })

    return NextResponse.json({ ok: true })
  })
}
