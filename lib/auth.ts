import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import {
  isAccountLocked,
  getLockoutTimeRemaining,
  recordLoginAttempt,
  clearFailedAttempts,
  auditLog,
} from './security/account-security'

let prisma: any = null
try {
  prisma = require('./db').prisma
} catch (error) {
  console.error('Failed to initialize Prisma client:', error)
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) return null
          if (!prisma) return null

          const email = credentials.email.toLowerCase()
          const ipAddress = req?.headers?.['x-forwarded-for']?.split(',')[0] || req?.headers?.['x-real-ip'] || '0.0.0.0'
          const userAgent = req?.headers?.['user-agent'] || null

          // Check account lockout
          const locked = await isAccountLocked(email)
          if (locked) {
            const timeRemaining = await getLockoutTimeRemaining(email)
            await recordLoginAttempt(email, false, ipAddress, userAgent, 'Account locked')
            await auditLog({ action: 'login_attempt_while_locked', resource: 'user', ipAddress, userAgent, metadata: { email, timeRemaining } })
            throw new Error(`Account temporarily locked. Try again in ${Math.ceil(timeRemaining / 60)} minutes.`)
          }

          let user
          try {
            user = await prisma.user.findUnique({ where: { email } })
          } catch {
            return null
          }

          if (!user) {
            await recordLoginAttempt(email, false, ipAddress, userAgent, 'User not found')
            return null
          }

          if (!user.passwordHash) {
            await recordLoginAttempt(email, false, ipAddress, userAgent, 'No password hash')
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

          if (!isPasswordValid) {
            await recordLoginAttempt(email, false, ipAddress, userAgent, 'Invalid password')
            await auditLog({ userId: user.id, action: 'login_failed', resource: 'user', resourceId: user.id, ipAddress, userAgent, metadata: { reason: 'Invalid password' } })
            return null
          }

          await clearFailedAttempts(email)
          await recordLoginAttempt(email, true, ipAddress, userAgent)
          await auditLog({ userId: user.id, action: 'login_success', resource: 'user', resourceId: user.id, ipAddress, userAgent })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes('Account temporarily locked')) {
            throw error
          }
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 14 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as any).role

        if (prisma && user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
              select: { emailVerified: true },
            })
            token.emailVerified = dbUser?.emailVerified || null
          } catch {
            token.emailVerified = null
          }
        }
      }

      // Refresh emailVerified hourly
      const lastCheck = token.emailVerifiedLastCheck as number || 0
      if (Date.now() - lastCheck > 60 * 60 * 1000) {
        if (prisma && token.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email as string },
              select: { emailVerified: true, role: true },
            })
            token.emailVerified = dbUser?.emailVerified || null
            token.role = dbUser?.role || 'MEMBER'
            token.emailVerifiedLastCheck = Date.now()
          } catch {}
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.email = token.email as string || ''
        session.user.name = token.name as string || ''
        session.user.role = token.role as string || 'MEMBER'
        session.user.emailVerified = token.emailVerified as Date | null
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
}
