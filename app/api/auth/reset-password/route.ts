import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { checkPasswordSecurity } from '@/lib/security/password-breach'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    const verificationToken = await prisma.verificationToken.findUnique({ where: { token } })

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
    }

    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({ where: { token } })
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: verificationToken.identifier } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const passwordCheck = await checkPasswordSecurity(password)
    if (!passwordCheck.secure) {
      return NextResponse.json({ error: passwordCheck.warnings[0] }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    })

    await prisma.verificationToken.delete({ where: { token } })

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}
