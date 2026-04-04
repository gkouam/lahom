'use client'

import { useLanguage } from '@/lib/i18n/context'

export default function BahamLocation() {
  const { t } = useLanguage()

  return (
    <div className="baham-location">
      <div className="container baham-location-inner">
        <div className="baham-map-svg">
          <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Map of Cameroon highlighting Baham">
            <path d="M100 10 L130 20 L150 15 L165 30 L170 55 L180 70 L185 90 L175 105 L165 115 L155 130 L140 145 L125 155 L110 170 L95 185 L80 195 L65 205 L50 200 L40 185 L35 165 L25 145 L20 125 L15 105 L20 85 L30 65 L45 50 L60 35 L75 22 Z" stroke="var(--gold)" strokeWidth="1.2" fill="var(--gold)" fillOpacity="0.04" />
            <ellipse cx="62" cy="88" rx="18" ry="16" fill="var(--gold)" fillOpacity="0.15" stroke="var(--gold)" strokeWidth="1" />
            <circle cx="62" cy="88" r="4" fill="var(--wine-bright)" />
            <circle cx="62" cy="88" r="8" fill="none" stroke="var(--wine-bright)" strokeWidth="0.8" opacity="0.5" />
            <line x1="70" y1="86" x2="105" y2="72" stroke="var(--gold)" strokeWidth="0.6" strokeDasharray="3,2" />
            <text x="108" y="70" fill="var(--gold)" fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">BAHAM</text>
            <text x="108" y="81" fill="var(--muted, #6D5C4A)" fontSize="6.5" fontFamily="Plus Jakarta Sans, sans-serif">West Region</text>
            <text x="108" y="90" fill="var(--muted, #6D5C4A)" fontSize="6.5" fontFamily="Plus Jakarta Sans, sans-serif">5°23&apos;N · 10°21&apos;E</text>
          </svg>
        </div>
        <div className="baham-location-text">
          <span className="sec-label">{t('location.label')}</span>
          <h3 dangerouslySetInnerHTML={{ __html: t('location.title') }} />
          <p>{t('location.desc')}</p>
        </div>
      </div>
    </div>
  )
}
