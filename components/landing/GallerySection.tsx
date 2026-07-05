'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import Image from 'next/image'
import Lightbox from './Lightbox'

interface GalleryItem {
  id: string
  url: string
  label: string
  labelFr: string | null
  caption: string
  captionFr: string | null
  span: 'tall' | 'wide' | null
}

// Shown until the API answers — and kept as the permanent fallback if the
// gallery table is ever empty, so the landing page can never go blank.
const fallbackItems: GalleryItem[] = [
  { id: 'f1', url: '/images/bamileke-zing-dance.jpg', label: 'Zing Dance Ceremony', labelFr: null, caption: 'Traditional Bamiléké Zing Dance Ceremony', captionFr: null, span: 'tall' },
  { id: 'f2', url: '/images/baham-museum-architecture.jpg', label: 'Royal Museum', labelFr: null, caption: 'Royal Museum of Baham — Grassfields Architecture', captionFr: null, span: null },
  { id: 'f3', url: '/images/dallas-skyline.jpg', label: 'Dallas, Texas', labelFr: null, caption: 'Dallas, Texas — Our American Home', captionFr: null, span: null },
  { id: 'f4', url: '/images/bamileke-dressing.jpg', label: 'Traditional Attire', labelFr: null, caption: 'Young men in traditional Bamiléké attire', captionFr: null, span: null },
  { id: 'f5', url: '/images/baham-museum-interior.jpg', label: 'Sacred Artifacts', labelFr: null, caption: 'Inside the Royal Museum of Baham — Sacred Sculptures', captionFr: null, span: 'wide' },
]

export default function GallerySection() {
  const { lang, t } = useLanguage()
  const [items, setItems] = useState<GalleryItem[]>(fallbackItems)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; cap: string } | null>(null)

  useEffect(() => {
    fetch('/api/public/gallery')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d?.images?.length) setItems(d.images) })
      .catch(() => {})
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  const pick = (en: string, fr: string | null) => (lang === 'fr' && fr ? fr : en)

  return (
    <section className="section gallery-section" id="gallery">
      <div className="container">
        <div className="section-heading-center fade-in">
          <span className="sec-label gold">{t('gallery.label')}</span>
          <h2 className="sec-title light" dangerouslySetInnerHTML={{ __html: t('gallery.title') }} />
        </div>

        <div className="gallery-grid">
          {items.map(item => {
            const label = pick(item.label, item.labelFr)
            const cap = pick(item.caption, item.captionFr)
            const spanClass = item.span === 'tall' ? 'gi-tall' : item.span === 'wide' ? 'gi-wide' : ''
            return (
              <button
                key={item.id}
                className={`gallery-item ${spanClass}`}
                onClick={() => setLightbox({ src: item.url, alt: label, cap })}
              >
                <Image src={item.url} alt={label} width={600} height={400} loading="lazy" />
                <span className="gi-label">{label}</span>
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
