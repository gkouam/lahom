'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', hometown: '' })
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

  const inputStyle = { borderColor: '#E0D5C7', outline: 'none' }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl p-8 shadow-lg" style={{ background: 'white' }}>
        <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--night, #1A1A1A)' }}>
          Join the Community
        </h1>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--muted, #6D5C4A)' }}>
          Create your Baham Bamiléké Dallas account
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ background: '#FDECEA', color: '#B71C1C' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night)' }}>Full Name *</label>
            <input type="text" value={form.name} onChange={update('name')} required className="w-full px-4 py-3 rounded-lg border text-sm" style={inputStyle} placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night)' }}>Email *</label>
            <input type="email" value={form.email} onChange={update('email')} required className="w-full px-4 py-3 rounded-lg border text-sm" style={inputStyle} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night)' }}>Password *</label>
            <input type="password" value={form.password} onChange={update('password')} required minLength={8} className="w-full px-4 py-3 rounded-lg border text-sm" style={inputStyle} placeholder="Min 8 chars, upper + lower + digit + special" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night)' }}>Phone</label>
              <input type="tel" value={form.phone} onChange={update('phone')} className="w-full px-4 py-3 rounded-lg border text-sm" style={inputStyle} placeholder="(optional)" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night)' }}>Hometown</label>
              <input type="text" value={form.hometown} onChange={update('hometown')} className="w-full px-4 py-3 rounded-lg border text-sm" style={inputStyle} placeholder="(optional)" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-sm transition-opacity"
            style={{ background: 'var(--gold, #D4A017)', color: 'var(--night, #1A1A1A)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--muted, #6D5C4A)' }}>
          Already have an account?{' '}
          <Link href="/auth/signin" style={{ color: 'var(--gold, #D4A017)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
