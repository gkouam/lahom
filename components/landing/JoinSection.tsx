'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

const WHATSAPP_URL = 'https://chat.whatsapp.com/FdXvBZ537ZdFfJvENDernh'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// One way to join: the sign-up form. The small form below is for questions
// from anyone (members or not); it lands in Admin → Messages.
export default function JoinSection() {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot, hidden from people
  const [status, setStatus] = useState<{ kind: 'idle' | 'sending' | 'sent' | 'error'; text?: string }>({ kind: 'idle' })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) return setStatus({ kind: 'error', text: t('contact.nameRequired') })
    if (!email.trim()) return setStatus({ kind: 'error', text: t('form.emailEmpty') })
    if (!EMAIL_RE.test(email.trim())) return setStatus({ kind: 'error', text: t('form.emailInvalid') })
    if (!message.trim()) return setStatus({ kind: 'error', text: t('contact.messageRequired') })

    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim(), website }),
      })
      if (res.ok) {
        setStatus({ kind: 'sent', text: t('contact.sent') })
        setName(''); setEmail(''); setMessage('')
      } else {
        setStatus({ kind: 'error', text: t('contact.error') })
      }
    } catch {
      setStatus({ kind: 'error', text: t('contact.error') })
    }
  }

  return (
    <section className="section join-section" id="join">
      <div className="join-pattern-bg"></div>
      <div className="join-inner fade-in">
        <span className="sec-label gold">{t('join.label')}</span>
        <h2 className="sec-title light" style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: t('join.title') }} />
        <p>{t('join.desc')}</p>

        <div className="join-path">
          <h3 className="join-steps-title">{t('join.stepsTitle')}</h3>
          <ol className="join-steps">
            <li><span className="join-step-num">1</span>{t('join.step1')}</li>
            <li><span className="join-step-num">2</span>{t('join.step2')}</li>
            <li><span className="join-step-num">3</span>{t('join.step3')}</li>
          </ol>
          <div className="join-actions">
            <Link href="/auth/signup" className="btn btn-gold">{t('join.cta')}</Link>
            <p className="join-small">
              {t('join.haveAccount')} <Link href="/auth/signin">{t('auth.signin')}</Link>
            </p>
          </div>
        </div>

        <form className="contact-form" onSubmit={submit} noValidate>
          <h3>{t('contact.title')}</h3>
          <div className="contact-row">
            <div className="contact-field">
              <label htmlFor="contact-name">{t('contact.name')}</label>
              <input id="contact-name" type="text" autoComplete="name" maxLength={100} value={name}
                onChange={e => { setName(e.target.value); if (status.kind === 'error') setStatus({ kind: 'idle' }) }} />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">{t('contact.email')}</label>
              <input id="contact-email" type="email" autoComplete="email" maxLength={255} value={email}
                onChange={e => { setEmail(e.target.value); if (status.kind === 'error') setStatus({ kind: 'idle' }) }} />
            </div>
          </div>
          <div className="contact-field">
            <label htmlFor="contact-message">{t('contact.message')}</label>
            <textarea id="contact-message" rows={4} maxLength={1000} value={message}
              onChange={e => { setMessage(e.target.value); if (status.kind === 'error') setStatus({ kind: 'idle' }) }} />
          </div>
          {/* Honeypot: bots fill every field; people never see this one. */}
          <div className="contact-hp" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
          </div>
          <div className="contact-submit">
            <button type="submit" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? t('contact.sending') : t('contact.send')}
            </button>
            <p className="join-small">
              {t('contact.orEmail')} <a href="mailto:info@lahomdfw.org">info@lahomdfw.org</a>
            </p>
          </div>
          <p className={`join-msg ${status.kind === 'error' ? 'error' : status.kind === 'sent' ? 'success' : ''}`} role="status" aria-live="polite">
            {status.text || ''}
          </p>
        </form>

        <a href={WHATSAPP_URL} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>{t('join.whatsapp')}</span>
        </a>
      </div>
    </section>
  )
}
