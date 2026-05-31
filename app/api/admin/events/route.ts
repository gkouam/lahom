import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirePermission, PERMISSIONS } from '@/lib/security/permissions'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { auditLog } from '@/lib/security/account-security'

const trimOrNull = (v: string | null | undefined): string | null =>
  v?.trim() || null

const atLeastOneLanguagePair = (data: { title?: string | null; description?: string | null; titleFr?: string | null; descriptionFr?: string | null }) => {
  const hasEn = !!(trimOrNull(data.title) && trimOrNull(data.description))
  const hasFr = !!(trimOrNull(data.titleFr) && trimOrNull(data.descriptionFr))
  return hasEn || hasFr
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const denied = requirePermission(session, PERMISSIONS.MANAGE_EVENTS)
  if (denied) return denied

  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    include: {
      rsvps: { select: { response: true } },
    },
  })

  const result = events.map(e => {
    const going = e.rsvps.filter(r => r.response === 'GOING').length
    const maybe = e.rsvps.filter(r => r.response === 'MAYBE').length
    const notGoing = e.rsvps.filter(r => r.response === 'NOT_GOING').length
    const { rsvps, ...rest } = e
    return {
      ...rest,
      counts: { going, maybe, notGoing },
      capacityFull: e.capacity !== null && going >= e.capacity,
    }
  })

  return NextResponse.json({ events: result })
}

const postSchema = z.object({
  title: z.string().max(300).nullable().optional(),
  description: z.string().max(10000).nullable().optional(),
  titleFr: z.string().max(300).nullable().optional(),
  descriptionFr: z.string().max(10000).nullable().optional(),
  date: z.string().min(1),
  time: z.string().max(100).nullable().optional(),
  location: z.string().max(300).nullable().optional(),
  color: z.string().max(30).optional(),
  capacity: z.number().int().positive().nullable().optional(),
}).refine(atLeastOneLanguagePair, {
  message: 'At least one complete language pair (title + description) is required.',
})

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_EVENTS)
    if (denied) return denied

    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const actingUserId = session!.user.id
    const title = trimOrNull(parsed.data.title)
    const description = trimOrNull(parsed.data.description)
    const titleFr = trimOrNull(parsed.data.titleFr)
    const descriptionFr = trimOrNull(parsed.data.descriptionFr)

    const event = await prisma.event.create({
      data: {
        title,
        titleFr,
        description,
        descriptionFr,
        date: new Date(parsed.data.date),
        time: trimOrNull(parsed.data.time),
        location: trimOrNull(parsed.data.location),
        color: parsed.data.color || 'red',
        capacity: parsed.data.capacity ?? null,
      },
    })

    const hasEn = !!(title && description)
    const hasFr = !!(titleFr && descriptionFr)
    const languageCoverage = hasEn && hasFr ? 'EN+FR' : hasEn ? 'EN' : 'FR'

    await auditLog({
      userId: actingUserId,
      action: 'event_created',
      resource: 'event',
      resourceId: event.id,
      metadata: { eventId: event.id, languageCoverage, capacity: event.capacity, createdById: actingUserId },
    })

    return NextResponse.json({ event })
  })
}
