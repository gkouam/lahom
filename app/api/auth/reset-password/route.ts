import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { checkPasswordSecurity } from '@/lib/security/password-breach'
import { schemas } from '@/lib/security/validation'
import { RESET_TOKEN_PREFIX } from '@/lib/security/email-verification'
import { clearFailedAttempts, auditLog } from '@/lib/security/account-security'
import { withRateLimit, rateLimitConfigs } from '@/lib/security/rate-limiter'

export async function POST(request: NextRequest) {
  return withRateLimit(request, rateLimitConfigs.auth.forgotPassword, async () => {
    try {
      const body = await request.json().catch(() => ({}))
      const token = typeof body.token === 'string' ? body.token : ''
      const password = typeof body.password === 'string' ? body.password : ''

      if (!token || !password) {
        return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
      }

      // Same rules as sign-up.
      const policy = schemas.password.safeParse(password)
      if (!policy.success) {
        return NextResponse.json({ error: policy.error.errors[0]?.message || 'Password is too weak' }, { status: 400 })
      }

      const resetToken = await prisma.verificationToken.findUnique({ where: { token } })
      if (!resetToken || !resetToken.identifier.startsWith(RESET_TOKEN_PREFIX)) {
        return NextResponse.json({ error: 'This reset link is invalid or was already used. Request a new one.' }, { status: 400 })
      }

      if (new Date() > resetToken.expires) {
        await prisma.verificationToken.delete({ where: { token } })
        return NextResponse.json({ error: 'This reset link has expired. Request a new one.' }, { status: 400 })
      }

      const email = resetToken.identifier.slice(RESET_TOKEN_PREFIX.length)
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        await prisma.verificationToken.delete({ where: { token } })
        return NextResponse.json({ error: 'This reset link is invalid or was already used. Request a new one.' }, { status: 400 })
      }

      const passwordCheck = await checkPasswordSecurity(password)
      if (!passwordCheck.secure) {
        return NextResponse.json({ error: passwordCheck.warnings[0] }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      await prisma.$transaction([
        prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashedPassword } }),
        prisma.verificationToken.deleteMany({ where: { identifier: resetToken.identifier } }),
      ])

      // A successful reset lifts any lockout from earlier failed attempts.
      await clearFailedAttempts(email)
      await auditLog({
        userId: user.id,
        action: 'password_reset',
        resource: 'user',
        resourceId: user.id,
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })

      return NextResponse.json({ message: 'Password reset successfully' })
    } catch (error) {
      console.error('Password reset error:', error)
      return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
    }
  })
}
