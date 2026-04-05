'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function PendingApprovalPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl p-8 shadow-lg text-center" style={{ background: 'white' }}>
        <div className="mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold, #D4A017)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--serif)', color: 'var(--night)' }}>
          Awaiting Approval
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          Your email has been verified. A community admin will review and approve your account shortly. You&apos;ll receive an email once approved.
        </p>
        <div className="space-y-3">
          <Link
            href="https://chat.whatsapp.com/FdXvBZ537ZdFfJvENDernh"
            target="_blank"
            rel="noopener"
            className="block w-full py-3 rounded-lg font-semibold text-sm text-center"
            style={{ background: '#25D366', color: 'white' }}
          >
            Join WhatsApp Community
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="block w-full py-3 rounded-lg font-semibold text-sm text-center"
            style={{ border: '1.5px solid #E0D5C7', background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
