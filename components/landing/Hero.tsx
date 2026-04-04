'use client'

import { useLanguage } from '@/lib/i18n/context'
import Image from 'next/image'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="hero">
      <div className="hero-bg">
        <Image
          src="/images/baham-ceremony.jpg"
          alt="Enthroning ceremony of a Mafo in Baham, Cameroon"
          className="hero-bg-img"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <div className="hero-overlay"></div>
        <div className="hero-pattern-layer"></div>
      </div>

      <svg className="hero-geo hg-1" viewBox="0 0 120 120" fill="none">
        <path d="M60 5L115 60L60 115L5 60Z" stroke="rgba(212,160,23,0.2)" strokeWidth="0.8" />
        <path d="M60 25L95 60L60 95L25 60Z" stroke="rgba(212,160,23,0.12)" strokeWidth="0.6" />
      </svg>
      <svg className="hero-geo hg-2" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" stroke="rgba(212,160,23,0.12)" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="26" stroke="rgba(212,160,23,0.08)" strokeWidth="0.5" />
        <path d="M50 6L94 50L50 94L6 50Z" stroke="rgba(212,160,23,0.06)" strokeWidth="0.5" />
      </svg>
      <svg className="hero-geo hg-3" viewBox="0 0 80 70" fill="none">
        <polygon points="40,4 76,24 76,50 40,70 4,50 4,24" stroke="rgba(212,160,23,0.1)" strokeWidth="0.7" />
      </svg>

      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="eyebrow-diamond"></span>
          {t('hero.eyebrow')}
          <span className="eyebrow-diamond"></span>
        </div>
        <h1 dangerouslySetInnerHTML={{ __html: t('hero.title') }} />
        <p className="hero-motto">{t('hero.motto')}</p>
        <p className="hero-desc">{t('hero.desc')}</p>
        <div className="hero-btns">
          <a href="#join" className="btn btn-gold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span>{t('hero.btn.member')}</span>
          </a>
          <a href="#culture" className="btn btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>{t('hero.btn.explore')}</span>
          </a>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-bar"></div>
      </div>
    </section>
  )
}
