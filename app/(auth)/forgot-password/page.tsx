'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
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
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) setSent(true)
      else setError(t('forgot.error'))
    } catch {
      setError(t('common.networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t('forgot.title')}</h1>

      {sent ? (
        <>
          <div className="auth-alert success" role="status">{t('forgot.sent')}</div>
          <p className="auth-switch">
            <Link href="/auth/signin" className="auth-link strong">{t('auth.backToSignin')}</Link>
          </p>
        </>
      ) : (
        <>
          <p className="auth-subtitle">{t('forgot.body')}</p>
          {error && <div className="auth-alert error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="forgot-email" className="auth-label">{t('auth.email')}</label>
              <input id="forgot-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="auth-input" />
            </div>
            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? t('forgot.sending') : t('forgot.submit')}
            </button>
          </form>
          <p className="auth-switch">
            <Link href="/auth/signin" className="auth-link">{t('auth.backToSignin')}</Link>
          </p>
        </>
      )}
    </div>
  )
}
