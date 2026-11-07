'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'
import LanguageToggle from '@/components/LanguageToggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { t, tf } = useLanguage()

  const isSignIn = pathname === '/auth/signin'
  const isSignUp = pathname === '/auth/signup'

  return (
    <div className="auth-split">
      {/* Branded panel */}
      <div className="auth-panel">
        <div className="auth-panel-content">
          <Link href="/" className="auth-panel-logo" aria-label={t('auth.home')}>
            <svg width="64" height="64" viewBox="0 0 44 44" fill="none" aria-hidden="true">
              <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
              <path d="M22 10L34 22L22 34L10 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1" opacity="0.5" />
              <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
            </svg>
          </Link>
          <div className="auth-panel-text-group">
            <div className="auth-panel-title">{t('brand.name')}</div>
            <div className="auth-panel-subtitle">Baham Bamiléké · {t('brand.place')}</div>
          </div>
          <p className="auth-panel-motto">{t('dash.motto')}</p>
          <div className="kente-bar" />
          <p className="auth-panel-tagline">{t('auth.tagline')}</p>
        </div>
      </div>

      {/* Form side */}
      <div className="auth-right">
        <div className="auth-nav" role="navigation" aria-label="Account">
          <Link href="/" className="auth-nav-home">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13 8L8 3L3 8" />
              <path d="M3 8v5a1 1 0 001 1h2.5v-3h3v3H12a1 1 0 001-1V8" />
            </svg>
            {t('auth.home')}
          </Link>
          <div className="auth-nav-links">
            <Link href="/auth/signin" className={`auth-nav-link${isSignIn ? ' active' : ''}`} aria-current={isSignIn ? 'page' : undefined}>
              {t('auth.signin')}
            </Link>
            <Link href="/auth/signup" className={`auth-nav-link${isSignUp ? ' active' : ''}`} aria-current={isSignUp ? 'page' : undefined}>
              {t('auth.signup')}
            </Link>
            <LanguageToggle className="auth-lang" />
          </div>
        </div>

        <main className="auth-form-area">
          {children}
        </main>

        <div className="auth-footer">
          {tf('footer.rights', { year: new Date().getFullYear() })}
        </div>
      </div>
    </div>
  )
}
