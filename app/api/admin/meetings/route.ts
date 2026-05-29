import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirePermission, PERMISSIONS } from '@/lib/security/permissions'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { auditLog } from '@/lib/security/account-security'

export async function GET() {
  const session = await getServerSession(authOptions)
  const denied = requirePermission(session, PERMISSIONS.MANAGE_MEETINGS)
  if (denied) return denied

  const notes = await prisma.meetingNote.findMany({
    orderBy: { date: 'desc' },
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  })

  return NextResponse.json({ notes })
}

const trimOrNull = (v: string | null | undefined): string | null =>
  v?.trim() || null

const atLeastOneLanguagePair = (data: { title?: string | null; body?: string | null; titleFr?: string | null; bodyFr?: string | null }) => {
  const hasEn = !!(trimOrNull(data.title) && trimOrNull(data.body))
  const hasFr = !!(trimOrNull(data.titleFr) && trimOrNull(data.bodyFr))
  return hasEn || hasFr
}

const postSchema = z.object({
  title: z.string().max(500).nullable().optional(),
  body: z.string().max(50000).nullable().optional(),
  titleFr: z.string().max(500).nullable().optional(),
  bodyFr: z.string().max(50000).nullable().optional(),
  date: z.string().min(1),
}).refine(atLeastOneLanguagePair, {
  message: 'At least one complete language pair (title + body) is required.',
})

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_MEETINGS)
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
    const noteBody = trimOrNull(parsed.data.body)
    const titleFr = trimOrNull(parsed.data.titleFr)
    const bodyFr = trimOrNull(parsed.data.bodyFr)
    const { date } = parsed.data

    const hasEn = !!(title && noteBody)
    const hasFr = !!(titleFr && bodyFr)
    const languageCoverage = hasEn && hasFr ? 'EN+FR' : hasEn ? 'EN' : 'FR'

    const note = await prisma.meetingNote.create({
      data: {
        title,
        body: noteBody,
        titleFr,
        bodyFr,
        date: new Date(date),
        authorId: actingUserId,
      },
    })

    await auditLog({
      userId: actingUserId,
      action: 'meeting_note_created',
      resource: 'meeting_note',
      resourceId: note.id,
      metadata: { noteId: note.id, languageCoverage, createdById: actingUserId },
    })

    return NextResponse.json({ note })
  })
}
