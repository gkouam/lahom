'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

interface EventItem {
  id: string
  title: string | null
  titleFr: string | null
  description: string | null
  descriptionFr: string | null
  date: string
  time: string | null
  location: string | null
  color: string
  capacity: number | null
  counts: { going: number; maybe: number; notGoing: number }
  capacityFull: boolean
  myRsvp: 'GOING' | 'MAYBE' | 'NOT_GOING' | null
}

interface RosterPerson { name: string }
interface Roster { going: RosterPerson[]; maybe: RosterPerson[]; notGoing: RosterPerson[] }

function resolveContent(e: EventItem, lang: 'en' | 'fr') {
  const hasEn = !!(e.title && e.description)
  const hasFr = !!(e.titleFr && e.descriptionFr)
  if (lang === 'fr' && hasFr) return { title: e.titleFr!, description: e.descriptionFr!, fallback: null }
  if (lang === 'en' && hasEn) return { title: e.title!, description: e.description!, fallback: null }
  if (hasEn) return { title: e.title!, description: e.description!, fallback: 'meetings.fallback.enOnly' }
  if (hasFr) return { title: e.titleFr!, description: e.descriptionFr!, fallback: 'meetings.fallback.frOnly' }
  return { title: '', description: '', fallback: 'meetings.contentUnavailable' }
}

