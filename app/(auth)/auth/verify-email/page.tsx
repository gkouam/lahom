'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const error = searchParams.get('error')

  if (token) {
    if (typeof window !== 'undefined') {
      window.location.href = `/api/auth/verify-email?token=${token}`
    }
    return (
      <div className="w-full max-w-md">
        <div className="rounded-xl p-8 shadow-lg text-center" style={{ background: 'white' }}>
          <p style={{ color: 'var(--night)' }}>Verifying your email...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl p-8 shadow-lg text-center" style={{ background: 'white' }}>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--serif)', color: 'var(--night)' }}>
          Email Verification
        </h1>

        {error ? (
          <>
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: '#FDECEA', color: '#B71C1C' }}>
              {error}
            </div>
            <Link href="/auth/signin" className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>Back to sign in</Link>
          </>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              Check your email for a verification link.
            </p>
            <Link href="/auth/signin" className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>Back to sign in</Link>
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
