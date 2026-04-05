'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory, #FAF6F0)' }}>
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E0D5C7', background: 'white' }}>
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 no-underline" style={{ color: 'var(--night)' }}>
            <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
              <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
              <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
            </svg>
            <strong style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>Admin</strong>
          </Link>
          <nav className="flex gap-1">
            <Link
              href="/admin/members"
              className="px-3 py-1.5 rounded-md text-sm font-medium no-underline"
              style={{
                background: pathname?.includes('/members') ? 'var(--gold-dim, rgba(212,160,23,0.15))' : 'transparent',
                color: pathname?.includes('/members') ? 'var(--night)' : 'var(--muted)',
              }}
            >
              Members
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm no-underline" style={{ color: 'var(--muted)' }}>
            Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-1.5 rounded-lg text-sm font-medium"
            style={{ border: '1px solid #E0D5C7', background: 'white', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        {children}
      </main>
    </div>
  )
}
