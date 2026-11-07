'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import PasswordField from '@/components/auth/PasswordField'
import PasswordRules, { passwordMeetsRules } from '@/components/auth/PasswordRules'

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', phone: '', hometown: '' })
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // An invitation link from an officer carries the address: fill it in.
  useEffect(() => {
    const invited = searchParams.get('email')
    if (invited) setForm(f => (f.email ? f : { ...f, email: invited }))
  }, [searchParams])

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const mismatch = confirm.length > 0 && confirm !== password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!passwordMeetsRules(password)) return setError(t('signup.weak'))
    if (password !== confirm) return setError(t('signup.mismatch'))

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(res.status === 409 ? t('signup.exists') : (data.error || t('signup.failed')))
        setLoading(false)
        return
      }
      try {
        sessionStorage.setItem('lahom.signupEmail', form.email.trim().toLowerCase())
        sessionStorage.setItem('lahom.signupEmailSent', data.emailSent === false ? 'no' : 'yes')
      } catch {}
      router.push('/auth/verify-email-required')
    } catch {
      setError(t('common.networkError'))
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t('signup.title')}</h1>
      <p className="auth-subtitle">{t('signup.subtitle')}</p>

      {error && <div className="auth-alert error" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-field-group">{t('signup.account')}</div>

        <div className="auth-field">
          <label htmlFor="signup-name" className="auth-label">{t('signup.name')}</label>
          <input id="signup-name" type="text" value={form.name} onChange={update('name')} required minLength={2} maxLength={100} autoComplete="name" className="auth-input" placeholder={t('signup.namePlaceholder')} />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-email" className="auth-label">{t('auth.email')}</label>
          <input id="signup-email" type="email" value={form.email} onChange={update('email')} required autoComplete="email" className="auth-input" />
        </div>
        <PasswordField id="signup-password" label={t('auth.password')} value={password} onChange={setPassword} autoComplete="new-password" describedBy="signup-rules" />
        <PasswordRules id="signup-rules" password={password} />
        <div className="auth-field">
          <label htmlFor="signup-confirm" className="auth-label">{t('signup.confirm')}</label>
          <input id="signup-confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" className="auth-input" aria-invalid={mismatch || undefined} aria-describedby={mismatch ? 'signup-confirm-msg' : undefined} />
          {mismatch && <p id="signup-confirm-msg" className="auth-field-error">{t('signup.mismatch')}</p>}
        </div>

        <div className="auth-field-group">{t('signup.optional')}</div>

        <div className="auth-two-col">
          <div className="auth-field">
            <label htmlFor="signup-phone" className="auth-label">{t('signup.phone')}</label>
            <input id="signup-phone" type="tel" value={form.phone} onChange={update('phone')} maxLength={20} autoComplete="tel" className="auth-input" />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-hometown" className="auth-label">{t('signup.hometown')}</label>
            <input id="signup-hometown" type="text" value={form.hometown} onChange={update('hometown')} maxLength={100} className="auth-input" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="auth-submit">
          {loading ? t('signup.submitting') : t('signup.submit')}
        </button>
      </form>

      <p className="auth-switch">
        {t('signup.hasAccount')} <Link href="/auth/signin" className="auth-link strong">{t('auth.signin')}</Link>
      </p>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="auth-card auth-loading" />}>
      <SignUpContent />
    </Suspense>
  )
}
