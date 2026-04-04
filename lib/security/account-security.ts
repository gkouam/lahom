import { prisma } from '@/lib/db'

const LOCKOUT_CONFIG = {
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000,
  ATTEMPT_WINDOW_MS: 15 * 60 * 1000,
}

export async function isAccountLocked(email: string): Promise<boolean> {
  const lockoutThreshold = new Date(Date.now() - LOCKOUT_CONFIG.LOCKOUT_DURATION_MS)
  const failedAttempts = await prisma.loginAttempt.count({
    where: {
      email: email.toLowerCase(),
      success: false,
      createdAt: { gte: lockoutThreshold },
    },
  })
  return failedAttempts >= LOCKOUT_CONFIG.MAX_FAILED_ATTEMPTS
}

export async function getLockoutTimeRemaining(email: string): Promise<number> {
  const lockoutThreshold = new Date(Date.now() - LOCKOUT_CONFIG.LOCKOUT_DURATION_MS)
  const oldestFailedAttempt = await prisma.loginAttempt.findFirst({
    where: {
      email: email.toLowerCase(),
      success: false,
      createdAt: { gte: lockoutThreshold },
    },
    orderBy: { createdAt: 'asc' },
  })

  if (!oldestFailedAttempt) return 0

  const unlockTime = oldestFailedAttempt.createdAt.getTime() + LOCKOUT_CONFIG.LOCKOUT_DURATION_MS
  return Math.max(0, Math.ceil((unlockTime - Date.now()) / 1000))
}

export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress: string,
  userAgent: string | null,
  failureReason?: string
): Promise<void> {
  await prisma.loginAttempt.create({
    data: {
      email: email.toLowerCase(),
      success,
      ipAddress,
      userAgent,
      failureReason,
    },
  })

  const cleanupThreshold = new Date(Date.now() - LOCKOUT_CONFIG.LOCKOUT_DURATION_MS)
  await prisma.loginAttempt.deleteMany({
    where: { createdAt: { lt: cleanupThreshold } },
  })
}

export async function clearFailedAttempts(email: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({
    where: { email: email.toLowerCase(), success: false },
  })
}

export async function auditLog(params: {
  userId?: string
  action: string
  resource?: string
  resourceId?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: params.metadata || {},
    },
  })
}

export async function getRecentFailedAttempts(
  email: string,
  windowMs: number = LOCKOUT_CONFIG.ATTEMPT_WINDOW_MS
): Promise<number> {
  const threshold = new Date(Date.now() - windowMs)
  return prisma.loginAttempt.count({
    where: {
      email: email.toLowerCase(),
      success: false,
      createdAt: { gte: threshold },
    },
  })
}
