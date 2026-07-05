import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { schemas } from '@/lib/security/validation'

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.api.join, async () => {
    try {
      const body = await request.json()
      const parsed = schemas.membershipRequest.safeParse(body)

      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message || 'Invalid input' },
          { status: 400 }
        )
      }

      const { email, name, phone, hometown, message } = parsed.data

      await prisma.membershipRequest.create({
        data: { email, name, phone, hometown, message },
      })

      // Send confirmation email. Awaited: Vercel freezes the function once the
      // response returns, so un-awaited sends are silently dropped.
      const { emailService } = await import('@/lib/email/service')
      await emailService.sendJoinConfirmation(email, name)

      return NextResponse.json({
        message: 'Thank you! Your membership request has been submitted.',
      })
    } catch (error) {
      console.error('Join request error:', error)
      return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
    }
  })
}
