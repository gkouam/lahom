'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function VerifyEmailRequiredPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleResend = async () => {
    if (!email) return
    setLoading(true)

    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch {
      // Still show sent to prevent enumeration
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl p-8 shadow-lg text-center" style={{ background: 'white' }}>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Verify Your Email
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          We sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>

        {sent ? (
          <p className="text-sm p-3 rounded-lg" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
            Verification email resent! Check your inbox.
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Didn&apos;t receive it? Enter your email to resend:</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border text-sm"
              style={{ borderColor: '#E0D5C7' }}
              placeholder="you@example.com"
            />
            <button
              onClick={handleResend}
              disabled={loading || !email}
              className="w-full py-3 rounded-lg font-semibold text-sm"
              style={{ background: 'var(--gold)', color: 'var(--night)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>
        )}

        <p className="text-sm mt-6">
          <Link href="/auth/signin" style={{ color: 'var(--gold)' }}>Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
