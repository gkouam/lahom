'use client'

import { useLanguage } from '@/lib/i18n/context'
import Image from 'next/image'

export default function CultureShowcase() {
  const { t } = useLanguage()

  return (
    <section className="section culture-section" id="culture">
      <div className="culture-pattern-bg"></div>
      <div className="container">
        <span className="sec-label gold">{t('culture.label')}</span>
        <h2 className="sec-title light" dangerouslySetInnerHTML={{ __html: t('culture.title') }} />
        <p className="sec-desc light">{t('culture.desc')}</p>

        <div className="culture-grid">
          <div className="culture-card fade-in">
            <Image src="/images/dallas-museum-elephant-mask.jpg" alt="Bamiléké elephant mask with intricate beadwork" className="culture-card-img" width={400} height={500} loading="lazy" />
            <div className="culture-card-overlay">
              <div className="culture-card-tag">Sacred Dance</div>
              <h3>Elephant Mask Society</h3>
              <p>The Kuosi elephant masks represent royal power, performed at funerals and enthronement ceremonies. This mask resides at the Dallas Museum of Art.</p>
            </div>
          </div>

          <div className="culture-card fade-in fd1">
            <Image src="/images/bamileke-zing-dance.jpg" alt="Traditional Bamiléké dance performance during Zing ceremony" className="culture-card-img" width={400} height={500} loading="lazy" />
            <div className="culture-card-overlay">
              <div className="culture-card-tag">Ceremonial Dance</div>
              <h3>Zing Dance Ceremony</h3>
              <p>Traditional dancers in Ndop cloth and beaded hats perform the Zing — a sacred rhythm honoring ancestors and community bonds.</p>
            </div>
          </div>

          <div className="culture-card fade-in fd2">
            <Image src="/images/bamileke-dressing.jpg" alt="Young Bamiléké men in traditional ceremonial attire" className="culture-card-img" width={400} height={500} loading="lazy" />
            <div className="culture-card-overlay">
              <div className="culture-card-tag">Royal Garment</div>
              <h3>Toghu & Ceremonial Attire</h3>
              <p>The iconic hand-embroidered garments — pride of the Grasslands people, worn at weddings, royal events, and cultural celebrations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
