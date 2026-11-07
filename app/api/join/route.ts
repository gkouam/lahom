import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { schemas } from '@/lib/security/validation'

// Public contact form ("Write to us" on the home page). Saves the message for
// officers in Admin → Messages, tells the officers, and sends the sender a
// short confirmation that contains nothing they typed.
//
// Abuse limits are kept in the database, because the in-memory rate limiter is
// per serverless instance: one confirmation per address per day, a cap per
// address, and a site-wide hourly cap after which messages are still saved but
// no more emails go out.
const PER_ADDRESS_DAILY_MAX = 5
const SITE_HOURLY_EMAIL_CAP = 30
const SITE_HOURLY_HARD_CAP = 200

const OK = { message: 'Thank you! Your message has been sent.' }

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.api.join, async () => {
    try {
      const body = await request.json().catch(() => null)

      // Honeypot: a hidden field real visitors never fill in.
      if (body && typeof body.website === 'string' && body.website.trim() !== '') {
        return NextResponse.json(OK)
      }

      const parsed = schemas.membershipRequest.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message || 'Invalid input' },
          { status: 400 }
        )
      }

      const { email, name, phone, hometown, message } = parsed.data
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000)

      const [fromAddressToday, siteLastHour] = await Promise.all([
        prisma.membershipRequest.count({ where: { email, createdAt: { gte: dayAgo } } }),
        prisma.membershipRequest.count({ where: { createdAt: { gte: hourAgo } } }),
      ])

      if (fromAddressToday >= PER_ADDRESS_DAILY_MAX || siteLastHour >= SITE_HOURLY_HARD_CAP) {
        // Same answer as success, so the limit can't be probed.
        return NextResponse.json(OK)
      }

      await prisma.membershipRequest.create({
        data: { email, name, phone, hometown, message },
      })

      if (siteLastHour >= SITE_HOURLY_EMAIL_CAP) {
        console.warn('Contact form: hourly email cap reached; message saved without notifications')
        return NextResponse.json(OK)
      }

      // Awaited: Vercel freezes the function once the response returns, so
      // un-awaited sends are silently dropped.
      const { emailService } = await import('@/lib/email/service')
      await emailService.sendAdminNewMessage({ name, email, phone, hometown, message })
      if (fromAddressToday === 0) {
        await emailService.sendJoinConfirmation(email)
      }

      return NextResponse.json(OK)
    } catch (error) {
      console.error('Contact form error:', error)
      return NextResponse.json({ error: 'Failed to send your message' }, { status: 500 })
    }
  })
}
