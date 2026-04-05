'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', hometown: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      router.push('/auth/verify-email-required')
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl p-8 shadow-lg" style={{ background: 'white' }}>
        <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: 'var(--serif)', color: 'var(--night)' }}>
          Join the Community
        </h1>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--muted)' }}>
          Create your Baham Bamiléké Dallas account
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ background: '#FDECEA', color: '#B71C1C' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="auth-field-group">Account</div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night)' }}>Full Name *</label>
            <input type="text" value={form.name} onChange={update('name')} required className="auth-input" placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night)' }}>Email *</label>
            <input type="email" value={form.email} onChange={update('email')} required className="auth-input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night)' }}>Password *</label>
            <div className="auth-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                required
                minLength={8}
                className="auth-input"
                placeholder="Min 8 chars, upper + lower + digit + special"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="auth-field-group" style={{ marginTop: '16px' }}>Optional</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night)' }}>Phone</label>
              <input type="tel" value={form.phone} onChange={update('phone')} className="auth-input" placeholder="(optional)" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night)' }}>Hometown</label>
              <input type="text" value={form.hometown} onChange={update('hometown')} className="auth-input" placeholder="(optional)" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-sm transition-opacity"
            style={{ background: 'var(--gold)', color: 'var(--night)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link href="/auth/signin" style={{ color: 'var(--gold)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
