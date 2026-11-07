'use client'

import { useLanguage } from '@/lib/i18n/context'

// Outline of Cameroon from Natural Earth (public domain, via world-atlas 2.0.2),
// equirectangular projection, simplified to 170 points. Baham is placed at the
// coordinates shown in the caption (5°23'N, 10°21'E).
const CAMEROON = 'M6.5 212.2 L12.5 201.3 L15.8 186.8 L17.4 183.5 L26.6 173.5 L33.7 168.2 L36.6 162.5 L45.5 156.7 L47.1 159.3 L53.9 159.3 L55.7 155.7 L57.0 155.1 L60.1 156.9 L66.8 163.1 L69.3 170.0 L72.4 170.2 L78.4 166.6 L80.1 164.1 L80.8 159.4 L87.7 153.7 L85.4 149.9 L91.6 142.0 L91.8 138.6 L95.0 133.2 L96.9 124.8 L101.1 117.1 L105.5 116.4 L110.4 111.6 L112.7 99.5 L114.0 96.5 L120.7 93.1 L122.4 81.4 L126.0 78.0 L128.9 67.3 L137.6 54.0 L141.7 51.4 L145.3 50.8 L154.1 45.3 L154.6 42.8 L154.1 39.4 L155.5 33.1 L155.5 29.0 L153.1 25.3 L145.2 23.2 L141.9 6.0 L146.3 6.0 L151.7 7.4 L153.0 8.5 L153.7 12.4 L155.6 14.6 L159.1 16.5 L161.2 20.3 L162.0 26.0 L166.9 36.5 L166.8 41.6 L167.9 44.1 L166.3 48.4 L165.6 54.7 L166.6 61.2 L168.2 66.2 L171.7 73.4 L178.0 80.1 L181.0 82.1 L178.2 83.3 L168.2 82.7 L160.9 83.7 L146.3 82.8 L143.7 84.7 L139.8 89.9 L140.5 92.5 L148.5 102.0 L158.3 110.4 L161.4 112.0 L167.7 118.0 L171.1 123.8 L175.8 135.5 L178.4 137.1 L178.6 138.3 L178.0 141.6 L174.2 147.7 L170.9 150.1 L170.0 151.5 L165.8 161.9 L164.5 162.9 L161.5 167.6 L159.1 173.6 L157.6 175.2 L152.9 177.4 L150.9 180.4 L152.7 183.5 L154.5 183.5 L155.5 184.7 L155.5 193.9 L154.6 195.3 L154.2 199.2 L156.0 201.7 L157.7 214.5 L159.2 217.1 L165.4 222.1 L166.5 223.9 L168.3 230.0 L165.8 230.6 L166.4 232.3 L168.1 235.2 L183.9 252.6 L187.1 253.4 L191.1 258.0 L191.5 259.7 L190.9 261.4 L192.0 264.8 L192.1 268.8 L194.0 273.8 L193.8 275.4 L191.4 277.9 L191.2 280.0 L192.8 287.3 L190.9 288.5 L183.1 282.6 L179.7 281.7 L173.2 281.9 L168.9 279.6 L167.4 280.5 L162.5 280.2 L161.8 278.5 L159.1 278.6 L158.3 277.5 L156.8 277.2 L154.5 275.6 L152.2 276.7 L123.0 276.5 L122.4 274.9 L121.2 274.2 L112.5 274.4 L100.0 273.2 L80.3 273.0 L75.2 273.1 L74.7 276.4 L41.6 276.4 L38.8 275.2 L37.1 273.0 L39.2 257.8 L40.8 253.8 L40.0 249.8 L34.0 242.4 L36.3 240.3 L33.2 240.6 L31.1 236.0 L32.9 234.2 L35.6 234.6 L33.2 231.8 L34.4 229.6 L33.9 229.0 L32.2 230.3 L30.9 230.3 L29.4 229.3 L29.8 230.9 L27.9 232.9 L25.1 232.4 L23.6 231.0 L17.5 228.7 L16.9 225.2 L15.3 222.1 L15.5 217.2 L11.6 216.6 L9.1 214.3 L9.8 217.3 L9.0 218.2 L7.0 217.9 L6.0 215.9 L6.5 212.2Z'
const BAHAM = { x: 50.6, y: 196.7 }

export default function BahamLocation() {
  const { t } = useLanguage()

  return (
    <div className="baham-location">
      <div className="container baham-location-inner">
        <div className="baham-map-svg">
          <svg viewBox="0 0 200 295" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={t('location.mapLabel')}>
            <path d={CAMEROON} stroke="var(--gold-ink)" strokeWidth="1.1" strokeLinejoin="round" fill="var(--gold)" fillOpacity="0.1" />
            <circle cx={BAHAM.x} cy={BAHAM.y} r="9" fill="none" stroke="var(--wine-bright)" strokeWidth="0.9" opacity="0.5" />
            <circle cx={BAHAM.x} cy={BAHAM.y} r="3.6" fill="var(--wine-bright)" />
            <text x={BAHAM.x + 12} y={BAHAM.y + 4} fill="var(--ink)" fontSize="13" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.06em">BAHAM</text>
          </svg>
        </div>
        <div className="baham-location-text">
          <span className="sec-label">{t('location.label')}</span>
          <h3 dangerouslySetInnerHTML={{ __html: t('location.title') }} />
          <p>{t('location.desc')}</p>
        </div>
        <dl className="baham-facts">
          <div>
            <dt>{t('location.fact.region')}</dt>
            <dd>{t('location.fact.regionValue')}</dd>
          </div>
          <div>
            <dt>{t('location.fact.language')}</dt>
            <dd>Ghomala&apos;</dd>
          </div>
          <div>
            <dt>{t('location.fact.altitude')}</dt>
            <dd>≈ 1,400 m</dd>
          </div>
          <div>
            <dt>{t('location.fact.coordinates')}</dt>
            <dd>5°23′ N, 10°21′ E</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
