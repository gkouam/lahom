'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

interface MyFinances {
  standing: string
  totalContributed: string
  contributions: {
    id: string
    amount: string
    date: string
    method: string | null
    description: string | null
  }[]
}

interface MeetingNoteSummary {
  id: string
  title: string | null
  titleFr: string | null
  body: string | null
  bodyFr: string | null
  date: string
  author: { name: string | null }
}

interface UpcomingEvent {
  id: string
  title: string | null
  titleFr: string | null
  description: string | null
  descriptionFr: string | null
  date: string
  time: string | null
  location: string | null
  capacity: number | null
  counts: { going: number; maybe: number; notGoing: number }
  capacityFull: boolean
  myRsvp: 'GOING' | 'MAYBE' | 'NOT_GOING' | null
}

interface ActivityItem {
  id: string
  category: 'community' | 'personal'
  kind: string
  timestamp: string
  link: string | null
  title?: string | null
  titleFr?: string | null
  date?: string | null
  amount?: string | null
  name?: string | null
  response?: string | null
  spotsLeft?: number | null
}

// Inline relative-time formatter (no external library).
function relativeTime(iso: string, lang: 'en' | 'fr'): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  const wk = Math.floor(day / 7)
  if (lang === 'fr') {
    if (min < 1) return 'à l\'instant'
    if (min < 60) return `il y a ${min} min`
    if (hr < 24) return `il y a ${hr} h`
    if (day < 7) return `il y a ${day} j`
    return `il y a ${wk} sem`
  }
  if (min < 1) return 'just now'
  if (min < 60) return `${min} min ago`
  if (hr < 24) return `${hr} hr ago`
  if (day < 7) return `${day} day${day > 1 ? 's' : ''} ago`
  return `${wk} week${wk > 1 ? 's' : ''} ago`
}

