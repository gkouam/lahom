'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import Image from 'next/image'
import Lightbox from './Lightbox'

const galleryItems = [
  { src: '/images/bamileke-zing-dance.jpg', alt: 'Zing dance ceremony', label: 'Zing Dance Ceremony', cap: 'Traditional Bamiléké Zing Dance Ceremony', className: 'gi-tall' },
  { src: '/images/baham-museum-architecture.jpg', alt: 'Baham museum', label: 'Royal Museum', cap: 'Royal Museum of Baham — Grassfields Architecture', className: '' },
  { src: '/images/dallas-skyline.jpg', alt: 'Dallas skyline', label: 'Dallas, Texas', cap: 'Dallas, Texas — Our American Home', className: '' },
  { src: '/images/bamileke-dressing.jpg', alt: 'Traditional attire', label: 'Traditional Attire', cap: 'Young men in traditional Bamiléké attire', className: '' },
  { src: '/images/baham-museum-interior.jpg', alt: 'Museum interior', label: 'Sacred Artifacts', cap: 'Inside the Royal Museum of Baham — Sacred Sculptures', className: 'gi-wide' },
]

export default function GallerySection() {
  const { t } = useLanguage()
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; cap: string } | null>(null)

  const delays = ['', ' fd1', ' fd2', '', ' fd1']

  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <section className="section gallery-section" id="gallery">
      <div className="container">
        <div className="section-heading-center fade-in">
          <span className="sec-label gold">{t('gallery.label')}</span>
          <h2 className="sec-title light" dangerouslySetInnerHTML={{ __html: t('gallery.title') }} />
        </div>

        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <button
              key={i}
              className={`gallery-item ${item.className} fade-in${delays[i]}`}
              onClick={() => setLightbox({ src: item.src, alt: item.alt, cap: item.cap })}
            >
              <Image src={item.src} alt={item.alt} width={600} height={400} loading="lazy" />
              <span className="gi-label">{item.label}</span>
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
