'use client'

import { useEffect, useState, useCallback } from 'react'

interface UserWithPermissions {
  id: string
  name: string | null
  email: string
  role: string
  officerTitle: string | null
  accountStatus: string
  permissions: string[]
}

const ALL_PERMISSIONS = [
  'MANAGE_MEMBERS',
  'VIEW_MEMBERS',
  'MANAGE_FINANCES',
  'MANAGE_MEETINGS',
  'MANAGE_EVENTS',
  'MANAGE_PERMISSIONS',
] as const

const PERMISSION_LABELS: Record<string, string> = {
  MANAGE_MEMBERS: 'Manage Members',
  VIEW_MEMBERS: 'View Members',
  MANAGE_FINANCES: 'Finances',
  MANAGE_MEETINGS: 'Meetings',
  MANAGE_EVENTS: 'Events',
  MANAGE_PERMISSIONS: 'Permissions',
}

export default function PermissionsPage() {
  const [users, setUsers] = useState<UserWithPermissions[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [titleDrafts, setTitleDrafts] = useState<Record<string, string>>({})
  const [titleSaving, setTitleSaving] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/permissions')
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users)
        setError(null)
      }
    } catch {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const togglePermission = async (userId: string, permission: string, currentlyHeld: boolean) => {
    const key = `${userId}:${permission}`
    setActionLoading(key)
    setError(null)

    try {
      const res = await fetch('/api/admin/permissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: currentlyHeld ? 'revoke' : 'grant',
          permission,
        }),
      })

      if (res.ok) {
        setUsers(prev => prev.map(u => {
          if (u.id !== userId) return u
          const perms = currentlyHeld
            ? u.permissions.filter(p => p !== permission)
            : [...u.permissions, permission]
          return { ...u, permissions: perms }
        }))
      } else {
        const data = await res.json()
        setError(data.error || 'Action failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  const saveTitle = async (userId: string) => {
    const newTitle = titleDrafts[userId]
    if (newTitle === undefined) return

    setTitleSaving(userId)
    setError(null)

    try {
      const res = await fetch('/api/admin/permissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: 'set_title',
          officerTitle: newTitle || null,
        }),
      })

      if (res.ok) {
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, officerTitle: newTitle || null } : u
        ))
        setTitleDrafts(prev => {
          const next = { ...prev }
          delete next[userId]
          return next
        })
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to update title')
      }
    } catch {
      setError('Network error')
    } finally {
      setTitleSaving(null)
    }
  }

  const getInitial = (name: string | null, email: string) =>
    (name || email).charAt(0).toUpperCase()

  const filtered = users.filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
        <svg width="40" height="40" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
          <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
          <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
        </svg>
        <p>Loading permissions...</p>
      </div>
    )
  }

  return (
    <div>
      {/* TopBar */}
      <div className="topbar">
        <div className="topbar-left">
          <h1>Permissions</h1>
          <p>Manage officer roles and access control</p>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        background: 'var(--gold-dim, #FFF8E1)',
        border: '1px solid rgba(212,160,23,0.3)',
        borderRadius: '10px',
        padding: '12px 18px',
        marginBottom: '20px',
        fontSize: '0.82rem',
        color: 'var(--night)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold, #D4A017)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Permission changes may take up to 5 minutes to take effect, or members can sign out and back in.
      </div>

      {/* Error Toast */}
      {error && (
        <div style={{
          background: '#FFF0F0',
          border: '1px solid #E8AAAA',
          borderRadius: '10px',
          padding: '12px 18px',
          marginBottom: '20px',
          fontSize: '0.82rem',
          color: '#8B2020',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#8B2020',
            fontWeight: 700, fontSize: '1rem', lineHeight: 1, padding: '0 4px',
          }}>&times;</button>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div className="admin-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Permissions Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Officer Title</th>
              {ALL_PERMISSIONS.map(p => (
                <th key={p} style={{ textAlign: 'center', fontSize: '0.75rem', padding: '10px 6px' }}>
                  {PERMISSION_LABELS[p]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => {
              const isSuperAdmin = user.role === 'SUPER_ADMIN'
              const titleValue = titleDrafts[user.id] ?? user.officerTitle ?? ''
              const titleChanged = titleDrafts[user.id] !== undefined

              return (
                <tr key={user.id}>
                  <td>
                    <div className="member-cell">
                      <div className="member-avatar gold-bg">
                        {getInitial(user.name, user.email)}
                      </div>
                      <div>
                        <div className="member-name">{user.name || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{user.email}</div>
                        {isSuperAdmin && (
                          <span style={{
                            display: 'inline-block',
                            marginTop: '2px',
                            background: 'var(--gold-dim)',
                            color: 'var(--gold-dark, #8B6914)',
                            padding: '1px 8px',
                            borderRadius: '100px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}>Super Admin</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={titleValue}
                          onChange={e => setTitleDrafts(prev => ({ ...prev, [user.id]: e.target.value }))}
                          placeholder="e.g. Treasurer"
                          style={{
                            padding: '5px 10px',
                            border: '1px solid var(--line)',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            width: '130px',
                            background: 'white',
                          }}
                        />
                        {titleChanged && (
                          <button
                            onClick={() => saveTitle(user.id)}
                            disabled={titleSaving === user.id}
                            style={{
                              padding: '4px 10px',
                              background: 'var(--gold)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {titleSaving === user.id ? '...' : 'Save'}
                          </button>
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                        Display title only — does not grant permissions.
                      </span>
                    </div>
                  </td>
                  {ALL_PERMISSIONS.map(perm => {
                    const held = isSuperAdmin || user.permissions.includes(perm)
                    const loadingKey = `${user.id}:${perm}`
                    const isLoading = actionLoading === loadingKey

                    return (
                      <td key={perm} style={{ textAlign: 'center' }}>
                        <label style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isSuperAdmin ? 'not-allowed' : 'pointer',
                          opacity: isLoading ? 0.5 : 1,
                        }}>
                          <input
                            type="checkbox"
                            checked={held}
                            disabled={isSuperAdmin || isLoading}
                            onChange={() => togglePermission(user.id, perm, user.permissions.includes(perm))}
                            style={{
                              width: '16px',
                              height: '16px',
                              accentColor: 'var(--gold, #D4A017)',
                              cursor: isSuperAdmin ? 'not-allowed' : 'pointer',
                            }}
                          />
                        </label>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={2 + ALL_PERMISSIONS.length}>
                  <div className="admin-empty">
                    <p>No members found{search ? ` matching "${search}"` : ''}.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
