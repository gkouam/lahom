'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/lib/i18n/context'
import LanguageToggle from './LanguageToggle'
import Link from 'next/link'

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { t } = useLanguage()
  const close = () => setMenuOpen(false)

  return (
    <nav id="top" aria-label="Main">
      <div className="nav-inner">
        <a href="#top" className="nav-brand" aria-label={t('brand.name')}>
          <svg className="nav-mark" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold)" strokeWidth="1.6" />
            <path d="M22 10L34 22L22 34L10 22Z" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
            <circle cx="22" cy="22" r="3.5" fill="var(--gold)" />
            <path d="M22 2V42M2 22H42" stroke="var(--gold)" strokeWidth="0.4" opacity="0.25" />
          </svg>
          <div className="nav-brand-text">
            <strong>{t('brand.name')}</strong>
            <span>Baham Bamiléké · {t('brand.place')}</span>
          </div>
        </a>

        <div className={`nav-links${menuOpen ? ' open' : ''}`} id="navLinks">
          <a href="#heritage" onClick={close}>{t('nav.heritage')}</a>
          <a href="#culture" onClick={close}>{t('nav.culture')}</a>
          <a href="#events" onClick={close}>{t('nav.events')}</a>
          <a href="#gallery" onClick={close}>{t('nav.gallery')}</a>
          <a href="#leadership" onClick={close}>{t('nav.leadership')}</a>
          {session ? (
            <Link href="/dashboard" className="nav-cta" onClick={close}>
              {t('auth.dashboard')}
            </Link>
          ) : (
            <>
              <Link href="/auth/signin" className="nav-signin" onClick={close}>
                {t('auth.signin')}
              </Link>
              <Link href="/auth/signup" className="nav-cta" onClick={close}>
                {t('nav.join')}
              </Link>
            </>
          )}
        </div>

        <div className="nav-tools">
          <LanguageToggle />
          <button
            type="button"
            className={`nav-hamburger${menuOpen ? ' active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="navLinks"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}
