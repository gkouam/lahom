'use client'

import { useCallback, useEffect, useState } from 'react'

interface CultureItem {
  id: string
  url: string
  tag: string
  tagFr: string | null
  title: string
  titleFr: string | null
  description: string
  descriptionFr: string | null
  published: boolean
  sortOrder: number
  createdAt: string
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', border: '1px solid var(--line)',
  borderRadius: '6px', fontSize: '0.82rem', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px',
}

interface Fields {
  tag: string; tagFr: string; title: string; titleFr: string; description: string; descriptionFr: string
}
const emptyFields: Fields = { tag: '', tagFr: '', title: '', titleFr: '', description: '', descriptionFr: '' }

function FieldGrid({ v, set }: { v: Fields; set: (f: Fields) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }} className="admin-below-table">
      <div>
        <label style={labelStyle}>Tag (English)</label>
        <input type="text" value={v.tag} onChange={e => set({ ...v, tag: e.target.value })} placeholder="Sacred Dance" style={inputStyle} />
        <label style={{ ...labelStyle, marginTop: '10px' }}>Title (English)</label>
        <input type="text" value={v.title} onChange={e => set({ ...v, title: e.target.value })} placeholder="Elephant Mask Society" style={inputStyle} />
        <label style={{ ...labelStyle, marginTop: '10px' }}>Description (English)</label>
        <textarea value={v.description} onChange={e => set({ ...v, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div>
        <label style={labelStyle}>Tag (Français, optional)</label>
        <input type="text" value={v.tagFr} onChange={e => set({ ...v, tagFr: e.target.value })} placeholder="Danse Sacrée" style={inputStyle} />
        <label style={{ ...labelStyle, marginTop: '10px' }}>Titre (Français, optional)</label>
        <input type="text" value={v.titleFr} onChange={e => set({ ...v, titleFr: e.target.value })} placeholder="Société du Masque Éléphant" style={inputStyle} />
        <label style={{ ...labelStyle, marginTop: '10px' }}>Description (Français, optional)</label>
        <textarea value={v.descriptionFr} onChange={e => set({ ...v, descriptionFr: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
    </div>
  )
}

export default function CultureAdminPage() {
  const [items, setItems] = useState<CultureItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showUpload, setShowUpload] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uFields, setUFields] = useState<Fields>(emptyFields)
  const [uploading, setUploading] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [eFields, setEFields] = useState<Fields>(emptyFields)
  const [saving, setSaving] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/culture')
      const data = await res.json()
      if (res.ok) setItems(data.items)
    } catch { setError('Failed to load culture items') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const uploadValid = file && uFields.tag.trim() && uFields.title.trim() && uFields.description.trim()

  const upload = async () => {
    if (!uploadValid) return
    setUploading(true); setError(null)
    try {
      const form = new FormData()
      form.append('file', file!)
      for (const [k, v] of Object.entries(uFields)) form.append(k, v)
      const res = await fetch('/api/admin/culture', { method: 'POST', body: form })
      if (res.ok) {
        setShowUpload(false); setFile(null); setUFields(emptyFields)
        fetchItems()
      } else {
        const d = await res.json()
        setError(d.error || 'Upload failed')
      }
    } catch { setError('Network error') }
    finally { setUploading(false) }
  }

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusy(true); setError(null)
    try {
      const res = await fetch(`/api/admin/culture/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Update failed')
      }
      await fetchItems()
    } catch { setError('Network error') }
    finally { setBusy(false) }
  }

  const startEdit = (item: CultureItem) => {
    setEditingId(item.id)
    setEFields({
      tag: item.tag, tagFr: item.tagFr || '',
      title: item.title, titleFr: item.titleFr || '',
      description: item.description, descriptionFr: item.descriptionFr || '',
    })
    setDeleteConfirm(null)
  }

  const saveEdit = async () => {
    if (!editingId || !eFields.tag.trim() || !eFields.title.trim() || !eFields.description.trim()) return
    setSaving(true)
    await patch(editingId, {
      tag: eFields.tag.trim(),
      tagFr: eFields.tagFr.trim() || null,
      title: eFields.title.trim(),
      titleFr: eFields.titleFr.trim() || null,
      description: eFields.description.trim(),
      descriptionFr: eFields.descriptionFr.trim() || null,
    })
    setSaving(false); setEditingId(null)
  }

  const move = async (idx: number, dir: -1 | 1) => {
    const a = items[idx]
    const b = items[idx + dir]
    if (!a || !b) return
    setBusy(true)
    await patch(a.id, { sortOrder: b.sortOrder })
    await patch(b.id, { sortOrder: a.sortOrder })
    setBusy(false)
  }

  const remove = async (id: string) => {
    setBusy(true); setError(null)
    try {
      const res = await fetch(`/api/admin/culture/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Delete failed')
      }
      setDeleteConfirm(null)
      await fetchItems()
    } catch { setError('Network error') }
    finally { setBusy(false) }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}><p>Loading culture items...</p></div>
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left">
          <h1>Culture</h1>
          <p>Manage the landing-page culture showcase cards</p>
        </div>
        <div className="topbar-actions">
          <button
            className="topbar-wide-btn"
            onClick={() => setShowUpload(v => !v)}
            style={{ minHeight: '44px', padding: '0 20px', background: 'var(--gold)', color: 'var(--night)', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            + Add Culture Card
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FFF0F0', border: '1px solid #E8AAAA', borderRadius: '10px', padding: '12px 18px', marginBottom: '20px', fontSize: '0.82rem', color: '#8B2020', display: 'flex', justifyContent: 'space-between' }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B2020', fontWeight: 700 }}>&times;</button>
        </div>
      )}

      {showUpload && (
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)', marginBottom: '16px' }}>New Culture Card</h3>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Image (JPEG/PNG/WebP, max 8 MB)</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} style={{ fontSize: '0.82rem' }} />
          </div>
          <FieldGrid v={uFields} set={setUFields} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={upload} disabled={uploading || !uploadValid}
              style={{ minHeight: '44px', padding: '0 24px', background: uploadValid ? 'var(--gold)' : '#ccc', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
              {uploading ? 'Uploading…' : 'Add Card'}
            </button>
            <button onClick={() => setShowUpload(false)} style={{ minHeight: '44px', padding: '0 20px', background: '#eee', color: '#555', border: 'none', borderRadius: '10px', fontSize: '0.82rem', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="admin-empty" style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)' }}>
          <p>No culture cards yet. Add one to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {items.map((item, idx) => (
            <div key={item.id} style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', overflow: 'hidden', opacity: item.published ? 1 : 0.6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.title} style={{ width: '100%', height: '170px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '12px 14px' }}>
                {editingId === item.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <FieldGrid v={eFields} set={setEFields} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={saveEdit} disabled={saving} style={{ flex: 1, minHeight: '36px', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>{saving ? '…' : 'Save'}</button>
                      <button onClick={() => setEditingId(null)} style={{ flex: 1, minHeight: '36px', background: '#eee', color: '#555', border: 'none', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--night)' }}>{item.title}</strong>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '100px', background: item.published ? 'rgba(45,106,79,0.14)' : 'rgba(109,92,74,0.15)', color: item.published ? 'var(--forest-mid)' : 'var(--muted)' }}>
                        {item.published ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '4px 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.tag} · {item.description}
                    </p>
                    {deleteConfirm === item.id ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#8B2020' }}>Delete?</span>
                        <button onClick={() => remove(item.id)} disabled={busy} style={{ padding: '4px 12px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} style={{ padding: '4px 12px', background: '#eee', color: '#555', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>No</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button onClick={() => patch(item.id, { published: !item.published })} disabled={busy} style={{ padding: '4px 10px', background: 'var(--gold-dim)', color: 'var(--night)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                          {item.published ? 'Hide' : 'Publish'}
                        </button>
                        <button onClick={() => startEdit(item)} style={{ padding: '4px 10px', background: 'var(--gold-dim)', color: 'var(--night)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => move(idx, -1)} disabled={busy || idx === 0} style={{ padding: '4px 10px', background: 'white', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>↑</button>
                        <button onClick={() => move(idx, 1)} disabled={busy || idx === items.length - 1} style={{ padding: '4px 10px', background: 'white', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', opacity: idx === items.length - 1 ? 0.4 : 1 }}>↓</button>
                        <button onClick={() => setDeleteConfirm(item.id)} style={{ padding: '4px 10px', background: '#FFF0F0', color: '#8B2020', border: '1px solid #E8AAAA', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
