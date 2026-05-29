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

const atLeastOneLanguagePair = (data: { title?: string | null; body?: string | null; titleFr?: string | null; bodyFr?: string | null }) => {
  const hasEn = !!(trimOrNull(data.title) && trimOrNull(data.body))
  const hasFr = !!(trimOrNull(data.titleFr) && trimOrNull(data.bodyFr))
  return hasEn || hasFr
}

const patchSchema = z.object({
  title: z.string().max(500).nullable().optional(),
  body: z.string().max(50000).nullable().optional(),
  titleFr: z.string().max(500).nullable().optional(),
  bodyFr: z.string().max(50000).nullable().optional(),
  date: z.string().min(1).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_MEETINGS)
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

    const before = await prisma.meetingNote.findUnique({ where: { id } })
    if (!before) {
      return NextResponse.json({ error: 'Meeting note not found' }, { status: 404 })
    }

    const merged = {
      title: parsed.data.title !== undefined ? parsed.data.title : before.title,
      body: parsed.data.body !== undefined ? parsed.data.body : before.body,
      titleFr: parsed.data.titleFr !== undefined ? parsed.data.titleFr : before.titleFr,
      bodyFr: parsed.data.bodyFr !== undefined ? parsed.data.bodyFr : before.bodyFr,
    }

    if (!atLeastOneLanguagePair(merged)) {
      return NextResponse.json(
        { error: 'At least one complete language pair (title + body) is required.' },
        { status: 400 },
      )
    }

    const data: Record<string, unknown> = {}
    if (parsed.data.title !== undefined) data.title = trimOrNull(parsed.data.title)
    if (parsed.data.body !== undefined) data.body = trimOrNull(parsed.data.body)
    if (parsed.data.titleFr !== undefined) data.titleFr = trimOrNull(parsed.data.titleFr)
    if (parsed.data.bodyFr !== undefined) data.bodyFr = trimOrNull(parsed.data.bodyFr)
    if (parsed.data.date !== undefined) data.date = new Date(parsed.data.date)

    const after = await prisma.meetingNote.update({ where: { id }, data })

    await auditLog({
      userId: actingUserId,
      action: 'meeting_note_edited',
      resource: 'meeting_note',
      resourceId: id,
      metadata: {
        noteId: id,
        before: {
          title: before.title,
          body: before.body,
          titleFr: before.titleFr,
          bodyFr: before.bodyFr,
          date: before.date.toISOString(),
        },
        after: {
          title: after.title,
          body: after.body,
          titleFr: after.titleFr,
          bodyFr: after.bodyFr,
          date: after.date.toISOString(),
        },
        editedById: actingUserId,
      },
    })

    return NextResponse.json({ note: after })
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_MEETINGS)
    if (denied) return denied

    const { id } = await params
    const actingUserId = session!.user.id

    const row = await prisma.meetingNote.findUnique({ where: { id } })
    if (!row) {
      return NextResponse.json({ error: 'Meeting note not found' }, { status: 404 })
    }

    await prisma.meetingNote.delete({ where: { id } })

    await auditLog({
      userId: actingUserId,
      action: 'meeting_note_deleted',
      resource: 'meeting_note',
      resourceId: id,
      metadata: {
        fullDeletedRow: {
          id: row.id,
          title: row.title,
          body: row.body,
          titleFr: row.titleFr,
          bodyFr: row.bodyFr,
          date: row.date.toISOString(),
          authorId: row.authorId,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        },
        deletedById: actingUserId,
      },
    })

    return NextResponse.json({ ok: true })
  })
}
