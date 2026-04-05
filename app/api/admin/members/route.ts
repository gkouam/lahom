import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      hometown: true,
      role: true,
      accountStatus: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ users })
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { userId, action } = await request.json()

  if (!userId || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'

  const user = await prisma.user.update({
    where: { id: userId },
    data: { accountStatus: newStatus },
    select: { id: true, email: true, name: true, accountStatus: true },
  })

  // Send approval email
  if (action === 'approve') {
    const { emailService } = await import('@/lib/email/service')
    emailService.sendAccountApproved(user.email, user.name || 'Member').catch(err => {
      console.error('Failed to send approval email:', err)
    })
  }

  return NextResponse.json({ user })
}
