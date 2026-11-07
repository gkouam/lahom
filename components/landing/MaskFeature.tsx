'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/context'

export default function MaskFeature() {
  const { t } = useLanguage()

  return (
    <section className="section mask-feature">
      <div className="mask-split">
        <div className="mask-photo-side">
          <Image
            src="/images/dallas-museum-elephant-mask.jpg"
            alt={t('mask.alt')}
            className="mask-photo"
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
        </div>
        <div className="mask-text-side fade-in">
          <span className="sec-label">{t('mask.label')}</span>
          <h2 className="sec-title">Mbap <i>Mteng</i></h2>
          <p>{t('mask.p1')}</p>
          <p>{t('mask.p2')}</p>
          <div className="mask-symbols">
            <div className="symbol">
              <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 4L32 28H4Z" stroke="var(--gold)" strokeWidth="1.5" fill="var(--gold)" fillOpacity="0.12" /></svg>
              <span>{t('mask.leopard')}<br /><small>{t('mask.power')}</small></span>
            </div>
            <div className="symbol">
              <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><circle cx="18" cy="18" r="14" stroke="var(--gold)" strokeWidth="1.5" fill="var(--gold)" fillOpacity="0.06" /></svg>
              <span>{t('mask.elephant')}<br /><small>{t('mask.wisdom')}</small></span>
            </div>
            <div className="symbol">
              <svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18 2L34 18L18 34L2 18Z" stroke="var(--gold)" strokeWidth="1.5" fill="var(--gold)" fillOpacity="0.08" /></svg>
              <span>{t('mask.royal')}<br /><small>{t('mask.authority')}</small></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
