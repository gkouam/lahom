'use client'

import { useEffect, useState, useCallback } from 'react'

interface MeetingNote {
  id: string
  title: string | null
  titleFr: string | null
  body: string | null
  bodyFr: string | null
  date: string
  createdAt: string
  updatedAt: string
  author: { id: string; name: string | null; email: string }
}

function langIndicator(note: MeetingNote) {
  const hasEn = !!(note.title && note.body)
  const hasFr = !!(note.titleFr && note.bodyFr)
  if (hasEn && hasFr) return 'EN+FR'
  if (hasFr) return 'FR'
  return 'EN'
}

function displayTitle(note: MeetingNote) {
  return note.title || note.titleFr || '—'
}

function isValidPair(data: { title: string; body: string; titleFr: string; bodyFr: string }) {
  const hasEn = !!(data.title.trim() && data.body.trim())
  const hasFr = !!(data.titleFr.trim() && data.bodyFr.trim())
  return hasEn || hasFr
}

function pairStatus(data: { title: string; body: string; titleFr: string; bodyFr: string }) {
  const hasEn = !!(data.title.trim() && data.body.trim())
  const hasFr = !!(data.titleFr.trim() && data.bodyFr.trim())
  const partialEn = !!(data.title.trim() || data.body.trim()) && !hasEn
  const partialFr = !!(data.titleFr.trim() || data.bodyFr.trim()) && !hasFr

  if (hasEn && hasFr) return 'Both languages complete.'
  if (hasEn) return partialFr ? 'English complete. French incomplete — fill both Title FR and Body FR, or clear both.' : 'English complete.'
  if (hasFr) return partialEn ? 'French complete. English incomplete — fill both Title EN and Body EN, or clear both.' : 'French complete.'
  if (partialEn || partialFr) return 'Incomplete — fill at least one complete language pair (title + body).'
  return 'Fill at least one language. The other is optional — members will see what\'s available.'
}

const LANG_BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  'EN': { bg: '#D1ECF1', color: '#0C5460' },
  'FR': { bg: '#FFF3CD', color: 'var(--gold-ink)' },
  'EN+FR': { bg: '#D4EDDA', color: '#155724' },
}

export default function MeetingsPage() {
  const [notes, setNotes] = useState<MeetingNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formBody, setFormBody] = useState('')
  const [formTitleFr, setFormTitleFr] = useState('')
  const [formBodyFr, setFormBodyFr] = useState('')
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/meetings')
      const data = await res.json()
      if (res.ok) setNotes(data.notes)
    } catch { setError('Failed to load meeting notes') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  const resetForm = () => {
    setFormTitle('')
    setFormBody('')
    setFormTitleFr('')
    setFormBodyFr('')
    setFormDate(new Date().toISOString().split('T')[0])
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (note: MeetingNote) => {
    setFormTitle(note.title || '')
    setFormBody(note.body || '')
    setFormTitleFr(note.titleFr || '')
    setFormBodyFr(note.bodyFr || '')
    setFormDate(note.date.split('T')[0])
    setEditingId(note.id)
    setShowForm(true)
    setDeleteConfirm(null)
  }

  const saveNote = async () => {
    const formData = { title: formTitle, body: formBody, titleFr: formTitleFr, bodyFr: formBodyFr }
    if (!isValidPair(formData)) return

    setSaving(true)
    setError(null)

    const payload = {
      title: formTitle.trim() || null,
      body: formBody.trim() || null,
      titleFr: formTitleFr.trim() || null,
      bodyFr: formBodyFr.trim() || null,
      date: formDate,
    }

    try {
      const url = editingId ? `/api/admin/meetings/${editingId}` : '/api/admin/meetings'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        resetForm()
        fetchNotes()
      } else {
        const d = await res.json()
        setError(d.error || 'Failed to save meeting note')
      }
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  const deleteNote = async (id: string) => {
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/meetings/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteConfirm(null)
        fetchNotes()
      } else {
        const d = await res.json()
        setError(d.error || 'Failed to delete meeting note')
      }
    } catch { setError('Network error') }
    finally { setDeleting(false) }
  }

  const formData = { title: formTitle, body: formBody, titleFr: formTitleFr, bodyFr: formBodyFr }
  const valid = isValidPair(formData)
  const status = pairStatus(formData)

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
        <svg width="40" height="40" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
          <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
          <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
        </svg>
        <p>Loading meeting notes...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left">
          <h1>Meeting Notes</h1>
          <p>Manage meeting notes and minutes</p>
        </div>
        <div className="topbar-actions">
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            style={{ padding: '8px 20px', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            + New Note
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FFF0F0', border: '1px solid #E8AAAA', borderRadius: '10px', padding: '12px 18px', marginBottom: '20px', fontSize: '0.82rem', color: '#8B2020', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B2020', fontWeight: 700, fontSize: '1rem' }}>&times;</button>
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)', marginBottom: '16px' }}>
            {editingId ? 'Edit Meeting Note' : 'New Meeting Note'}
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Date</label>
            <input
              type="date"
              value={formDate}
              onChange={e => setFormDate(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
            {/* English */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Title (English)</label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="Meeting title in English"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', boxSizing: 'border-box' }}
              />
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px', marginTop: '12px' }}>Body (English)</label>
              <textarea
                value={formBody}
                onChange={e => setFormBody(e.target.value)}
                placeholder="Meeting notes in English..."
                rows={8}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            {/* French */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Titre (Français)</label>
              <input
                type="text"
                value={formTitleFr}
                onChange={e => setFormTitleFr(e.target.value)}
                placeholder="Titre de la réunion en français"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', boxSizing: 'border-box' }}
              />
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px', marginTop: '12px' }}>Contenu (Français)</label>
              <textarea
                value={formBodyFr}
                onChange={e => setFormBodyFr(e.target.value)}
                placeholder="Compte rendu en français..."
                rows={8}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Validation Status */}
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            marginBottom: '16px',
            background: valid ? '#D4EDDA' : '#FFF3CD',
            color: valid ? '#155724' : 'var(--gold-ink)',
          }}>
            {status}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={saveNote}
              disabled={saving || !valid || !formDate}
              style={{
                padding: '8px 24px',
                background: valid ? 'var(--gold)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: valid ? 'pointer' : 'default',
              }}
            >
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button
              onClick={resetForm}
              style={{ padding: '8px 24px', background: '#eee', color: '#555', border: 'none', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes Table */}
      <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', overflow: 'hidden' }}>
        {notes.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)' }}>
            No meeting notes yet. Click &ldquo;+ New Note&rdquo; to create one.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Language</th>
                  <th>Author</th>
                  <th>Last Updated</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.map(note => (
                  <tr key={note.id}>
                    <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {new Date(note.date).toLocaleDateString()}
                    </td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayTitle(note)}
                    </td>
                    <td>
                      {(() => {
                        const lang = langIndicator(note)
                        const s = LANG_BADGE_STYLES[lang]
                        return (
                          <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {lang}
                          </span>
                        )
                      })()}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                      {note.author.name || note.author.email}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {deleteConfirm === note.id ? (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: '#8B2020' }}>Delete?</span>
                          <button onClick={() => deleteNote(note.id)} disabled={deleting} style={{ padding: '3px 10px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{deleting ? '...' : 'Yes'}</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '3px 10px', background: '#eee', color: '#555', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>No</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button onClick={() => startEdit(note)} style={{ padding: '3px 10px', background: 'var(--gold-dim)', color: 'var(--night)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => setDeleteConfirm(note.id)} style={{ padding: '3px 10px', background: '#FFF0F0', color: '#8B2020', border: '1px solid #E8AAAA', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
