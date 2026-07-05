'use client'

import { useCallback, useEffect, useState } from 'react'

interface GalleryImage {
  id: string
  url: string
  label: string
  labelFr: string | null
  caption: string
  captionFr: string | null
  span: 'tall' | 'wide' | null
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

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Upload form
  const [showUpload, setShowUpload] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uLabel, setULabel] = useState('')
  const [uLabelFr, setULabelFr] = useState('')
  const [uCaption, setUCaption] = useState('')
  const [uCaptionFr, setUCaptionFr] = useState('')
  const [uSpan, setUSpan] = useState('')
  const [uploading, setUploading] = useState(false)

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [eLabel, setELabel] = useState('')
  const [eLabelFr, setELabelFr] = useState('')
  const [eCaption, setECaption] = useState('')
  const [eCaptionFr, setECaptionFr] = useState('')
  const [eSpan, setESpan] = useState('')
  const [saving, setSaving] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/gallery')
      const data = await res.json()
      if (res.ok) setImages(data.images)
    } catch { setError('Failed to load gallery') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchImages() }, [fetchImages])

  const upload = async () => {
    if (!file || !uLabel.trim() || !uCaption.trim()) return
    setUploading(true); setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('label', uLabel)
      form.append('labelFr', uLabelFr)
      form.append('caption', uCaption)
      form.append('captionFr', uCaptionFr)
      form.append('span', uSpan)
      const res = await fetch('/api/admin/gallery', { method: 'POST', body: form })
      if (res.ok) {
        setShowUpload(false); setFile(null)
        setULabel(''); setULabelFr(''); setUCaption(''); setUCaptionFr(''); setUSpan('')
        fetchImages()
      } else {
        const d = await res.json()
        setError(d.error || 'Upload failed')
      }
    } catch { setError('Network error') }
    finally { setUploading(false) }
  }

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id)
    setELabel(img.label); setELabelFr(img.labelFr || '')
    setECaption(img.caption); setECaptionFr(img.captionFr || '')
    setESpan(img.span || '')
    setDeleteConfirm(null)
  }

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusy(true); setError(null)
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Update failed')
      }
      await fetchImages()
    } catch { setError('Network error') }
    finally { setBusy(false) }
  }

  const saveEdit = async () => {
    if (!editingId || !eLabel.trim() || !eCaption.trim()) return
    setSaving(true)
    await patch(editingId, {
      label: eLabel.trim(),
      labelFr: eLabelFr.trim() || null,
      caption: eCaption.trim(),
      captionFr: eCaptionFr.trim() || null,
      span: eSpan === 'tall' || eSpan === 'wide' ? eSpan : null,
    })
    setSaving(false); setEditingId(null)
  }

  const move = async (idx: number, dir: -1 | 1) => {
    const a = images[idx]
    const b = images[idx + dir]
    if (!a || !b) return
    setBusy(true)
    await patch(a.id, { sortOrder: b.sortOrder })
    await patch(b.id, { sortOrder: a.sortOrder })
    setBusy(false)
  }

  const remove = async (id: string) => {
    setBusy(true); setError(null)
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Delete failed')
      }
      setDeleteConfirm(null)
      await fetchImages()
    } catch { setError('Network error') }
    finally { setBusy(false) }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
        <p>Loading gallery...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left">
          <h1>Gallery</h1>
          <p>Manage the public landing-page photo gallery</p>
        </div>
        <div className="topbar-actions">
          <button
            className="topbar-wide-btn"
            onClick={() => setShowUpload(v => !v)}
            style={{ minHeight: '44px', padding: '0 20px', background: 'var(--gold)', color: 'var(--night)', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            + Upload Photo
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
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)', marginBottom: '16px' }}>Upload Photo</h3>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Image (JPEG/PNG/WebP, max 8 MB)</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} style={{ fontSize: '0.82rem' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }} className="admin-below-table">
            <div>
              <label style={labelStyle}>Label (English)</label>
              <input type="text" value={uLabel} onChange={e => setULabel(e.target.value)} placeholder="Sacred Artifacts" style={inputStyle} />
              <label style={{ ...labelStyle, marginTop: '10px' }}>Caption (English)</label>
              <input type="text" value={uCaption} onChange={e => setUCaption(e.target.value)} placeholder="Inside the Royal Museum..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Libellé (Français, optional)</label>
              <input type="text" value={uLabelFr} onChange={e => setULabelFr(e.target.value)} placeholder="Objets Sacrés" style={inputStyle} />
              <label style={{ ...labelStyle, marginTop: '10px' }}>Légende (Français, optional)</label>
              <input type="text" value={uCaptionFr} onChange={e => setUCaptionFr(e.target.value)} placeholder="À l'intérieur du Musée Royal..." style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={labelStyle}>Tile size</label>
              <select value={uSpan} onChange={e => setUSpan(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                <option value="">Normal</option>
                <option value="tall">Tall</option>
                <option value="wide">Wide</option>
              </select>
            </div>
            <button onClick={upload} disabled={uploading || !file || !uLabel.trim() || !uCaption.trim()}
              style={{ minHeight: '44px', padding: '0 24px', background: file && uLabel.trim() && uCaption.trim() ? 'var(--gold)' : '#ccc', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
            <button onClick={() => setShowUpload(false)} style={{ minHeight: '44px', padding: '0 20px', background: '#eee', color: '#555', border: 'none', borderRadius: '10px', fontSize: '0.82rem', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="admin-empty" style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)' }}>
          <p>No gallery photos yet. Upload one to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {images.map((img, idx) => (
            <div key={img.id} style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', overflow: 'hidden', opacity: img.published ? 1 : 0.6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.label} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '12px 14px' }}>
                {editingId === img.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" value={eLabel} onChange={e => setELabel(e.target.value)} placeholder="Label (EN)" style={inputStyle} />
                    <input type="text" value={eLabelFr} onChange={e => setELabelFr(e.target.value)} placeholder="Libellé (FR)" style={inputStyle} />
                    <input type="text" value={eCaption} onChange={e => setECaption(e.target.value)} placeholder="Caption (EN)" style={inputStyle} />
                    <input type="text" value={eCaptionFr} onChange={e => setECaptionFr(e.target.value)} placeholder="Légende (FR)" style={inputStyle} />
                    <select value={eSpan} onChange={e => setESpan(e.target.value)} style={inputStyle}>
                      <option value="">Normal</option>
                      <option value="tall">Tall</option>
                      <option value="wide">Wide</option>
                    </select>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={saveEdit} disabled={saving} style={{ flex: 1, minHeight: '36px', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>{saving ? '…' : 'Save'}</button>
                      <button onClick={() => setEditingId(null)} style={{ flex: 1, minHeight: '36px', background: '#eee', color: '#555', border: 'none', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--night)' }}>{img.label}</strong>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '100px', background: img.published ? 'rgba(45,106,79,0.14)' : 'rgba(109,92,74,0.15)', color: img.published ? 'var(--forest-mid)' : 'var(--muted)' }}>
                        {img.published ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '4px 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {img.caption}{img.span ? ` · ${img.span}` : ''}
                    </p>
                    {deleteConfirm === img.id ? (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#8B2020' }}>Delete?</span>
                        <button onClick={() => remove(img.id)} disabled={busy} style={{ padding: '4px 12px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} style={{ padding: '4px 12px', background: '#eee', color: '#555', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>No</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button onClick={() => patch(img.id, { published: !img.published })} disabled={busy} style={{ padding: '4px 10px', background: 'var(--gold-dim)', color: 'var(--night)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                          {img.published ? 'Hide' : 'Publish'}
                        </button>
                        <button onClick={() => startEdit(img)} style={{ padding: '4px 10px', background: 'var(--gold-dim)', color: 'var(--night)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => move(idx, -1)} disabled={busy || idx === 0} style={{ padding: '4px 10px', background: 'white', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>↑</button>
                        <button onClick={() => move(idx, 1)} disabled={busy || idx === images.length - 1} style={{ padding: '4px 10px', background: 'white', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', opacity: idx === images.length - 1 ? 0.4 : 1 }}>↓</button>
                        <button onClick={() => setDeleteConfirm(img.id)} style={{ padding: '4px 10px', background: '#FFF0F0', color: '#8B2020', border: '1px solid #E8AAAA', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
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
