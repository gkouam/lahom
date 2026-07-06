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

  const items = await prisma.cultureItem.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json({ items })
}

// Multipart upload: file + tag/title/description (EN required, FR optional).
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
    const tag = String(form.get('tag') || '').trim()
    const tagFr = String(form.get('tagFr') || '').trim() || null
    const title = String(form.get('title') || '').trim()
    const titleFr = String(form.get('titleFr') || '').trim() || null
    const description = String(form.get('description') || '').trim()
    const descriptionFr = String(form.get('descriptionFr') || '').trim() || null

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 })
    }
    if (!tag || !title || !description) {
      return NextResponse.json({ error: 'Tag, title and description are required.' }, { status: 400 })
    }
    if (tag.length > 60 || title.length > 120 || description.length > 500) {
      return NextResponse.json({ error: 'Tag, title or description too long.' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG or WebP images are allowed.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image must be 8 MB or smaller.' }, { status: 400 })
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const blob = await put(`culture/${Date.now()}-${crypto.randomUUID()}.${ext}`, file, {
      access: 'public',
      contentType: file.type,
    })

    const maxOrder = await prisma.cultureItem.aggregate({ _max: { sortOrder: true } })
    const item = await prisma.cultureItem.create({
      data: {
        url: blob.url,
        tag,
        tagFr,
        title,
        titleFr,
        description,
        descriptionFr,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    })

    await auditLog({
      userId: session!.user.id,
      action: 'culture_item_uploaded',
      resource: 'culture_item',
      resourceId: item.id,
      metadata: { url: item.url, title: item.title, size: file.size, type: file.type },
    })

    return NextResponse.json({ item })
  })
}
