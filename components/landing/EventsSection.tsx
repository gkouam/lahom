'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'

interface PublicEvent {
  id: string
  title: string | null
  titleFr: string | null
  description: string | null
  descriptionFr: string | null
  date: string
  time: string | null
  location: string | null
  color: string
  isFull: boolean
}

export default function EventsSection() {
  const { lang, t } = useLanguage()
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/public/events')
      .then(r => r.ok ? r.json() : { events: [] })
      .then(d => setEvents(d.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoaded(true))
  }, [])

  const resolve = (e: PublicEvent) => {
    const hasEn = !!(e.title && e.description)
    const hasFr = !!(e.titleFr && e.descriptionFr)
    if (lang === 'fr' && hasFr) return { title: e.titleFr!, desc: e.descriptionFr!, fallback: null }
    if (lang === 'en' && hasEn) return { title: e.title!, desc: e.description!, fallback: null }
    if (hasEn) return { title: e.title!, desc: e.description!, fallback: 'meetings.fallback.enOnly' }
    if (hasFr) return { title: e.titleFr!, desc: e.descriptionFr!, fallback: 'meetings.fallback.frOnly' }
    return { title: '', desc: '', fallback: null }
  }

  return (
    <section className="section events-section" id="events">
      <div className="section-pattern-bg"></div>
      <div className="container">
        <div className="events-header fade-in">
          <div>
            <span className="sec-label">{t('events.label')}</span>
            <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: t('events.title') }} />
          </div>
          <a href="#join" className="btn btn-outline-dark">{t('events.btn')}</a>
        </div>

        {loaded && events.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0' }}>
            {t('eventsPage.noUpcoming')}
          </p>
        ) : (
          <div className="events-grid">
            {events.slice(0, 3).map((event) => {
              const { title, desc, fallback } = resolve(event)
              const d = new Date(event.date)
              const day = d.getDate()
              const month = d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })
              return (
                <article key={event.id} className="event-card">
                  <div className={`ev-top ev-${event.color}`} style={{ position: 'relative' }}>
                    <div className="ev-pattern-fill"></div>
                    <div className="ev-date">
                      <span className="ev-day">{day}</span>
                      <span className="ev-mo">{month}</span>
                    </div>
                    {event.isFull && (
                      <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(139,32,32,0.92)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                        {t('eventsPage.full')}
                      </span>
                    )}
                  </div>
                  <div className="ev-body">
                    {fallback && (
                      <p style={{ fontSize: '0.7rem', color: '#856404', fontStyle: 'italic', marginBottom: '6px' }}>
                        {t(fallback)}
                      </p>
                    )}
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <div className="ev-meta">
                      {event.location && <span>📍 {event.location}</span>}
                      {event.time && <span>🕐 {event.time}</span>}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
