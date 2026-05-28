import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      emailVerified: Date | null
      accountStatus: string
      permissions: string[]
      officerTitle?: string | null
    }
  }

  interface User {
    role?: string
    accountStatus?: string
    permissions?: string[]
    officerTitle?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    emailVerified: Date | null
    accountStatus: string
    emailVerifiedLastCheck?: number
    permissions: string[]
    permissionsLastCheck?: number
    officerTitle?: string | null
  }
}
