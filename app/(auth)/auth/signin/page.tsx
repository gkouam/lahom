'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import { safeCallbackPath } from '@/lib/security/safe-redirect'
import PasswordField from '@/components/auth/PasswordField'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const verified = searchParams.get('verified')
  // Only same-site paths: a crafted link can't send people (or code) elsewhere.
  const callbackUrl = safeCallbackPath(searchParams.get('callbackUrl'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)

    if (result?.error) {
      if (result.error === 'CredentialsSignin') setError(t('signin.invalid'))
      else if (result.error.startsWith('Account temporarily locked')) setError(t('signin.locked'))
      else setError(t('signin.failed'))
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t('signin.title')}</h1>
      <p className="auth-subtitle">{t('signin.subtitle')}</p>

      {verified && <div className="auth-alert success" role="status">{t('signin.verified')}</div>}
      {error && <div className="auth-alert error" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="signin-email" className="auth-label">{t('auth.email')}</label>
          <input id="signin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="auth-input" />
        </div>
        <PasswordField id="signin-password" label={t('auth.password')} value={password} onChange={setPassword} autoComplete="current-password" />

        <div className="auth-row-end">
          <Link href="/forgot-password" className="auth-link">{t('signin.forgot')}</Link>
        </div>

        <button type="submit" disabled={loading} className="auth-submit">
          {loading ? t('signin.submitting') : t('signin.submit')}
        </button>
      </form>

      <p className="auth-switch">
        {t('signin.noAccount')} <Link href="/auth/signup" className="auth-link strong">{t('signin.create')}</Link>
      </p>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="auth-card auth-loading" />}>
      <SignInContent />
    </Suspense>
  )
}
