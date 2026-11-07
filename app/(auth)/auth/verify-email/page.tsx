'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

// Shown when a confirmation link fails. The page maps a short code from the
// URL to its own message; it never prints text taken from the URL.
const MESSAGES: Record<string, string> = {
  expired: 'verify.expired',
  invalid: 'verify.invalid',
  missing: 'verify.invalid',
  failed: 'verify.failed',
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const token = searchParams.get('token')
  const code = searchParams.get('error')
  const messageKey = code ? MESSAGES[code] || 'verify.invalid' : null

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  // Old emails linked here with ?token=; hand those to the API route.
  useEffect(() => {
    if (token) window.location.href = `/api/auth/verify-email?token=${encodeURIComponent(token)}`
  }, [token])

  const resend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (token) {
    return <div className="auth-card centered"><p className="auth-subtitle">{t('verify.checking')}</p></div>
  }

  return (
    <div className="auth-card centered">
      <h1 className="auth-title">{t('verify.title')}</h1>
      {messageKey ? (
        <>
          <div className="auth-alert error" role="alert">{t(messageKey)}</div>
          <form onSubmit={resend} className="auth-form">
            <label htmlFor="verify-email" className="auth-label">{t('verifyReq.resendLabel')}</label>
            <input id="verify-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="auth-input" />
            <button type="submit" disabled={status === 'sending' || !email.trim()} className="auth-submit">
              {status === 'sending' ? t('verifyReq.sending') : t('verifyReq.resend')}
            </button>
            {status === 'sent' && <div className="auth-alert success" role="status">{t('verifyReq.sent')}</div>}
            {status === 'error' && <div className="auth-alert error" role="alert">{t('verifyReq.error')}</div>}
          </form>
        </>
      ) : (
        <p className="auth-subtitle">{t('verify.default')}</p>
      )}
      <p className="auth-switch">
        <Link href="/auth/signin" className="auth-link">{t('auth.backToSignin')}</Link>
      </p>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="auth-card auth-loading" />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
