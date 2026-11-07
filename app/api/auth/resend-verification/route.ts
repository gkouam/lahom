import { NextRequest, NextResponse } from 'next/server'
import { resendVerificationEmail } from '@/lib/security/email-verification'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'

const SENT = { message: 'If an unverified account exists with that email, we sent you a new verification link.' }

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.auth.forgotPassword, async () => {
    try {
      const body = await request.json().catch(() => ({}))
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }

      const result = await resendVerificationEmail(email)
      if (!result.success) {
        // Only a real send failure reaches here; the answer for unknown or
        // already-verified addresses is the same as for a successful send.
        return NextResponse.json({ error: 'We could not send the email right now. Please try again later.' }, { status: 502 })
      }

      return NextResponse.json(SENT)
    } catch (error) {
      console.error('Resend verification error:', error)
      return NextResponse.json({ error: 'Failed to resend verification email' }, { status: 500 })
    }
  })
}
