import { prisma } from '@/lib/db'
import crypto from 'crypto'

// Verification and password-reset tokens share one table. Reset tokens carry a
// "reset:" prefix on their identifier so neither kind can be used as the other.
export const RESET_TOKEN_PREFIX = 'reset:'

export async function createEmailVerificationToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  })

  return token
}

export async function verifyEmailToken(token: string): Promise<{ success: boolean; email?: string; error?: string }> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken || verificationToken.identifier.startsWith(RESET_TOKEN_PREFIX)) {
    return { success: false, error: 'invalid' }
  }

  if (new Date() > verificationToken.expires) {
    await prisma.verificationToken.delete({ where: { token } })
    return { success: false, error: 'expired' }
  }

  const email = verificationToken.identifier

  const updated = await prisma.user.updateMany({
    where: { email },
    data: { emailVerified: new Date() },
  })
  if (updated.count === 0) {
    await prisma.verificationToken.delete({ where: { token } })
    return { success: false, error: 'invalid' }
  }

  await prisma.verificationToken.delete({ where: { token } })

  return { success: true, email }
}

export async function isEmailVerified(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  })
  return !!user?.emailVerified
}

export async function resendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const user = await prisma.user.findUnique({ where: { email } })

  // Same answer whether or not the account exists or is already verified,
  // so this can't be used to check who has an account.
  if (!user || user.emailVerified) return { success: true }

  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  const token = await createEmailVerificationToken(email)

  const { emailService } = await import('@/lib/email/service')
  const result = await emailService.sendVerificationEmail(email, user.name || '', token)

  if (!result.success) {
    return { success: false, error: 'Failed to send verification email' }
  }

  return { success: true }
}
