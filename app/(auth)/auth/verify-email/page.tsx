'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        if (res.redirected) {
          window.location.href = res.url
          return
        }
        const data = await res.json()
        if (res.ok) {
          setStatus('success')
          setMessage('Email verified successfully!')
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Network error')
      })
  }, [token])

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl p-8 shadow-lg text-center" style={{ background: 'white' }}>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Email Verification
        </h1>

        {status === 'loading' && <p>Verifying your email...</p>}

        {status === 'success' && (
          <>
            <div className="mb-4 p-3 rounded-lg" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
              {message}
            </div>
            <Link href="/auth/signin" className="font-semibold" style={{ color: 'var(--gold)' }}>
              Sign in to your account
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-4 p-3 rounded-lg" style={{ background: '#FDECEA', color: '#B71C1C' }}>
              {message}
            </div>
            <Link href="/auth/signin" style={{ color: 'var(--gold)' }}>Back to sign in</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
