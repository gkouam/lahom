import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { emailService } from '@/lib/email/service'
import crypto from 'crypto'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.auth.forgotPassword, async () => {
    try {
      const { email } = await request.json()

      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }

      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

      if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

        await prisma.verificationToken.create({
          data: { identifier: email.toLowerCase(), token: resetToken, expires: resetTokenExpiry },
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
