import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'
import { schemas } from '@/lib/security/validation'
import { z } from 'zod'
import { checkPasswordSecurity } from '@/lib/security/password-breach'
import { createEmailVerificationToken } from '@/lib/security/email-verification'

const registerSchema = z.object({
  email: schemas.email,
  password: schemas.password,
  name: schemas.name,
  phone: schemas.phone,
  hometown: schemas.hometown,
})

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.auth.signup, async () => {
    try {
      const body = await request.json()
      const parsed = registerSchema.safeParse(body)

      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message || 'Invalid input' },
          { status: 400 }
        )
      }

      const { email, password, name, phone, hometown } = parsed.data

      // Check password security
      const passwordCheck = await checkPasswordSecurity(password)
      if (!passwordCheck.secure) {
        return NextResponse.json({ error: passwordCheck.warnings[0] }, { status: 400 })
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 })
      }

      const passwordHash = await bcrypt.hash(password, 12)

      const user = await prisma.user.create({
        data: { email, passwordHash, name, phone, hometown },
        select: { id: true, email: true, name: true },
      })

      // Create verification token and send email.
      // Sends MUST be awaited: on Vercel the function is frozen as soon as the
      // response returns, killing fire-and-forget requests mid-flight (emails
      // silently never arrived). The service never throws; failures are logged.
      const verificationToken = await createEmailVerificationToken(user.email!)
      const { emailService } = await import('@/lib/email/service')
      const [verification] = await Promise.all([
        emailService.sendVerificationEmail(user.email!, user.name || '', verificationToken),
        emailService.sendAdminNewRegistration(user.name || 'Unknown', user.email!),
      ])

      // emailSent lets the next page say so plainly when the link didn't go
      // out, instead of telling the person to check an empty inbox.
      return NextResponse.json({
        message: 'Account created. Please check your email to verify your account.',
        emailSent: verification.success,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Registration error:', message, error)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }
  })
}
