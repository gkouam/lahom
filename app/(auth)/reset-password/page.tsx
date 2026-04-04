'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setDone(true)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center p-8">
        <p>Invalid reset link.</p>
        <Link href="/forgot-password" style={{ color: 'var(--gold)' }}>Request a new one</Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl p-8 shadow-lg" style={{ background: 'white' }}>
        <h1 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Set New Password
        </h1>

        {done ? (
          <div className="text-center">
            <p className="mb-4 text-sm" style={{ color: 'var(--muted)' }}>Password reset successfully!</p>
            <Link href="/auth/signin" className="font-semibold" style={{ color: 'var(--gold)' }}>Sign in</Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ background: '#FDECEA', color: '#B71C1C' }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full px-4 py-3 rounded-lg border text-sm" style={{ borderColor: '#E0D5C7' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full px-4 py-3 rounded-lg border text-sm" style={{ borderColor: '#E0D5C7' }} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold text-sm" style={{ background: 'var(--gold)', color: 'var(--night)', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
