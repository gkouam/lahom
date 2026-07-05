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
  label: z.string().min(1).max(100).optional(),
  labelFr: z.string().max(100).nullable().optional(),
  caption: z.string().min(1).max(300).optional(),
  captionFr: z.string().max(300).nullable().optional(),
  span: z.enum(['tall', 'wide']).nullable().optional(),
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

    const before = await prisma.galleryImage.findUnique({ where: { id } })
    if (!before) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const after = await prisma.galleryImage.update({ where: { id }, data: parsed.data })

    await auditLog({
      userId: session!.user.id,
      action: 'gallery_image_edited',
      resource: 'gallery_image',
      resourceId: id,
      metadata: {
        before: { label: before.label, labelFr: before.labelFr, caption: before.caption, captionFr: before.captionFr, span: before.span, published: before.published, sortOrder: before.sortOrder },
        after: { label: after.label, labelFr: after.labelFr, caption: after.caption, captionFr: after.captionFr, span: after.span, published: after.published, sortOrder: after.sortOrder },
        editedById: session!.user.id,
      },
    })

    return NextResponse.json({ image: after })
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
    const row = await prisma.galleryImage.findUnique({ where: { id } })
    if (!row) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    await prisma.galleryImage.delete({ where: { id } })

    // Remove the stored file only for Blob uploads — never for the seeded
    // /images/* static files, which live in the repo.
    if (row.url.includes('.public.blob.vercel-storage.com') && process.env.BLOB_READ_WRITE_TOKEN) {
      try { await del(row.url) } catch (e) { console.error('Blob delete failed:', e) }
    }

    await auditLog({
      userId: session!.user.id,
      action: 'gallery_image_deleted',
      resource: 'gallery_image',
      resourceId: id,
      metadata: { fullDeletedRow: { ...row, createdAt: row.createdAt.toISOString() }, deletedById: session!.user.id },
    })

    return NextResponse.json({ ok: true })
  })
}
