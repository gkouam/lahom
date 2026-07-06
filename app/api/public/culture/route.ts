import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Public, unauthenticated. Published culture items in display order.
export async function GET() {
  const items = await prisma.cultureItem.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      url: true,
      tag: true,
      tagFr: true,
      title: true,
      titleFr: true,
      description: true,
      descriptionFr: true,
    },
  })
  return NextResponse.json({ items })
}
