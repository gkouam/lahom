'use client'

import { useLanguage } from '@/lib/i18n/context'

export default function EventsSection() {
  const { t } = useLanguage()

  const events = [
    {
      day: '20', month: 'Jun', color: 'ev-red',
      titleKey: 'events.festival.title', descKey: 'events.festival.desc',
      location: 'Dallas Convention Center', time: '10AM – 8PM',
    },
    {
      day: '26', month: 'Apr', color: 'ev-green',
      titleKey: 'events.meeting.title', descKey: 'events.meeting.desc',
      location: 'Richardson Civic Center', time: '3PM – 6PM',
    },
    {
      day: '17', month: 'May', color: 'ev-amber',
      titleKey: 'events.workshop.title', descKey: 'events.workshop.desc',
      location: 'Plano Community Center', time: '1PM – 4PM',
    },
  ]

  const delays = ['', ' fd1', ' fd2']

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

        <div className="events-grid">
          {events.map((event, i) => (
            <article key={i} className={`event-card fade-in${delays[i]}`}>
              <div className={`ev-top ${event.color}`}>
                <div className="ev-pattern-fill"></div>
                <div className="ev-date">
                  <span className="ev-day">{event.day}</span>
                  <span className="ev-mo">{event.month}</span>
                </div>
              </div>
              <div className="ev-body">
                <h3>{t(event.titleKey)}</h3>
                <p>{t(event.descKey)}</p>
                <div className="ev-meta">
                  <span>📍 {event.location}</span>
                  <span>🕐 {event.time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
