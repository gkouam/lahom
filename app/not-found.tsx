'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import LanguageToggle from '@/components/LanguageToggle'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="nf-page">
      <div className="kente-bar" />
      <main className="nf-main">
        <svg width="56" height="56" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold)" strokeWidth="1.6" />
          <path d="M22 10L34 22L22 34L10 22Z" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
          <circle cx="22" cy="22" r="3.5" fill="var(--gold)" />
        </svg>
        <p className="nf-code">404</p>
        <h1>{t('notFound.title')}</h1>
        <p className="nf-body">{t('notFound.body')}</p>
        <div className="nf-actions">
          <Link href="/" className="btn btn-gold">{t('notFound.home')}</Link>
          <Link href="/auth/signin" className="btn btn-outline-dark">{t('footer.signIn')}</Link>
        </div>
        <div className="nf-lang"><LanguageToggle variant="full" /></div>
        <p className="nf-brand">{t('brand.name')} · {t('brand.tagline')}</p>
      </main>
    </div>
  )
}
