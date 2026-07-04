import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requireAnyPermission, PERMISSIONS } from '@/lib/security/permissions'

// Membership requests (join form) surfaced as admin messages.
export async function GET() {
  const session = await getServerSession(authOptions)
  const denied = requireAnyPermission(session, [PERMISSIONS.MANAGE_MEMBERS])
  if (denied) return denied

  const requests = await prisma.membershipRequest.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, email: true, name: true, phone: true,
      hometown: true, message: true, status: true, createdAt: true,
    },
  })

  return NextResponse.json({ requests })
}
