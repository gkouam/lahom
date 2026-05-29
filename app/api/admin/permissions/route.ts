import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { requirePermission, PERMISSIONS } from '@/lib/security/permissions'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { auditLog } from '@/lib/security/account-security'

const ALL_PERMISSIONS = Object.values(PERMISSIONS)

export async function GET() {
  const session = await getServerSession(authOptions)
  const denied = requirePermission(session, PERMISSIONS.MANAGE_PERMISSIONS)
  if (denied) return denied

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      officerTitle: true,
      accountStatus: true,
      userPermissions: {
        select: { permission: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const result = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    officerTitle: u.officerTitle,
    accountStatus: u.accountStatus,
    permissions: u.userPermissions.map(p => p.permission),
  }))

  return NextResponse.json({ users: result })
}

const patchSchema = z.object({
  userId: z.string().min(1),
  action: z.enum(['grant', 'revoke', 'set_title']),
  permission: z.string().optional(),
  officerTitle: z.string().max(100).nullable().optional(),
})

export async function PATCH(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.api.default, async () => {
    const session = await getServerSession(authOptions)
    const denied = requirePermission(session, PERMISSIONS.MANAGE_PERMISSIONS)
    if (denied) return denied

    const body = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { userId, action, permission, officerTitle } = parsed.data
    const actingUserId = session!.user.id

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true },
    })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if ((action === 'grant' || action === 'revoke') && targetUser.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Cannot modify permissions for a Super Admin. Their access is granted by role, not by individual permissions.' },
        { status: 400 },
      )
    }

    if (action === 'grant') {
      if (!permission || !ALL_PERMISSIONS.includes(permission as any)) {
        return NextResponse.json({ error: 'Invalid permission' }, { status: 400 })
      }

      await prisma.userPermission.upsert({
        where: { userId_permission: { userId, permission: permission as any } },
        update: {},
        create: {
          userId,
          permission: permission as any,
          grantedById: actingUserId,
        },
      })

      await auditLog({
        userId: actingUserId,
        action: 'permission_granted',
        resource: 'user_permission',
        resourceId: userId,
        metadata: { permission, targetEmail: targetUser.email },
      })

      return NextResponse.json({ ok: true })
    }

    if (action === 'revoke') {
      if (!permission || !ALL_PERMISSIONS.includes(permission as any)) {
        return NextResponse.json({ error: 'Invalid permission' }, { status: 400 })
      }

      if (permission === PERMISSIONS.MANAGE_PERMISSIONS) {
        const remainingExplicit = await prisma.userPermission.count({
          where: { permission: 'MANAGE_PERMISSIONS', userId: { not: userId } },
        })
        const superAdminCount = await prisma.user.count({
          where: { role: 'SUPER_ADMIN' },
        })
        if (remainingExplicit + superAdminCount === 0) {
          return NextResponse.json(
            { error: 'Cannot remove the last permission manager. At least one user must hold MANAGE_PERMISSIONS or be a Super Admin.' },
            { status: 400 },
          )
        }
      }

      await prisma.userPermission.deleteMany({
        where: { userId, permission: permission as any },
      })

      await auditLog({
        userId: actingUserId,
        action: 'permission_revoked',
        resource: 'user_permission',
        resourceId: userId,
        metadata: { permission, targetEmail: targetUser.email },
      })

      return NextResponse.json({ ok: true })
    }

    if (action === 'set_title') {
      const newTitle = officerTitle?.trim() || null

      await prisma.user.update({
        where: { id: userId },
        data: { officerTitle: newTitle },
      })

      await auditLog({
        userId: actingUserId,
        action: 'officer_title_changed',
        resource: 'user',
        resourceId: userId,
        metadata: { officerTitle: newTitle, targetEmail: targetUser.email },
      })

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  })
}
