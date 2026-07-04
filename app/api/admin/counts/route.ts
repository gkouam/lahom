import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isSuperAdmin, hasAnyPermission } from '@/lib/security/permissions'

// Lightweight counts for admin sidebar badges. Any admin (super admin or a
// permission holder) may read; returns pending-approval members and pending
// membership requests (unread messages).
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(isSuperAdmin(session) || hasAnyPermission(session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [pendingMembers, unreadMessages] = await Promise.all([
    prisma.user.count({ where: { accountStatus: 'PENDING_APPROVAL' } }),
    prisma.membershipRequest.count({ where: { status: 'PENDING' } }),
  ])

  return NextResponse.json({ pendingMembers, unreadMessages })
}
