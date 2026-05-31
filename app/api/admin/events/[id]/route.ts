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

const patchSchema = z.object({
  title: z.string().max(300).nullable().optional(),
  description: z.string().max(10000).nullable().optional(),
  titleFr: z.string().max(300).nullable().optional(),
  descriptionFr: z.string().max(10000).nullable().optional(),
  date: z.string().min(1).optional(),
  time: z.string().max(100).nullable().optional(),
  location: z.string().max(300).nullable().optional(),
  color: z.string().max(30).optional(),
  capacity: z.number().int().positive().nullable().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_EVENTS)
    if (denied) return denied

    const { id } = await params
    const reqBody = await request.json()
    const parsed = patchSchema.safeParse(reqBody)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const actingUserId = session!.user.id

    const before = await prisma.event.findUnique({ where: { id } })
    if (!before) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const merged = {
      title: parsed.data.title !== undefined ? parsed.data.title : before.title,
      description: parsed.data.description !== undefined ? parsed.data.description : before.description,
      titleFr: parsed.data.titleFr !== undefined ? parsed.data.titleFr : before.titleFr,
      descriptionFr: parsed.data.descriptionFr !== undefined ? parsed.data.descriptionFr : before.descriptionFr,
    }

    if (!atLeastOneLanguagePair(merged)) {
      return NextResponse.json(
        { error: 'At least one complete language pair (title + description) is required.' },
        { status: 400 },
      )
    }

    // Block reducing capacity below the current Going count.
    if (parsed.data.capacity !== undefined && parsed.data.capacity !== null) {
      const goingCount = await prisma.rsvp.count({
        where: { eventId: id, response: 'GOING' },
      })
      if (parsed.data.capacity < goingCount) {
        return NextResponse.json(
          { error: `Cannot reduce capacity below current attendees count of ${goingCount} — remove RSVPs or set capacity higher.` },
          { status: 400 },
        )
      }
    }

    const data: Record<string, unknown> = {}
    if (parsed.data.title !== undefined) data.title = trimOrNull(parsed.data.title)
    if (parsed.data.description !== undefined) data.description = trimOrNull(parsed.data.description)
    if (parsed.data.titleFr !== undefined) data.titleFr = trimOrNull(parsed.data.titleFr)
    if (parsed.data.descriptionFr !== undefined) data.descriptionFr = trimOrNull(parsed.data.descriptionFr)
    if (parsed.data.date !== undefined) data.date = new Date(parsed.data.date)
    if (parsed.data.time !== undefined) data.time = trimOrNull(parsed.data.time)
    if (parsed.data.location !== undefined) data.location = trimOrNull(parsed.data.location)
    if (parsed.data.color !== undefined) data.color = parsed.data.color
    if (parsed.data.capacity !== undefined) data.capacity = parsed.data.capacity

    const after = await prisma.event.update({ where: { id }, data })

    await auditLog({
      userId: actingUserId,
      action: 'event_edited',
      resource: 'event',
      resourceId: id,
      metadata: {
        eventId: id,
        before: {
          title: before.title,
          description: before.description,
          titleFr: before.titleFr,
          descriptionFr: before.descriptionFr,
          date: before.date.toISOString(),
          time: before.time,
          location: before.location,
          color: before.color,
          capacity: before.capacity,
        },
        after: {
          title: after.title,
          description: after.description,
          titleFr: after.titleFr,
          descriptionFr: after.descriptionFr,
          date: after.date.toISOString(),
          time: after.time,
          location: after.location,
          color: after.color,
          capacity: after.capacity,
        },
        editedById: actingUserId,
      },
    })

    return NextResponse.json({ event: after })
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_EVENTS)
    if (denied) return denied

    const { id } = await params
    const actingUserId = session!.user.id

    const row = await prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { rsvps: true } } },
    })
    if (!row) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // RSVPs cascade-delete via the onDelete: Cascade relation.
    await prisma.event.delete({ where: { id } })

    await auditLog({
      userId: actingUserId,
      action: 'event_deleted',
      resource: 'event',
      resourceId: id,
      metadata: {
        fullDeletedRow: {
          id: row.id,
          title: row.title,
          description: row.description,
          titleFr: row.titleFr,
          descriptionFr: row.descriptionFr,
          date: row.date.toISOString(),
          time: row.time,
          location: row.location,
          color: row.color,
          capacity: row.capacity,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        },
        rsvpCount: row._count.rsvps,
        deletedById: actingUserId,
      },
    })

    return NextResponse.json({ ok: true })
  })
}
