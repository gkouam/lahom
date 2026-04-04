import { NextRequest, NextResponse } from 'next/server'
import { resendVerificationEmail } from '@/lib/security/email-verification'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.auth.forgotPassword, async () => {
    try {
      const { email } = await request.json()

      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }

      const result = await resendVerificationEmail(email.toLowerCase())

      if (!result.success && result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      return NextResponse.json({
        message: 'If an unverified account exists with that email, we sent you a verification link.',
      })
    } catch (error) {
      console.error('Resend verification error:', error)
      return NextResponse.json({ error: 'Failed to resend verification email' }, { status: 500 })
    }
  })
}
