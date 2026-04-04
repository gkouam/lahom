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
              <div className="value-card">
                <h4>◆ Royal Tradition</h4>
                <p>Honoring the Fon and our ancestral governance — a legacy of wisdom and leadership.</p>
              </div>
              <div className="value-card">
                <h4>◆ Unity (Nkam)</h4>
                <p>Coming together as one family across borders, supporting each other in the diaspora.</p>
              </div>
              <div className="value-card">
                <h4>◆ Cultural Preservation</h4>
                <p>Keeping our language, dance, music, and art alive for the next generation.</p>
              </div>
              <div className="value-card">
                <h4>◆ Community Impact</h4>
                <p>Building bridges between our Cameroon roots and our American home.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
