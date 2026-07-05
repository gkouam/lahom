import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { put } from '@vercel/blob'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirePermission, PERMISSIONS } from '@/lib/security/permissions'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { auditLog } from '@/lib/security/account-security'

const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function GET() {
  const session = await getServerSession(authOptions)
  const denied = requirePermission(session, PERMISSIONS.MANAGE_GALLERY)
  if (denied) return denied

  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json({ images })
}

// Multipart upload: file + label/caption (EN required, FR optional) + span.
export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_GALLERY)
    if (denied) return denied

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Image storage is not configured (BLOB_READ_WRITE_TOKEN missing).' },
        { status: 503 },
      )
    }

    const form = await request.formData()
    const file = form.get('file')
    const label = String(form.get('label') || '').trim()
    const labelFr = String(form.get('labelFr') || '').trim() || null
    const caption = String(form.get('caption') || '').trim()
    const captionFr = String(form.get('captionFr') || '').trim() || null
    const spanRaw = String(form.get('span') || '').trim()
    const span = spanRaw === 'tall' || spanRaw === 'wide' ? spanRaw : null

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 })
    }
    if (!label || !caption) {
      return NextResponse.json({ error: 'Label and caption are required.' }, { status: 400 })
    }
    if (label.length > 100 || caption.length > 300) {
      return NextResponse.json({ error: 'Label or caption too long.' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG or WebP images are allowed.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image must be 8 MB or smaller.' }, { status: 400 })
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const blob = await put(`gallery/${Date.now()}-${crypto.randomUUID()}.${ext}`, file, {
      access: 'public',
      contentType: file.type,
    })

    const maxOrder = await prisma.galleryImage.aggregate({ _max: { sortOrder: true } })
    const image = await prisma.galleryImage.create({
      data: {
        url: blob.url,
        label,
        labelFr,
        caption,
        captionFr,
        span,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
        uploadedById: session!.user.id,
      },
    })

    await auditLog({
      userId: session!.user.id,
      action: 'gallery_image_uploaded',
      resource: 'gallery_image',
      resourceId: image.id,
      metadata: { url: image.url, label: image.label, size: file.size, type: file.type },
    })

    return NextResponse.json({ image })
  })
}
