'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory, #FAF6F0)' }}>
      <header className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E0D5C7' }}>
        <Link href="/" className="flex items-center gap-2 no-underline" style={{ color: 'var(--night)' }}>
          <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
            <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
            <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
          </svg>
          <strong style={{ fontFamily: 'Cormorant Garamond, serif' }}>Baham Bamiléké</strong>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ border: '1px solid #E0D5C7' }}
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Welcome, {session?.user?.name || 'Member'}
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted, #6D5C4A)' }}>
          &quot;Nkam si lah&quot; — Unity is Strength
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl p-6 shadow-sm" style={{ background: 'white' }}>
            <h3 className="font-semibold mb-2">Upcoming Events</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Coming soon in Phase 2</p>
          </div>
          <div className="rounded-xl p-6 shadow-sm" style={{ background: 'white' }}>
            <h3 className="font-semibold mb-2">My Profile</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {session?.user?.email}<br />
              Role: {session?.user?.role || 'MEMBER'}
            </p>
          </div>
          <div className="rounded-xl p-6 shadow-sm" style={{ background: 'white' }}>
            <h3 className="font-semibold mb-2">Announcements</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Coming soon in Phase 2</p>
          </div>
        </div>
      </main>
    </div>
  )
}
