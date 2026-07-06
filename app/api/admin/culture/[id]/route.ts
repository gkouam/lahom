import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { del } from '@vercel/blob'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirePermission, PERMISSIONS } from '@/lib/security/permissions'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { auditLog } from '@/lib/security/account-security'

const patchSchema = z.object({
  tag: z.string().min(1).max(60).optional(),
  tagFr: z.string().max(60).nullable().optional(),
  title: z.string().min(1).max(120).optional(),
  titleFr: z.string().max(120).nullable().optional(),
  description: z.string().min(1).max(500).optional(),
  descriptionFr: z.string().max(500).nullable().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_GALLERY)
    if (denied) return denied

    const { id } = await params
    const parsed = patchSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
    }

    const before = await prisma.cultureItem.findUnique({ where: { id } })
    if (!before) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const after = await prisma.cultureItem.update({ where: { id }, data: parsed.data })

    await auditLog({
      userId: session!.user.id,
      action: 'culture_item_edited',
      resource: 'culture_item',
      resourceId: id,
      metadata: {
        before: { tag: before.tag, tagFr: before.tagFr, title: before.title, titleFr: before.titleFr, description: before.description, descriptionFr: before.descriptionFr, published: before.published, sortOrder: before.sortOrder },
        after: { tag: after.tag, tagFr: after.tagFr, title: after.title, titleFr: after.titleFr, description: after.description, descriptionFr: after.descriptionFr, published: after.published, sortOrder: after.sortOrder },
        editedById: session!.user.id,
      },
    })

    return NextResponse.json({ item: after })
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_GALLERY)
    if (denied) return denied

    const { id } = await params
    const row = await prisma.cultureItem.findUnique({ where: { id } })
    if (!row) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    await prisma.cultureItem.delete({ where: { id } })

    // Remove the stored file only for Blob uploads — never the seeded /images/*.
    if (row.url.includes('.public.blob.vercel-storage.com') && process.env.BLOB_READ_WRITE_TOKEN) {
      try { await del(row.url) } catch (e) { console.error('Blob delete failed:', e) }
    }

    await auditLog({
      userId: session!.user.id,
      action: 'culture_item_deleted',
      resource: 'culture_item',
      resourceId: id,
      metadata: { fullDeletedRow: { ...row, createdAt: row.createdAt.toISOString() }, deletedById: session!.user.id },
    })

    return NextResponse.json({ ok: true })
  })
}
