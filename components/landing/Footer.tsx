'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

const WHATSAPP_URL = 'https://chat.whatsapp.com/FdXvBZ537ZdFfJvENDernh'

export default function Footer() {
  const { t, tf } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <>
      <div className="kente-bar"></div>
      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <h3>{t('brand.name')}</h3>
            <p className="footer-tagline">{t('brand.tagline')}</p>
            <p>{t('footer.about')}</p>
            <div className="footer-flag">
              <span className="fc-green"></span><span className="fc-red"></span><span className="fc-gold"></span>
              {t('footer.flag')}
            </div>
          </div>
          <div className="footer-col">
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
              <li><a href="#heritage">{t('nav.heritage')}</a></li>
              <li><a href="#culture">{t('footer.culture')}</a></li>
              <li><a href="#events">{t('nav.events')}</a></li>
              <li><a href="#gallery">{t('nav.gallery')}</a></li>
              <li><a href="#leadership">{t('nav.leadership')}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer.members')}</h4>
            <ul>
              <li><Link href="/auth/signup">{t('footer.becomeMember')}</Link></li>
              <li><Link href="/auth/signin">{t('footer.signIn')}</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer.contact')}</h4>
            <ul>
              <li><a href="mailto:info@lahomdfw.org">info@lahomdfw.org</a></li>
              <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{t('footer.whatsapp')}</a></li>
              <li><a href="#join">{t('contact.title')}</a></li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>{tf('footer.rights', { year })}</span>
          <div className="footer-credits">
            {t('footer.photos')} DILANE MIYO, Wiki Loves Africa, Geremibidias, Mary Harrsch, Devane NDONNANG, IcedCowboyCoffee, Bamiboi
          </div>
        </div>
      </footer>
    </>
  )
}
