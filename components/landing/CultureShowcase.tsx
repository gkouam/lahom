'use client'

import { useCallback, useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import Image from 'next/image'
import Lightbox from './Lightbox'

const cultureItems = [
  {
    src: '/images/dallas-museum-elephant-mask.jpg',
    alt: 'Bamiléké elephant mask with intricate beadwork',
    tag: 'Sacred Dance',
    title: 'Elephant Mask Society',
    desc: 'The Kuosi elephant masks represent royal power, performed at funerals and enthronement ceremonies. This mask resides at the Dallas Museum of Art.',
    delay: '',
  },
  {
    src: '/images/bamileke-zing-dance.jpg',
    alt: 'Traditional Bamiléké dance performance during Zing ceremony',
    tag: 'Ceremonial Dance',
    title: 'Zing Dance Ceremony',
    desc: 'Traditional dancers in Ndop cloth and beaded hats perform the Zing — a sacred rhythm honoring ancestors and community bonds.',
    delay: ' fd1',
  },
  {
    src: '/images/bamileke-dressing.jpg',
    alt: 'Young Bamiléké men in traditional ceremonial attire',
    tag: 'Royal Garment',
    title: 'Toghu & Ceremonial Attire',
    desc: 'The iconic hand-embroidered garments — pride of the Grasslands people, worn at weddings, royal events, and cultural celebrations.',
    delay: ' fd2',
  },
]

export default function CultureShowcase() {
  const { t } = useLanguage()
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; cap: string } | null>(null)

  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <section className="section culture-section" id="culture">
      <div className="culture-pattern-bg"></div>
      <div className="container">
        <span className="sec-label gold">{t('culture.label')}</span>
        <h2 className="sec-title light" dangerouslySetInnerHTML={{ __html: t('culture.title') }} />
        <p className="sec-desc light">{t('culture.desc')}</p>

        <div className="culture-grid">
          {cultureItems.map(item => (
            <button
              key={item.title}
              className={`culture-card fade-in${item.delay}`}
              onClick={() => setLightbox({ src: item.src, alt: item.alt, cap: `${item.title} — ${item.desc}` })}
            >
              <Image src={item.src} alt={item.alt} className="culture-card-img" width={400} height={500} loading="lazy" />
              <div className="culture-card-overlay">
                <div className="culture-card-tag">{item.tag}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} caption={lightbox.cap} onClose={closeLightbox} />
      )}
    </section>
  )
}
