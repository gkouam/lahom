'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import PasswordField from '@/components/auth/PasswordField'
import PasswordRules, { passwordMeetsRules } from '@/components/auth/PasswordRules'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const mismatch = confirm.length > 0 && confirm !== password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!passwordMeetsRules(password)) return setError(t('signup.weak'))
    if (password !== confirm) return setError(t('signup.mismatch'))

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) setDone(true)
      else setError(data.error || t('reset.failed'))
    } catch {
      setError(t('common.networkError'))
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-card centered">
        <h1 className="auth-title">{t('reset.title')}</h1>
        <div className="auth-alert error" role="alert">{t('reset.invalidLink')}</div>
        <p className="auth-switch">
          <Link href="/forgot-password" className="auth-link strong">{t('reset.requestNew')}</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t('reset.title')}</h1>

      {done ? (
        <>
          <div className="auth-alert success" role="status">{t('reset.done')}</div>
          <p className="auth-switch">
            <Link href="/auth/signin" className="auth-link strong">{t('signin.submit')}</Link>
          </p>
        </>
      ) : (
        <>
          {error && <div className="auth-alert error" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <PasswordField id="reset-password" label={t('reset.new')} value={password} onChange={setPassword} autoComplete="new-password" describedBy="reset-rules" />
            <PasswordRules id="reset-rules" password={password} />
            <div className="auth-field">
              <label htmlFor="reset-confirm" className="auth-label">{t('signup.confirm')}</label>
              <input id="reset-confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" className="auth-input" aria-invalid={mismatch || undefined} />
              {mismatch && <p className="auth-field-error">{t('signup.mismatch')}</p>}
            </div>
            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? t('reset.saving') : t('reset.submit')}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="auth-card auth-loading" />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
