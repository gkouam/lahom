'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

export default function VerifyEmailRequiredPage() {
  const { t, tf } = useLanguage()
  const [email, setEmail] = useState('')
  const [knownEmail, setKnownEmail] = useState('')
  const [notSent, setNotSent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  // Sign-up leaves the address behind so nobody has to type it again.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('lahom.signupEmail') || ''
      setKnownEmail(saved)
      setEmail(saved)
      setNotSent(sessionStorage.getItem('lahom.signupEmailSent') === 'no')
    } catch {}
  }, [])

  const handleResend = async (e: React.FormEvent) => {
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
      if (res.ok) {
        setNotSent(false)
        try { sessionStorage.setItem('lahom.signupEmailSent', 'yes') } catch {}
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="auth-card centered">
      <div className="auth-icon" aria-hidden="true">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>
      <h1 className="auth-title">{t('verifyReq.title')}</h1>
      {notSent ? (
        <div className="auth-alert error" role="alert">
          {knownEmail ? tf('verifyReq.createdNotSent', { email: knownEmail }) : t('verifyReq.notSent')}
        </div>
      ) : (
        <p className="auth-subtitle">
          {knownEmail ? tf('verifyReq.bodyTo', { email: knownEmail }) : t('verifyReq.body')}
        </p>
      )}
      <p className="auth-note">{t('verifyReq.next')}</p>

      <form onSubmit={handleResend} className="auth-form">
        <label htmlFor="resend-email" className="auth-label">{t('verifyReq.resendLabel')}</label>
        <input id="resend-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="auth-input" />
        <button type="submit" disabled={status === 'sending' || !email.trim()} className="auth-submit">
          {status === 'sending' ? t('verifyReq.sending') : t('verifyReq.resend')}
        </button>
        {status === 'sent' && <div className="auth-alert success" role="status">{t('verifyReq.sent')}</div>}
        {status === 'error' && <div className="auth-alert error" role="alert">{t('verifyReq.error')}</div>}
      </form>

      <p className="auth-switch">
        <Link href="/auth/signin" className="auth-link">{t('auth.backToSignin')}</Link>
      </p>
    </div>
  )
}