function interpolate(template: string, params: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`)
}

// Membership-status dot color (green-only dot was misleading for BEHIND).
const STANDING_DOT: Record<string, string> = {
  GOOD_STANDING: '#2D6A4F',
  NEW: '#6D5C4A',
  BEHIND: '#9A7410',
  EXEMPT: '#1B4332',
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { lang, t } = useLanguage()
  const user = session?.user

  const [finances, setFinances] = useState<MyFinances | null>(null)
  const [recentNotes, setRecentNotes] = useState<MeetingNoteSummary[]>([])
  const [events, setEvents] = useState<UpcomingEvent[]>([])
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [rsvpBusy, setRsvpBusy] = useState<string | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [stats, setStats] = useState<{ memberCount: number; attendanceCount: number }>({ memberCount: 0, attendanceCount: 0 })
  const [showAllActivity, setShowAllActivity] = useState(false)

  const fetchFinances = useCallback(async () => {
    try {
      const res = await fetch('/api/member/finances')
      if (res.ok) {
        const data = await res.json()
        setFinances(data)
      }
    } catch {}
  }, [])

  const fetchRecentNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/meetings')
      if (res.ok) {
        const data = await res.json()
        setRecentNotes((data.notes || []).slice(0, 3))
      }
    } catch {}
  }, [])

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/events')
      if (res.ok) {
        const data = await res.json()
        const upcoming = data.upcoming || []
        setUpcomingCount(upcoming.length)
        setEvents(upcoming.slice(0, 3))
      }
    } catch {}
  }, [])

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch('/api/member/activity')
      if (res.ok) {
        const data = await res.json()
        setActivity(data.feed || [])
        setStats(data.stats || { memberCount: 0, attendanceCount: 0 })
      }
    } catch {}
  }, [])

  useEffect(() => { fetchFinances(); fetchRecentNotes(); fetchEvents(); fetchActivity() }, [fetchFinances, fetchRecentNotes, fetchEvents, fetchActivity])

  const setRsvp = async (eventId: string, response: 'GOING' | 'MAYBE' | 'NOT_GOING', current: string | null) => {
    setRsvpBusy(eventId)
    try {
      const res = current === response
        ? await fetch(`/api/events/${eventId}/rsvp`, { method: 'DELETE' })
        : await fetch(`/api/events/${eventId}/rsvp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response }),
          })
      if (res.ok) fetchEvents()
    } catch {}
    finally { setRsvpBusy(null) }
  }

  const eventTitle = (e: UpcomingEvent) => {
    const hasEn = !!(e.title && e.description)
    const hasFr = !!(e.titleFr && e.descriptionFr)
    if (lang === 'fr' && hasFr) return e.titleFr!
    if (lang === 'en' && hasEn) return e.title!
    return e.title || e.titleFr || ''
  }

  // Resolve a bilingual title for feed items (titles can be single-language).
  const feedTitle = (it: ActivityItem) => {
    if (lang === 'fr') return it.titleFr || it.title || ''
    return it.title || it.titleFr || ''
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })

  const activityMessage = (it: ActivityItem): string => {
    switch (it.kind) {
      case 'meeting_note':
        return interpolate(t('activity.meetingNote'), { title: feedTitle(it) })
      case 'event_created':
        return interpolate(t('activity.eventCreated'), { title: feedTitle(it), date: fmtDate(it.date!) })
      case 'event_filling':
        return interpolate(t('activity.eventFilling'), { title: feedTitle(it), n: String(it.spotsLeft ?? 0) })
      case 'rsvp': {
        const respKey = it.response === 'GOING' ? 'eventsPage.rsvp.going' : it.response === 'MAYBE' ? 'eventsPage.rsvp.maybe' : 'eventsPage.rsvp.notGoing'
        return interpolate(t('activity.rsvp'), { response: t(respKey), title: feedTitle(it) })
      }
      case 'contribution':
        return interpolate(t('activity.contribution'), { amount: it.amount ?? '0.00', date: fmtDate(it.date!) })
      case 'new_member':
        return interpolate(t('activity.newMember'), { name: it.name || '—' })
      default:
        return ''
    }
  }

  return (
    <>
          {/* TopBar (desktop; the layout's compact header covers mobile) */}
          <div className="topbar desktop-only">
            <div className="topbar-left">
              <h1>{t('dash.welcome')} <span style={{ color: 'var(--gold-ink)' }}>{user?.name || 'Member'}</span></h1>
              <p>{t('dash.motto')}</p>
            </div>
            <div className="topbar-actions">
              <button title={t('dash.notifications')} aria-label={t('dash.notifications')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              <button title={t('dash.settings')} aria-label={t('dash.settings')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Standing banner (mobile) */}
          {finances && (
            <div className="dash-standing-banner">
              <span className="standing-left">
                <span
                  className="standing-dot"
                  style={{ background: STANDING_DOT[finances.standing] || STANDING_DOT.NEW }}
                />
                {t(`finances.standing.${finances.standing}`)}
              </span>
              <span className="standing-amount">
                {interpolate(t('dash.contributed'), { amount: finances.totalContributed })}
              </span>
            </div>
          )}

          {/* Stat Cards */}
          <div className="dash-stats-row">
            <div className="dash-stat-card gold">
              <div className="stat-card-inner">
                <div className="stat-icon-circle gold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                <div>
                  <div className="stat-label">{t('eventsPage.upcoming')}</div>
                  <div className="stat-value">{upcomingCount}</div>
                </div>
              </div>
            </div>
            <div className="dash-stat-card green">
              <div className="stat-card-inner">
                <div className="stat-icon-circle green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <div className="stat-label">{t('finances.duesPaid')}</div>
                  <div className="stat-value">${finances?.totalContributed || '0.00'}</div>
                </div>
              </div>
            </div>
            <div className="dash-stat-card clay">
              <div className="stat-card-inner">
                <div className="stat-icon-circle clay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <div className="stat-label">{t('dash.statMembers')}</div>
                  <div className="stat-value">{stats.memberCount}</div>
                </div>
              </div>
            </div>
            <div className="dash-stat-card wine">
              <div className="stat-card-inner">
                <div className="stat-icon-circle wine">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <div className="stat-label">{t('dash.statAttended')}</div>
                  <div className="stat-value">{stats.attendanceCount}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Content */}
          <div className="dash-content-grid">
            {/* Upcoming Events */}
            <div className="dash-content-card">
              <div className="dash-content-card-header">
                <h3>{t('eventsPage.upcoming')}</h3>
                <Link href="/dashboard/events">{t('eventsPage.viewAll')}</Link>
              </div>
              <div className="dash-content-card-body">
                {events.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>
                    {t('eventsPage.noUpcoming')}
                  </div>
                ) : (
                  events.map(e => {
                    const d = new Date(e.date)
                    const month = d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })
                    const day = d.getDate()
                    const full = e.capacityFull && e.myRsvp !== 'GOING'
                    const rsvpBtn = (response: 'GOING' | 'MAYBE' | 'NOT_GOING', labelKey: string) => {
                      const active = e.myRsvp === response
                      const disabled = rsvpBusy === e.id || (response === 'GOING' && full)
                      const variant = active
                        ? response === 'GOING'
                          ? { background: 'var(--forest-mid)', color: 'white', border: 'none' }
                          : response === 'MAYBE'
                            ? { background: 'transparent', color: 'var(--ink)', border: '2px solid var(--gold)' }
                            : { background: 'var(--muted)', color: 'white', border: 'none' }
                        : { background: 'white', color: disabled ? 'var(--muted)' : 'var(--night)', border: '1px solid var(--line)' }
                      return (
                        <button onClick={() => setRsvp(e.id, response, e.myRsvp)} disabled={disabled}
                          style={{ minHeight: '44px', padding: '0 20px', borderRadius: '10px', fontSize: '0.8125rem', fontWeight: 700, cursor: disabled ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: disabled && !active ? 0.5 : 1, ...variant }}>
                          {t(labelKey)}
                        </button>
                      )
                    }
                    return (
                      <div key={e.id} className="event-item" style={{ flexWrap: 'wrap' }}>
                        <div className="event-date-badge">
                          <span className="event-month">{month}</span>
                          <span className="event-day">{day}</span>
                        </div>
                        <div className="event-info" style={{ flex: 1, minWidth: '160px' }}>
                          <h4>{eventTitle(e)}</h4>
                          <p>
                            {[e.location, e.time].filter(Boolean).join(', ')}
                            {e.capacity !== null && (
                              <> · {full ? t('eventsPage.full') : `${e.counts.going} ${t('eventsPage.capacityOf')} ${e.capacity}`}</>
                            )}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%', marginTop: '8px' }}>
                          {rsvpBtn('GOING', 'eventsPage.rsvp.going')}
                          {rsvpBtn('MAYBE', 'eventsPage.rsvp.maybe')}
                          {rsvpBtn('NOT_GOING', 'eventsPage.rsvp.notGoing')}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Right Column: Quick Actions + Membership Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Quick Actions */}
              <div className="dash-content-card">
                <div className="dash-content-card-header">
                  <h3>{t('dash.quickActions')}</h3>
                </div>
                <div className="dash-content-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="#my-contributions" className="quick-action-btn">
                    <div className="qa-icon gold">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    {t('dash.qa.viewContributions')}
                    <div className="qa-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </a>
                  <Link href="/dashboard/events" className="quick-action-btn">
                    <div className="qa-icon green">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                    </div>
                    {t('dash.qa.rsvp')}
                    <div className="qa-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </Link>
                  <a href="mailto:admin@lahomdfw.org" className="quick-action-btn">
                    <div className="qa-icon wine">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    {t('dash.qa.contact')}
                    <div className="qa-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>

              {/* Membership Status (desktop; the mobile banner covers small screens) */}
              <div className="membership-status-card desktop-only">
                <div className="status-indicator">
                  <div className="green-dot" style={{ background: STANDING_DOT[finances?.standing || 'NEW'] }} />
                  <span>{t(`finances.standing.${finances?.standing || 'NEW'}`)}</span>
                </div>
                <h3>{t('finances.standingLabel')}</h3>
                <p>{t('finances.totalContributed')}: ${finances?.totalContributed || '0.00'}</p>
              </div>
            </div>
          </div>

          {/* My Contributions */}
          <div className="dash-content-card" id="my-contributions">
            <div className="dash-content-card-header">
              <h3>{t('finances.myContributions')}</h3>
            </div>
            <div className="dash-content-card-body">
              {!finances || finances.contributions.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>
                  {t('finances.noContributions')}
                </div>
              ) : (
                <>
                  <div className="admin-table-wrap desktop-only">
                    <table className="admin-table" style={{ marginBottom: 0 }}>
                      <thead>
                        <tr>
                          <th>{t('finances.date')}</th>
                          <th>{t('finances.amount')}</th>
                          <th>{t('finances.method')}</th>
                          <th>{t('finances.description')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {finances.contributions.slice(0, 10).map(c => (
                          <tr key={c.id}>
                            <td style={{ fontSize: '0.82rem' }}>{new Date(c.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}</td>
                            <td style={{ fontWeight: 700, fontSize: '0.82rem' }}>${c.amount}</td>
                            <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{c.method || '—'}</td>
                            <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{c.description || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mobile-only">
                    {finances.contributions.slice(0, 10).map(c => (
                      <div key={c.id} className="contrib-card">
                        <div>
                          <div className="contrib-date">{new Date(c.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}</div>
                          <div className="contrib-desc">{[c.description, c.method].filter(Boolean).join(' · ') || '—'}</div>
                        </div>
                        <div className="contrib-amount">${c.amount}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recent Meeting Notes */}
          {recentNotes.length > 0 && (
            <div className="dash-content-card">
              <div className="dash-content-card-header">
                <h3>{t('meetings.recentTitle')}</h3>
                <Link href="/dashboard/meetings">{t('meetings.viewAll')}</Link>
              </div>
              <div className="dash-content-card-body">
                {recentNotes.map(note => {
                  const hasEn = !!(note.title && note.body)
                  const hasFr = !!(note.titleFr && note.bodyFr)
                  let noteTitle: string
                  let noteBody: string
                  let fallbackKey: string | null = null

                  if (lang === 'fr' && hasFr) {
                    noteTitle = note.titleFr!
                    noteBody = note.bodyFr!
                  } else if (lang === 'en' && hasEn) {
                    noteTitle = note.title!
                    noteBody = note.body!
                  } else if (hasEn) {
                    noteTitle = note.title!
                    noteBody = note.body!
                    fallbackKey = 'meetings.fallback.enOnly'
                  } else if (hasFr) {
                    noteTitle = note.titleFr!
                    noteBody = note.bodyFr!
                    fallbackKey = 'meetings.fallback.frOnly'
                  } else {
                    noteTitle = t('meetings.contentUnavailable')
                    noteBody = ''
                  }

                  return (
                    <div key={note.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                      {fallbackKey && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--gold-ink)', fontStyle: 'italic', marginBottom: '4px' }}>
                          {t(fallbackKey)}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '4px' }}>
                        {new Date(note.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <h4 style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--night)', marginBottom: '4px' }}>
                        {noteTitle}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {noteBody}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Community Activity */}
          <div className="dash-content-card">
            <div className="dash-content-card-header">
              <h3>{t('activity.title')}</h3>
              {activity.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllActivity(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold-ink)', fontSize: '0.78rem', fontWeight: 600, padding: 0 }}
                >
                  {showAllActivity ? t('activity.viewLess') : t('activity.viewMore')}
                </button>
              )}
            </div>
            <div className="dash-content-card-body">
              {activity.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>
                  {t('activity.empty')}
                </div>
              ) : (
                (showAllActivity ? activity : activity.slice(0, 5)).map(it => {
                  const personal = it.category === 'personal'
                  const message = activityMessage(it)
                  const row = (
                    <>
                      <div
                        className="activity-avatar"
                        title={personal ? t('activity.you') : t('activity.community')}
                        aria-hidden="true"
                        style={{
                          width: '36px',
                          height: '36px',
                          background: personal ? 'rgba(212,160,23,0.15)' : 'rgba(45,106,79,0.12)',
                          color: personal ? 'var(--gold-ink)' : 'var(--forest-mid)',
                        }}
                      >
                        {personal ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="activity-text">{message}</div>
                        <span className="activity-time">
                          {it.kind === 'event_filling'
                            ? interpolate(t(it.spotsLeft === 1 ? 'activity.spotLeft' : 'activity.spotsLeft'), { n: String(it.spotsLeft ?? 0) })
                            : relativeTime(it.timestamp, lang)}
                        </span>
                      </div>
                      <span className={`activity-badge ${personal ? 'approved' : 'new'}`}>
                        {personal ? t('activity.you') : t('activity.community')}
                      </span>
                    </>
                  )
                  return it.link ? (
                    <Link key={it.id} href={it.link} className="activity-row" style={{ textDecoration: 'none', color: 'inherit' }}>
                      {row}
                    </Link>
                  ) : (
                    <div key={it.id} className="activity-row">{row}</div>
                  )
                })
              )}
            </div>
          </div>
    </>
  )
}
