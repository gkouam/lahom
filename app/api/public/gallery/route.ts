import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Public, unauthenticated. Published gallery images in display order —
// bilingual labels/captions only, no uploader identity.
export async function GET() {
  const images = await prisma.galleryImage.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      url: true,
      label: true,
      labelFr: true,
      caption: true,
      captionFr: true,
      span: true,
    },
  })
  return NextResponse.json({ images })
}
