import { prisma } from '@/lib/db'
import crypto from 'crypto'

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

  if (!verificationToken) {
    return { success: false, error: 'Invalid or expired verification token' }
  }

  if (new Date() > verificationToken.expires) {
    await prisma.verificationToken.delete({ where: { token } })
    return { success: false, error: 'Verification token has expired' }
  }

  const email = verificationToken.identifier

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  })

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

  if (!user) return { success: true } // Don't reveal user doesn't exist

  if (user.emailVerified) {
    return { success: false, error: 'Email already verified' }
  }

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
