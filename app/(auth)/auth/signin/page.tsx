'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl p-8 shadow-lg" style={{ background: 'white' }}>
        <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--night, #1A1A1A)' }}>
          Welcome Back
        </h1>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--muted, #6D5C4A)' }}>
          Sign in to your Baham community account
        </p>

        {verified && (
          <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
            Email verified! You can now sign in.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ background: '#FDECEA', color: '#B71C1C' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night, #1A1A1A)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border text-sm"
              style={{ borderColor: '#E0D5C7', outline: 'none' }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--night, #1A1A1A)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border text-sm"
              style={{ borderColor: '#E0D5C7', outline: 'none' }}
              placeholder="••••••••"
            />
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm" style={{ color: 'var(--gold, #D4A017)' }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-sm transition-opacity"
            style={{ background: 'var(--gold, #D4A017)', color: 'var(--night, #1A1A1A)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--muted, #6D5C4A)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--gold, #D4A017)', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
