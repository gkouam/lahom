'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useLanguage } from '@/lib/i18n/context'
import { calendarDayOfMonth, formatCalendarDate } from '@/lib/dates'

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
  const { data: session } = useSession()
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

  const empty = loaded && events.length === 0

  return (
    <section className="section events-section" id="events">
      <div className="section-pattern-bg"></div>
      <div className="container">
        <div className="events-header fade-in">
          <div>
            <span className="sec-label">{t('events.label')}</span>
            <h2 className="sec-title" dangerouslySetInnerHTML={{ __html: t('events.title') }} />
          </div>
          {session && !empty && (
            <Link href="/dashboard/events" className="btn btn-outline-dark">{t('events.memberLink')}</Link>
          )}
        </div>

        {empty ? (
          <div className="events-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <h3>{t('events.emptyTitle')}</h3>
            <p>{t('events.emptyBody')}</p>
            {!session && <Link href="/auth/signup" className="btn btn-gold">{t('events.emptyCta')}</Link>}
          </div>
        ) : (
          <div className="events-grid">
            {events.slice(0, 3).map((event) => {
              const { title, desc, fallback } = resolve(event)
              const day = calendarDayOfMonth(event.date)
              const month = formatCalendarDate(event.date, lang, { month: 'short' })
              return (
                <article key={event.id} className="event-card">
                  <div className={`ev-top ev-${event.color}`} style={{ position: 'relative' }}>
                    <div className="ev-pattern-fill"></div>
                    <div className="ev-date">
                      <span className="ev-day">{day}</span>
                      <span className="ev-mo">{month}</span>
                    </div>
                    {event.isFull && <span className="ev-full">{t('eventsPage.full')}</span>}
                  </div>
                  <div className="ev-body">
                    {fallback && <p className="ev-fallback">{t(fallback)}</p>}
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <div className="ev-meta">
                      {event.location && (
                        <span className="ev-meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {event.location}
                        </span>
                      )}
                      {event.time && (
                        <span className="ev-meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {event.time}
                        </span>
                      )}
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