export default function MemberEventsPage() {
  const { lang, t } = useLanguage()
  const [upcoming, setUpcoming] = useState<EventItem[]>([])
  const [past, setPast] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showPast, setShowPast] = useState(false)
  const [pastLoaded, setPastLoaded] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Roster expansion
  const [openRosterId, setOpenRosterId] = useState<string | null>(null)
  const [rosters, setRosters] = useState<Record<string, Roster>>({})

  const fetchEvents = useCallback(async (includePast: boolean) => {
    try {
      const res = await fetch(`/api/events${includePast ? '?include=past' : ''}`)
      if (res.ok) {
        const data = await res.json()
        setUpcoming(data.upcoming)
        if (includePast) { setPast(data.past || []); setPastLoaded(true) }
      }
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchEvents(false) }, [fetchEvents])

  const togglePast = () => {
    const next = !showPast
    setShowPast(next)
    if (next && !pastLoaded) fetchEvents(true)
  }

  const setRsvp = async (eventId: string, response: 'GOING' | 'MAYBE' | 'NOT_GOING', current: string | null) => {
    setBusyId(eventId); setError(null)
    try {
      let res: Response
      if (current === response) {
        // Tapping the active choice clears the RSVP (back to no response).
        res = await fetch(`/api/events/${eventId}/rsvp`, { method: 'DELETE' })
      } else {
        res = await fetch(`/api/events/${eventId}/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ response }),
        })
      }
      if (res.ok) {
        await fetchEvents(showPast)
        if (openRosterId === eventId) loadRoster(eventId)
      } else {
        const d = await res.json()
        setError(d.error || t('eventsPage.rsvpFailed'))
      }
    } catch { setError(t('common.networkError')) }
    finally { setBusyId(null) }
  }

  const loadRoster = useCallback(async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}`)
      if (res.ok) {
        const data = await res.json()
        setRosters(prev => ({ ...prev, [eventId]: data.event.roster }))
      }
    } catch {}
  }, [])

  const toggleRoster = (eventId: string) => {
    if (openRosterId === eventId) { setOpenRosterId(null); return }
    setOpenRosterId(eventId)
    if (!rosters[eventId]) loadRoster(eventId)
  }

  const renderCard = (e: EventItem, isPast: boolean) => {
    const { title, description, fallback } = resolveContent(e, lang)
    const full = e.capacityFull && e.myRsvp !== 'GOING'
    const roster = rosters[e.id]

    const rsvpBtn = (response: 'GOING' | 'MAYBE' | 'NOT_GOING', labelKey: string, activeBg: string) => {
      const active = e.myRsvp === response
      const disabled = isPast || busyId === e.id || (response === 'GOING' && full)
      return (
        <button
          onClick={() => setRsvp(e.id, response, e.myRsvp)}
          disabled={disabled}
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: disabled ? 'default' : 'pointer',
            border: active ? 'none' : '1px solid var(--line)',
            background: active ? activeBg : 'white',
            color: active ? 'white' : (disabled ? 'var(--muted)' : 'var(--night)'),
            opacity: disabled && !active ? 0.5 : 1,
          }}
        >
          {t(labelKey)}
        </button>
      )
    }

    return (
      <div key={e.id} className="dash-content-card" style={isPast ? { opacity: 0.75 } : undefined}>
        <div style={{ padding: '20px' }}>
          {fallback && (
            <div style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.72rem', marginBottom: '10px', background: '#FFF3CD', color: '#856404', fontStyle: 'italic', display: 'inline-block' }}>
              {t(fallback)}
            </div>
          )}
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '6px' }}>
            {new Date(e.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            {e.time && <> &middot; {e.time}</>}
            {e.location && <> &middot; {e.location}</>}
          </div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--night)', marginBottom: '8px' }}>
            {title || t('meetings.contentUnavailable')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--night)', lineHeight: '1.5', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
            {description}
          </p>

          {/* Capacity / attendance status */}
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '12px' }}>
            {e.capacity !== null ? (
              <span style={{ fontWeight: 600, color: full ? '#8B2020' : 'var(--night)' }}>
                {full && <strong>{t('eventsPage.full')} · </strong>}
                {e.counts.going} {t('eventsPage.capacityOf')} {e.capacity} {t('eventsPage.spotsGoing')}
              </span>
            ) : (
              <span>{e.counts.going} {t('eventsPage.spotsGoing')}</span>
            )}
          </div>

          {/* RSVP buttons */}
          {!isPast && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {rsvpBtn('GOING', 'eventsPage.rsvp.going', 'var(--forest, #2D6A4F)')}
              {rsvpBtn('MAYBE', 'eventsPage.rsvp.maybe', 'var(--gold, #D4A017)')}
              {rsvpBtn('NOT_GOING', 'eventsPage.rsvp.notGoing', 'var(--muted, #777)')}
            </div>
          )}

          {/* Roster toggle */}
          <button onClick={() => toggleRoster(e.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 600, padding: 0 }}>
            {openRosterId === e.id ? t('eventsPage.hideWho') : t('eventsPage.seeWho')}
          </button>

          {openRosterId === e.id && (
            <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              {roster ? (
                ([
                  ['eventsPage.whoGoing', roster.going],
                  ['eventsPage.whoMaybe', roster.maybe],
                  ['eventsPage.whoNotGoing', roster.notGoing],
                ] as const).map(([labelKey, list]) => (
                  <div key={labelKey}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--night)', marginBottom: '6px' }}>
                      {t(labelKey)} ({list.length})
                    </div>
                    {list.length === 0 ? (
                      <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{t('eventsPage.noResponses')}</div>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: 'var(--night)' }}>
                        {list.map((p, i) => <li key={i}>{p.name}</li>)}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>...</div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="dash-layout">
        <main className="dash-main">
          <div className="dash-main-inner">
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
                <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
                <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
              </svg>
              <p>{t('eventsPage.title')}...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dash-layout">
      <main className="dash-main">
        <div className="dash-main-inner">
          <div className="topbar">
            <div className="topbar-left">
              <h1>{t('eventsPage.title')}</h1>
            </div>
          </div>

          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #E8AAAA', borderRadius: '10px', padding: '12px 18px', marginBottom: '20px', fontSize: '0.82rem', color: '#8B2020', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{error}</span>
              <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B2020', fontWeight: 700, fontSize: '1rem' }}>&times;</button>
            </div>
          )}

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--night)', marginBottom: '12px' }}>
            {t('eventsPage.upcoming')}
          </h2>
          {upcoming.length === 0 ? (
            <div className="dash-content-card">
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>
                {t('eventsPage.noUpcoming')}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcoming.map(e => renderCard(e, false))}
            </div>
          )}

          {/* Past events */}
          <div style={{ marginTop: '24px' }}>
            <button onClick={togglePast}
              style={{ background: 'none', border: '1px solid var(--line)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', color: 'var(--night)', fontSize: '0.82rem', fontWeight: 600 }}>
              {showPast ? t('eventsPage.hidePast') : t('eventsPage.viewPast')}
            </button>

            {showPast && (
              <div style={{ marginTop: '16px' }}>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--night)', marginBottom: '12px' }}>
                  {t('eventsPage.past')}
                </h2>
                {past.length === 0 ? (
                  <div className="dash-content-card">
                    <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>
                      {t('eventsPage.noPast')}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {past.map(e => renderCard(e, true))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link href="/dashboard" style={{ color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
              &larr; {t('auth.dashboard')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
