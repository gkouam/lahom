import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { emailService } from '@/lib/email/service'
import crypto from 'crypto'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { RESET_TOKEN_PREFIX } from '@/lib/security/email-verification'

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.auth.forgotPassword, async () => {
    try {
      const { email } = await request.json()

      if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }

      const normalized = email.trim().toLowerCase()
      const user = await prisma.user.findUnique({ where: { email: normalized } })

      if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour
        const identifier = `${RESET_TOKEN_PREFIX}${normalized}`

        // Only the newest reset link works.
        await prisma.verificationToken.deleteMany({ where: { identifier } })
        await prisma.verificationToken.create({
          data: { identifier, token: resetToken, expires: resetTokenExpiry },
        })

        await emailService.sendPasswordResetEmail(user.email!, user.name || '', resetToken)
      }

      // Always return success to prevent email enumeration
      return NextResponse.json({
        message: 'If an account exists with that email, we sent you a password reset link.',
      })
    } catch (error) {
      console.error('Password reset error:', error)
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
    }
  })
}
