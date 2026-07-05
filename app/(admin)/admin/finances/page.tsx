'use client'

import { useEffect, useState, useCallback } from 'react'

interface MemberFinance {
  id: string
  name: string | null
  email: string
  standing: string
  totalContributed: string
  notes: string | null
  lastUpdated: string | null
}

interface Contribution {
  id: string
  amount: string
  date: string
  method: string | null
  description: string | null
  createdAt: string
}

const STANDING_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  GOOD_STANDING: { bg: '#D4EDDA', color: '#155724', label: 'Good Standing' },
  BEHIND: { bg: '#FFF3CD', color: 'var(--gold-ink)', label: 'Behind' },
  NEW: { bg: '#E8E8E8', color: '#555', label: 'New' },
  EXEMPT: { bg: '#D1ECF1', color: '#0C5460', label: 'Exempt' },
}

export default function FinancesPage() {
  const [members, setMembers] = useState<MemberFinance[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<MemberFinance | null>(null)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [contribLoading, setContribLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Standing edit state
  const [editStanding, setEditStanding] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [standingSaving, setStandingSaving] = useState(false)

  // New contribution form
  const [newAmount, setNewAmount] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [newMethod, setNewMethod] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [addingSaving, setAddingSaving] = useState(false)

  // Edit contribution state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editMethod, setEditMethod] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/finances')
      const data = await res.json()
      if (res.ok) setMembers(data.users)
    } catch { setError('Failed to load members') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const fetchContributions = useCallback(async (userId: string) => {
    setContribLoading(true)
    try {
      const res = await fetch(`/api/admin/finances/contributions?userId=${userId}`)
      const data = await res.json()
      if (res.ok) setContributions(data.contributions)
    } catch { setError('Failed to load contributions') }
    finally { setContribLoading(false) }
  }, [])

  const selectMember = (m: MemberFinance) => {
    setSelected(m)
    setEditStanding(m.standing)
    setEditNotes(m.notes || '')
    setEditingId(null)
    setDeleteConfirm(null)
    fetchContributions(m.id)
  }

  const saveStanding = async () => {
    if (!selected) return
    setStandingSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/finances', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selected.id, standing: editStanding, notes: editNotes || null }),
      })
      if (res.ok) {
        setMembers(prev => prev.map(m => m.id === selected.id ? { ...m, standing: editStanding, notes: editNotes || null } : m))
        setSelected(prev => prev ? { ...prev, standing: editStanding, notes: editNotes || null } : null)
      } else {
        const d = await res.json()
        setError(d.error || 'Failed to update standing')
      }
    } catch { setError('Network error') }
    finally { setStandingSaving(false) }
  }

  const addContribution = async () => {
    if (!selected || !newAmount || !newDate) return
    setAddingSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/finances/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selected.id,
          amount: newAmount,
          date: newDate,
          method: newMethod || undefined,
          description: newDesc || undefined,
        }),
      })
      if (res.ok) {
        setNewAmount('')
        setNewMethod('')
        setNewDesc('')
        fetchContributions(selected.id)
        fetchMembers()
      } else {
        const d = await res.json()
        setError(d.error || 'Failed to record contribution')
      }
    } catch { setError('Network error') }
    finally { setAddingSaving(false) }
  }

  const startEdit = (c: Contribution) => {
    setEditingId(c.id)
    setEditAmount(c.amount)
    setEditDate(c.date.split('T')[0])
    setEditMethod(c.method || '')
    setEditDesc(c.description || '')
    setDeleteConfirm(null)
  }

  const saveEdit = async () => {
    if (!editingId || !selected) return
    setEditSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/finances/contributions/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: editAmount,
          date: editDate,
          method: editMethod || null,
          description: editDesc || null,
        }),
      })
      if (res.ok) {
        setEditingId(null)
        fetchContributions(selected.id)
        fetchMembers()
      } else {
        const d = await res.json()
        setError(d.error || 'Failed to edit contribution')
      }
    } catch { setError('Network error') }
    finally { setEditSaving(false) }
  }

  const deleteContribution = async (id: string) => {
    if (!selected) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/finances/contributions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteConfirm(null)
        fetchContributions(selected.id)
        fetchMembers()
      } else {
        const d = await res.json()
        setError(d.error || 'Failed to delete contribution')
      }
    } catch { setError('Network error') }
    finally { setDeleting(false) }
  }

  const standingBadge = (standing: string) => {
    const s = STANDING_STYLES[standing] || STANDING_STYLES.NEW
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
        {s.label}
      </span>
    )
  }

  const getInitial = (name: string | null, email: string) => (name || email).charAt(0).toUpperCase()

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
        <svg width="40" height="40" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
          <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
          <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
        </svg>
        <p>Loading finances...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left">
          <h1>Finances</h1>
          <p>Manage member contributions and financial standing</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FFF0F0', border: '1px solid #E8AAAA', borderRadius: '10px', padding: '12px 18px', marginBottom: '20px', fontSize: '0.82rem', color: '#8B2020', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B2020', fontWeight: 700, fontSize: '1rem' }}>&times;</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.5fr' : '1fr', gap: '20px' }} className="admin-below-table">
        {/* Members List */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)' }}>Members</h3>
          </div>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {members.map(m => (
              <div
                key={m.id}
                onClick={() => selectMember(m)}
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--line)',
                  cursor: 'pointer',
                  background: selected?.id === m.id ? 'var(--gold-dim, #FFF8E1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background 0.15s',
                }}
              >
                <div className="member-avatar gold-bg" style={{ width: '36px', height: '36px', fontSize: '0.82rem' }}>
                  {getInitial(m.name, m.email)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--night)' }}>{m.name || '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {standingBadge(m.standing)}
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--night)', marginTop: '4px' }}>${m.totalContributed}</div>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)' }}>No approved members found.</div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Standing & Notes */}
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)', marginBottom: '16px' }}>
                {selected.name || selected.email} — Financial Status
              </h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Standing</label>
                  <select
                    value={editStanding}
                    onChange={e => setEditStanding(e.target.value)}
                    style={{ padding: '6px 10px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem' }}
                  >
                    <option value="NEW">New</option>
                    <option value="GOOD_STANDING">Good Standing</option>
                    <option value="BEHIND">Behind</option>
                    <option value="EXEMPT">Exempt</option>
                  </select>
                </div>
                <button
                  onClick={saveStanding}
                  disabled={standingSaving}
                  style={{ padding: '6px 16px', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {standingSaving ? '...' : 'Save'}
                </button>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Treasurer Notes (private)</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', resize: 'vertical' }}
                  placeholder="Internal notes about this member's finances..."
                />
              </div>
            </div>

            {/* Record Contribution */}
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)', marginBottom: '16px' }}>Record Contribution</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Amount ($)</label>
                  <input type="number" step="0.01" min="0.01" value={newAmount} onChange={e => setNewAmount(e.target.value)}
                    style={{ padding: '6px 10px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', width: '100px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Date</label>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                    style={{ padding: '6px 10px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Method</label>
                  <input type="text" value={newMethod} onChange={e => setNewMethod(e.target.value)} placeholder="Cash, Zelle..."
                    style={{ padding: '6px 10px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', width: '120px' }} />
                </div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>Description</label>
                  <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Q2 2026 dues"
                    style={{ padding: '6px 10px', border: '1px solid var(--line)', borderRadius: '6px', fontSize: '0.82rem', width: '100%' }} />
                </div>
                <button onClick={addContribution} disabled={addingSaving || !newAmount}
                  style={{ padding: '6px 20px', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {addingSaving ? '...' : 'Add'}
                </button>
              </div>
            </div>

            {/* Contribution Ledger */}
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line)' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)' }}>Contribution Ledger</h3>
              </div>
              {contribLoading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
              ) : contributions.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }}>No contributions recorded yet.</div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table" style={{ marginBottom: 0 }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Description</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributions.map(c => (
                        editingId === c.id ? (
                          <tr key={c.id} style={{ background: 'var(--gold-dim, #FFF8E1)' }}>
                            <td><input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} style={{ padding: '4px 6px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '0.78rem' }} /></td>
                            <td><input type="number" step="0.01" value={editAmount} onChange={e => setEditAmount(e.target.value)} style={{ padding: '4px 6px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '0.78rem', width: '80px' }} /></td>
                            <td><input type="text" value={editMethod} onChange={e => setEditMethod(e.target.value)} style={{ padding: '4px 6px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '0.78rem', width: '80px' }} /></td>
                            <td><input type="text" value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ padding: '4px 6px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '0.78rem', width: '120px' }} /></td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button onClick={saveEdit} disabled={editSaving} style={{ padding: '3px 10px', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{editSaving ? '...' : 'Save'}</button>
                                <button onClick={() => setEditingId(null)} style={{ padding: '3px 10px', background: '#eee', color: '#555', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={c.id}>
                            <td style={{ fontSize: '0.82rem' }}>{new Date(c.date).toLocaleDateString()}</td>
                            <td style={{ fontWeight: 700, fontSize: '0.82rem' }}>${c.amount}</td>
                            <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{c.method || '—'}</td>
                            <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{c.description || '—'}</td>
                            <td style={{ textAlign: 'right' }}>
                              {deleteConfirm === c.id ? (
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.75rem', color: '#8B2020' }}>Delete?</span>
                                  <button onClick={() => deleteContribution(c.id)} disabled={deleting} style={{ padding: '3px 10px', background: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{deleting ? '...' : 'Yes'}</button>
                                  <button onClick={() => setDeleteConfirm(null)} style={{ padding: '3px 10px', background: '#eee', color: '#555', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>No</button>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                  <button onClick={() => startEdit(c)} style={{ padding: '3px 10px', background: 'var(--gold-dim)', color: 'var(--night)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
                                  <button onClick={() => setDeleteConfirm(c.id)} style={{ padding: '3px 10px', background: '#FFF0F0', color: '#8B2020', border: '1px solid #E8AAAA', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
