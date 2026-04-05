'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send reset email')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl p-8 shadow-lg" style={{ background: 'white' }}>
        <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: 'var(--serif)', color: 'var(--night)' }}>
          Reset Password
        </h1>

        {sent ? (
          <div className="text-center">
            <p className="mb-4 text-sm" style={{ color: 'var(--muted)' }}>
              If an account exists with that email, we sent you a password reset link. Check your inbox.
            </p>
            <Link href="/auth/signin" className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-sm mb-6" style={{ color: 'var(--muted)' }}>
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ background: '#FDECEA', color: '#B71C1C' }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                placeholder="you@example.com"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-sm"
                style={{ background: 'var(--gold)', color: 'var(--night)', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              <Link href="/auth/signin" style={{ color: 'var(--gold)' }}>Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
