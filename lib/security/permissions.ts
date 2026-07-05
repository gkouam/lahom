import { NextResponse } from 'next/server'
import type { Session } from 'next-auth'

export const PERMISSIONS = {
  MANAGE_MEMBERS: 'MANAGE_MEMBERS',
  VIEW_MEMBERS: 'VIEW_MEMBERS',
  MANAGE_FINANCES: 'MANAGE_FINANCES',
  MANAGE_MEETINGS: 'MANAGE_MEETINGS',
  MANAGE_EVENTS: 'MANAGE_EVENTS',
  MANAGE_PERMISSIONS: 'MANAGE_PERMISSIONS',
  MANAGE_GALLERY: 'MANAGE_GALLERY',
} as const

export type PermissionKey = keyof typeof PERMISSIONS

export function isSuperAdmin(session: Session | null): boolean {
  return session?.user?.role === 'SUPER_ADMIN'
}

export function hasPermission(session: Session | null, permission: string): boolean {
  if (!session?.user) return false
  if (session.user.role === 'SUPER_ADMIN') return true
  return session.user.permissions?.includes(permission) ?? false
}

export function hasAnyPermission(session: Session | null): boolean {
  if (!session?.user) return false
  if (session.user.role === 'SUPER_ADMIN') return true
  return (session.user.permissions?.length ?? 0) > 0
}

export function requirePermission(
  session: Session | null,
  permission: string,
): NextResponse | null {
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role === 'SUPER_ADMIN') return null
  if (session.user.permissions?.includes(permission)) return null
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export function requireAnyPermission(
  session: Session | null,
  permissions: string[],
): NextResponse | null {
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role === 'SUPER_ADMIN') return null
  const userPerms = session.user.permissions ?? []
  if (permissions.some(p => userPerms.includes(p))) return null
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
