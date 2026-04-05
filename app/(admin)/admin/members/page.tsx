'use client'

import { useEffect, useState } from 'react'

interface Member {
  id: string
  name: string | null
  email: string
  phone: string | null
  hometown: string | null
  role: string
  accountStatus: string
  emailVerified: string | null
  createdAt: string
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/members')
      const data = await res.json()
      if (res.ok) setMembers(data.users)
    } catch {
      console.error('Failed to fetch members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])

  const handleAction = async (userId: string, action: 'approve' | 'reject') => {
    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      if (res.ok) {
        const data = await res.json()
        setMembers(prev => prev.map(m => m.id === userId ? { ...m, accountStatus: data.user.accountStatus } : m))
      }
    } catch {
      console.error('Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = filter === 'all' ? members : members.filter(m => m.accountStatus === filter)
  const pendingCount = members.filter(m => m.accountStatus === 'PENDING_APPROVAL').length

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      PENDING_APPROVAL: { bg: '#FFF3CD', color: '#856404' },
      APPROVED: { bg: '#D4EDDA', color: '#155724' },
      REJECTED: { bg: '#F8D7DA', color: '#721C24' },
    }
    const s = styles[status] || styles.PENDING_APPROVAL
    return (
      <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
        {status === 'PENDING_APPROVAL' ? 'Pending' : status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    )
  }

  if (loading) {
    return <div className="text-center p-12" style={{ color: 'var(--muted)' }}>Loading members...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--night)' }}>
            Members
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {members.length} total &middot; {pendingCount} pending approval
          </p>
        </div>
        <div className="flex gap-1">
          {(['all', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-md text-xs font-medium"
              style={{
                background: filter === f ? 'var(--gold-dim)' : 'transparent',
                color: filter === f ? 'var(--night)' : 'var(--muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {f === 'all' ? 'All' : f === 'PENDING_APPROVAL' ? `Pending (${pendingCount})` : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid var(--line)' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', background: '#FAFAF8' }}>
              <th className="text-left p-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>Name</th>
              <th className="text-left p-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>Email</th>
              <th className="text-left p-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>Phone</th>
              <th className="text-left p-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>Status</th>
              <th className="text-left p-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>Joined</th>
              <th className="text-right p-3 text-xs font-semibold" style={{ color: 'var(--muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td className="p-3 text-sm font-medium" style={{ color: 'var(--night)' }}>
                  {member.name || '—'}
                  {member.hometown && <span className="block text-xs" style={{ color: 'var(--muted)' }}>{member.hometown}</span>}
                </td>
                <td className="p-3 text-sm" style={{ color: 'var(--muted)' }}>
                  {member.email}
                  {!member.emailVerified && <span className="block text-xs" style={{ color: '#B71C1C' }}>Not verified</span>}
                </td>
                <td className="p-3 text-sm" style={{ color: 'var(--muted)' }}>{member.phone || '—'}</td>
                <td className="p-3">{statusBadge(member.accountStatus)}</td>
                <td className="p-3 text-sm" style={{ color: 'var(--muted)' }}>
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-right">
                  {member.accountStatus === 'PENDING_APPROVAL' && (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleAction(member.id, 'approve')}
                        disabled={actionLoading === member.id}
                        className="px-3 py-1 rounded-md text-xs font-semibold"
                        style={{ background: '#D4EDDA', color: '#155724', border: 'none', cursor: 'pointer' }}
                      >
                        {actionLoading === member.id ? '...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleAction(member.id, 'reject')}
                        disabled={actionLoading === member.id}
                        className="px-3 py-1 rounded-md text-xs font-semibold"
                        style={{ background: '#F8D7DA', color: '#721C24', border: 'none', cursor: 'pointer' }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {member.accountStatus === 'REJECTED' && (
                    <button
                      onClick={() => handleAction(member.id, 'approve')}
                      disabled={actionLoading === member.id}
                      className="px-3 py-1 rounded-md text-xs font-semibold"
                      style={{ background: '#D4EDDA', color: '#155724', border: 'none', cursor: 'pointer' }}
                    >
                      {actionLoading === member.id ? '...' : 'Approve'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
