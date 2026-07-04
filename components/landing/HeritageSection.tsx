'use client'

import { useLanguage } from '@/lib/i18n/context'
import Image from 'next/image'

export default function HeritageSection() {
  const { t } = useLanguage()

  return (
    <section className="section heritage-section" id="heritage">
      <div className="section-pattern-bg"></div>
      <div className="container">
        <div className="heritage-grid">
          <div className="heritage-images fade-in">
            <div className="heritage-img-main framed-photo">
              <Image
                src="/images/baham-museum-architecture.jpg"
                alt="Royal Museum of Baham — traditional Grassfields architecture"
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="photo-tag">Royal Museum of Baham</div>
            </div>
            <div className="heritage-img-accent framed-photo">
              <Image
                src="/images/baham-museum-interior.jpg"
                alt="Interior of the Royal Museum displaying ancestral sculptures"
                width={300}
                height={200}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="photo-tag">Sacred Artifacts</div>
            </div>
            <div className="heritage-pattern-decor"></div>
          </div>

          <div className="heritage-text fade-in fd1">
            <span className="sec-label">{t('heritage.label')}</span>
            <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: t('heritage.title') }} />
            <p>{t('heritage.desc')}</p>

            <div className="heritage-values">
              {[1, 2, 3, 4].map(n => (
                <div className="value-card" key={n}>
                  <h4><span className="value-diamond" aria-hidden="true" />{t(`heritage.value${n}.title`)}</h4>
                  <p>{t(`heritage.value${n}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
