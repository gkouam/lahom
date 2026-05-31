'use client'

import { Fragment, useEffect, useState, useCallback } from 'react'

interface EventRow {
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
}

interface Roster {
  going: { name: string }[]
  maybe: { name: string }[]
  notGoing: { name: string }[]
}

function displayTitle(e: EventRow) {
  return e.title || e.titleFr || '—'
}

function langIndicator(e: EventRow) {
  const hasEn = !!(e.title && e.description)
  const hasFr = !!(e.titleFr && e.descriptionFr)
  if (hasEn && hasFr) return 'EN+FR'
  if (hasFr) return 'FR'
  return 'EN'
}

function isValidPair(d: { title: string; description: string; titleFr: string; descriptionFr: string }) {
  const hasEn = !!(d.title.trim() && d.description.trim())
  const hasFr = !!(d.titleFr.trim() && d.descriptionFr.trim())
  return hasEn || hasFr
}

const LANG_BADGE: Record<string, { bg: string; color: string }> = {
  'EN': { bg: '#D1ECF1', color: '#0C5460' },
  'FR': { bg: '#FFF3CD', color: '#856404' },
  'EN+FR': { bg: '#D4EDDA', color: '#155724' },
}

const COLORS = ['red', 'green', 'amber', 'gold', 'wine', 'forest', 'clay']

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [fTitle, setFTitle] = useState('')
  const [fDesc, setFDesc] = useState('')
  const [fTitleFr, setFTitleFr] = useState('')
  const [fDescFr, setFDescFr] = useState('')
  const [fDate, setFDate] = useState(new Date().toISOString().split('T')[0])
  const [fTime, setFTime] = useState('')
  const [fLocation, setFLocation] = useState('')
  const [fColor, setFColor] = useState('red')
  const [fCapacity, setFCapacity] = useState('')
  const [saving, setSaving] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Roster view
  const [rosterFor, setRosterFor] = useState<string | null>(null)
  const [roster, setRoster] = useState<Roster | null>(null)
  const [rosterLoading, setRosterLoading] = useState(false)

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/events')
      const data = await res.json()
      if (res.ok) setEvents(data.events)
    } catch { setError('Failed to load events') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const resetForm = () => {
    setFTitle(''); setFDesc(''); setFTitleFr(''); setFDescFr('')
    setFDate(new Date().toISOString().split('T')[0])
    setFTime(''); setFLocation(''); setFColor('red'); setFCapacity('')
    setEditingId(null); setShowForm(false)
  }

  const startEdit = (e: EventRow) => {
    setFTitle(e.title || ''); setFDesc(e.description || '')
    setFTitleFr(e.titleFr || ''); setFDescFr(e.descriptionFr || '')
    setFDate(e.date.split('T')[0])
    setFTime(e.time || ''); setFLocation(e.location || ''); setFColor(e.color)
    setFCapacity(e.capacity !== null ? String(e.capacity) : '')
    setEditingId(e.id); setShowForm(true); setDeleteConfirm(null)
  }

  const saveEvent = async () => {
    const fd = { title: fTitle, description: fDesc, titleFr: fTitleFr, descriptionFr: fDescFr }
    if (!isValidPair(fd)) return
    setSaving(true); setError(null)

    const payload: Record<string, unknown> = {
      title: fTitle.trim() || null,
      description: fDesc.trim() || null,
      titleFr: fTitleFr.trim() || null,
      descriptionFr: fDescFr.trim() || null,
      date: fDate,
      time: fTime.trim() || null,
      location: fLocation.trim() || null,
      color: fColor,
      capacity: fCapacity.trim() ? parseInt(fCapacity, 10) : null,
    }

    try {
      const url = editingId ? `/api/admin/events/${editingId}` : '/api/admin/events'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) { resetForm(); fetchEvents() }
      else { const d = await res.json(); setError(d.error || 'Failed to save event') }
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  const deleteEvent = async (id: string) => {
    setDeleting(true); setError(null)
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
      if (res.ok) { setDeleteConfirm(null); if (rosterFor === id) setRosterFor(null); fetchEvents() }
      else { const d = await res.json(); setError(d.error || 'Failed to delete event') }
    } catch { setError('Network error') }
    finally { setDeleting(false) }
  }

  const toggleRoster = async (id: string) => {
    if (rosterFor === id) { setRosterFor(null); setRoster(null); return }
    setRosterFor(id); setRoster(null); setRosterLoading(true)
    try {
      const res = await fetch(`/api/events/${id}`)
      const data = await res.json()
      if (res.ok) setRoster(data.event.roster)
    } catch { setError('Failed to load roster') }
    finally { setRosterLoading(false) }
  }

  const fd = { title: fTitle, description: fDesc, titleFr: fTitleFr, descriptionFr: fDescFr }
  const valid = isValidPair(fd)

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
        <svg width="40" height="40" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
          <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
          <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
        </svg>
        <p>Loading events...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left">
          <h1>Events</h1>
          <p>Manage community events and RSVPs</p>
        </div>
        <div className="topbar-actions">
          <button onClick={() => { resetForm(); setShowForm(true) }}
            style={{ padding: '8px 20px', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
            + New Event
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FFF0F0', border: '1px solid #E8AAAA', borderRadius: '10px', padding: '12px 18px', marginBottom: '20px', fontSize: '0.82rem', color: '#8B2020', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B2020', fontWeight: 700, fontSize: '1rem' }}>&times;</button>
        </div>
      )}

      {showForm && (
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)', marginBottom: '16px' }}>
            {editingId ? 'Edit Event' : 'New Event'}
          </h3>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Date</label>
              <input type="date" value={fDate} onChange={e => setFDate(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Time</label>
              <input type="text" value={fTime} onChange={e => setFTime(e.target.value)} placeholder="3PM – 6PM"
                style={{ padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', width: '140px' }} />
            </div>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Location</label>
              <input type="text" value={fLocation} onChange={e => setFLocation(e.target.value)} placeholder="Dallas Community Center"
                style={{ padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', width: '100%', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Color</label>
              <select value={fColor} onChange={e => setFColor(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem' }}>
                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Capacity (optional)</label>
              <input type="number" min="1" step="1" value={fCapacity} onChange={e => setFCapacity(e.target.value)} placeholder="No limit"
                style={{ padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', width: '120px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Title (English)</label>
              <input type="text" value={fTitle} onChange={e => setFTitle(e.target.value)} placeholder="Event title in English"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', boxSizing: 'border-box' }} />
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px', marginTop: '12px' }}>Description (English)</label>
              <textarea value={fDesc} onChange={e => setFDesc(e.target.value)} placeholder="Event description in English..." rows={5}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Titre (Français)</label>
              <input type="text" value={fTitleFr} onChange={e => setFTitleFr(e.target.value)} placeholder="Titre de l'événement en français"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', boxSizing: 'border-box' }} />
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px', marginTop: '12px' }}>Description (Français)</label>
              <textarea value={fDescFr} onChange={e => setFDescFr(e.target.value)} placeholder="Description de l'événement en français..." rows={5}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', marginBottom: '16px', background: valid ? '#D4EDDA' : '#FFF3CD', color: valid ? '#155724' : '#856404' }}>
            {valid ? 'At least one complete language pair filled.' : 'Fill at least one complete language pair (title + description). The other is optional — members will see what\'s available.'}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={saveEvent} disabled={saving || !valid || !fDate}
              style={{ padding: '8px 24px', background: valid ? 'var(--gold)' : '#ccc', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: valid ? 'pointer' : 'default' }}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button onClick={resetForm}
              style={{ padding: '8px 24px', background: '#eee', color: '#555', border: 'none', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', overflow: 'hidden' }}>
        {events.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)' }}>
            No events yet. Click &ldquo;+ New Event&rdquo; to create one.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Lang</th>
                  <th>Capacity</th>
                  <th>RSVPs</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(e => {
                  const lang = langIndicator(e)
                  const s = LANG_BADGE[lang]
                  const past = new Date(e.date) < new Date(new Date().setHours(0, 0, 0, 0))
                  return (
                    <Fragment key={e.id}>
                      <tr style={past ? { opacity: 0.6 } : undefined}>
                        <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{new Date(e.date).toLocaleDateString()}</td>
                        <td style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayTitle(e)}</td>
                        <td><span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>{lang}</span></td>
                        <td style={{ fontSize: '0.82rem' }}>
                          {e.capacity === null ? <span style={{ color: 'var(--muted)' }}>—</span> : (
                            <span style={{ color: e.capacityFull ? '#8B2020' : 'var(--night)', fontWeight: e.capacityFull ? 700 : 400 }}>
                              {e.counts.going} / {e.capacity}{e.capacityFull ? ' (full)' : ''}
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                          {e.counts.going} going / {e.counts.maybe} maybe / {e.counts.notGoing} declined
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {deleteConfirm === e.id ? (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.72rem', color: '#8B2020' }}>Delete?</span>
                              <button onClick={() => deleteEvent(e.id)} disabled={deleting} style={{ padding: '3px 10px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>{deleting ? '...' : 'Yes'}</button>
                              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '3px 10px', background: '#eee', color: '#555', border: 'none', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}>No</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button onClick={() => toggleRoster(e.id)} style={{ padding: '3px 10px', background: '#EEF2FF', color: '#3730A3', border: '1px solid #C7D2FE', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}>{rosterFor === e.id ? 'Hide' : 'Roster'}</button>
                              <button onClick={() => startEdit(e)} style={{ padding: '3px 10px', background: 'var(--gold-dim)', color: 'var(--night)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}>Edit</button>
                              <button onClick={() => setDeleteConfirm(e.id)} style={{ padding: '3px 10px', background: '#FFF0F0', color: '#8B2020', border: '1px solid #E8AAAA', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}>Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                      {rosterFor === e.id && (
                        <tr>
                          <td colSpan={6} style={{ background: '#FAFAFA', padding: '16px 20px' }}>
                            {rosterLoading || !roster ? (
                              <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Loading roster...</div>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                {([['Going', roster.going], ['Maybe', roster.maybe], ['Not Going', roster.notGoing]] as const).map(([label, list]) => (
                                  <div key={label}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--night)', marginBottom: '6px' }}>{label} ({list.length})</div>
                                    {list.length === 0 ? (
                                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>—</div>
                                    ) : (
                                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: 'var(--night)' }}>
                                        {list.map((p, i) => <li key={i}>{p.name}</li>)}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
