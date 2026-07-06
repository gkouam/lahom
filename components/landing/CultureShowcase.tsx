'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import Image from 'next/image'
import Lightbox from './Lightbox'

interface CultureItem {
  id: string
  url: string
  tag: string
  tagFr: string | null
  title: string
  titleFr: string | null
  description: string
  descriptionFr: string | null
}

// Shown until the API answers — and the permanent fallback if the table is
// ever empty, so the landing page can never go blank.
const fallbackItems: CultureItem[] = [
  {
    id: 'f1',
    url: '/images/dallas-museum-elephant-mask.jpg',
    tag: 'Sacred Dance', tagFr: null,
    title: 'Elephant Mask Society', titleFr: null,
    description: 'The Kuosi elephant masks represent royal power, performed at funerals and enthronement ceremonies. This mask resides at the Dallas Museum of Art.',
    descriptionFr: null,
  },
  {
    id: 'f2',
    url: '/images/bamileke-zing-dance.jpg',
    tag: 'Ceremonial Dance', tagFr: null,
    title: 'Zing Dance Ceremony', titleFr: null,
    description: 'Traditional dancers in Ndop cloth and beaded hats perform the Zing — a sacred rhythm honoring ancestors and community bonds.',
    descriptionFr: null,
  },
  {
    id: 'f3',
    url: '/images/bamileke-dressing.jpg',
    tag: 'Royal Garment', tagFr: null,
    title: 'Toghu & Ceremonial Attire', titleFr: null,
    description: 'The iconic hand-embroidered garments — pride of the Grasslands people, worn at weddings, royal events, and cultural celebrations.',
    descriptionFr: null,
  },
]

export default function CultureShowcase() {
  const { lang, t } = useLanguage()
  const [items, setItems] = useState<CultureItem[]>(fallbackItems)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; cap: string } | null>(null)

  useEffect(() => {
    fetch('/api/public/culture')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d?.items?.length) setItems(d.items) })
      .catch(() => {})
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  const pick = (en: string, fr: string | null) => (lang === 'fr' && fr ? fr : en)

  return (
    <section className="section culture-section" id="culture">
      <div className="culture-pattern-bg"></div>
      <div className="container">
        <span className="sec-label gold">{t('culture.label')}</span>
        <h2 className="sec-title light" dangerouslySetInnerHTML={{ __html: t('culture.title') }} />
        <p className="sec-desc light">{t('culture.desc')}</p>

        <div className="culture-grid">
          {items.map(item => {
            const tag = pick(item.tag, item.tagFr)
            const title = pick(item.title, item.titleFr)
            const desc = pick(item.description, item.descriptionFr)
            return (
              <button
                key={item.id}
                className="culture-card"
                onClick={() => setLightbox({ src: item.url, alt: title, cap: `${title} — ${desc}` })}
              >
                <Image src={item.url} alt={title} className="culture-card-img" width={400} height={500} loading="lazy" />
                <div className="culture-card-overlay">
                  <div className="culture-card-tag">{tag}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} caption={lightbox.cap} onClose={closeLightbox} />
      )}
    </section>
  )
}
