import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { accountStatus: true },
  })

  if (user?.accountStatus !== 'APPROVED') {
    return NextResponse.json({ error: 'Account not approved' }, { status: 403 })
  }

  const notes = await prisma.meetingNote.findMany({
    orderBy: { date: 'desc' },
    select: {
      id: true,
      title: true,
      titleFr: true,
      body: true,
      bodyFr: true,
      date: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { name: true } },
    },
  })

  return NextResponse.json({ notes })
}
