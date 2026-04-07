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
  const [search, setSearch] = useState('')
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

  const totalCount = members.length
  const pendingCount = members.filter(m => m.accountStatus === 'PENDING_APPROVAL').length
  const approvedCount = members.filter(m => m.accountStatus === 'APPROVED').length
  const rejectedCount = members.filter(m => m.accountStatus === 'REJECTED').length

  const filtered = members
    .filter(m => filter === 'all' || m.accountStatus === filter)
    .filter(m => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        (m.name?.toLowerCase().includes(q)) ||
        m.email.toLowerCase().includes(q)
      )
    })

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      PENDING_APPROVAL: { bg: '#FFF3CD', color: '#856404' },
      APPROVED: { bg: '#D4EDDA', color: '#155724' },
      REJECTED: { bg: '#F8D7DA', color: '#721C24' },
    }
    const s = styles[status] || styles.PENDING_APPROVAL
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 12px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em' }}>
        {status === 'PENDING_APPROVAL' ? 'Pending' : status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    )
  }

  const getInitial = (name: string | null, email: string) => {
    if (name) return name.charAt(0).toUpperCase()
    return email.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
        <svg width="40" height="40" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
          <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
          <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
        </svg>
        <p>Loading members...</p>
      </div>
    )
  }

  return (
    <div>
      {/* TopBar */}
      <div className="topbar">
        <div className="topbar-left">
          <h1>Members</h1>
          <p>Manage community membership and approvals</p>
        </div>
        <div className="topbar-actions">
          <button title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-dot" />
          </button>
          <button title="Settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="admin-stats-row">
        <div className="admin-stat-card gold" onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-inner">
            <div className="stat-icon-circle gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="stat-label">Total Members</div>
              <div className="stat-value">{totalCount}</div>
            </div>
          </div>
        </div>
        <div className="admin-stat-card amber" onClick={() => setFilter('PENDING_APPROVAL')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-inner">
            <div className="stat-icon-circle amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div className="stat-label">Pending</div>
              <div className="stat-value">{pendingCount}</div>
            </div>
          </div>
        </div>
        <div className="admin-stat-card green" onClick={() => setFilter('APPROVED')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-inner">
            <div className="stat-icon-circle green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <div className="stat-label">Approved</div>
              <div className="stat-value">{approvedCount}</div>
            </div>
          </div>
        </div>
        <div className="admin-stat-card red" onClick={() => setFilter('REJECTED')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-inner">
            <div className="stat-icon-circle red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <div className="stat-label">Rejected</div>
              <div className="stat-value">{rejectedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Actions Card */}
      <div className="pending-actions-card" style={{ marginBottom: '24px' }}>
        <h3>Pending Actions</h3>
        <ul>
          <li><span className="bullet" />{pendingCount} member{pendingCount !== 1 ? 's' : ''} awaiting approval</li>
          <li><span className="bullet" />Quarterly dues collection due this month</li>
          <li><span className="bullet" />Community event planning for next month</li>
          <li><span className="bullet" />Update member directory and contact info</li>
        </ul>
      </div>

      {/* Filters + Search */}
      <div className="admin-filter-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['all', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: filter === f ? 700 : 500,
                background: filter === f ? 'var(--gold-dim)' : 'transparent',
                color: filter === f ? 'var(--night)' : 'var(--muted)',
                border: filter === f ? '1px solid rgba(212,160,23,0.3)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f === 'all' ? 'All' : f === 'PENDING_APPROVAL' ? `Pending (${pendingCount})` : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="admin-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(member => (
              <tr key={member.id}>
                <td>
                  <div className="member-cell">
                    <div className="member-avatar gold-bg">
                      {getInitial(member.name, member.email)}
                    </div>
                    <div>
                      <div className="member-name">{member.name || '—'}</div>
                      {member.hometown && <div className="member-hometown">{member.hometown}</div>}
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--muted)' }}>
                  {member.email}
                  {!member.emailVerified && (
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--wine-bright)', fontWeight: 600 }}>
                      Not verified
                    </span>
                  )}
                </td>
                <td style={{ color: 'var(--muted)' }}>{member.phone || '—'}</td>
                <td>{statusBadge(member.accountStatus)}</td>
                <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {member.accountStatus === 'PENDING_APPROVAL' && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleAction(member.id, 'approve')}
                          disabled={actionLoading === member.id}
                        >
                          {actionLoading === member.id ? '...' : 'Approve'}
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleAction(member.id, 'reject')}
                          disabled={actionLoading === member.id}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {member.accountStatus === 'REJECTED' && (
                      <button
                        className="btn-approve"
                        onClick={() => handleAction(member.id, 'approve')}
                        disabled={actionLoading === member.id}
                      >
                        {actionLoading === member.id ? '...' : 'Approve'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="admin-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="17" y1="11" x2="23" y2="11" />
                    </svg>
                    <p>No members found{search ? ` matching "${search}"` : ''}.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Activity Log + Admin Tools */}
      <div className="admin-below-table" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginTop: '24px' }}>
        {/* Recent Activity Log */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)' }}>Recent Activity</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600 }}>View All</span>
          </div>
          <div style={{ padding: '8px 20px 16px' }}>
            <div className="activity-row">
              <div className="activity-avatar">K</div>
              <div style={{ flex: 1 }}>
                <div className="activity-text"><strong>Kouam N.</strong> submitted a membership application</div>
                <span className="activity-time">2 hours ago</span>
              </div>
              <span className="activity-badge pending">Pending</span>
            </div>
            <div className="activity-row">
              <div className="activity-avatar">T</div>
              <div style={{ flex: 1 }}>
                <div className="activity-text"><strong>Tagne P.</strong> was approved as a member</div>
                <span className="activity-time">5 hours ago</span>
              </div>
              <span className="activity-badge approved">Approved</span>
            </div>
            <div className="activity-row">
              <div className="activity-avatar">F</div>
              <div style={{ flex: 1 }}>
                <div className="activity-text"><strong>Fotso M.</strong> updated their profile information</div>
                <span className="activity-time">1 day ago</span>
              </div>
              <span className="activity-badge new">Updated</span>
            </div>
            <div className="activity-row">
              <div className="activity-avatar">N</div>
              <div style={{ flex: 1 }}>
                <div className="activity-text"><strong>Nganou S.</strong> paid quarterly dues</div>
                <span className="activity-time">2 days ago</span>
              </div>
              <span className="activity-badge approved">Paid</span>
            </div>
          </div>
        </div>

        {/* Admin Tools */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)' }}>Admin Tools</h3>
          </div>
          <div style={{ padding: '16px 20px 20px' }}>
            <button className="admin-tools-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Send Email to Members
            </button>
            <button className="admin-tools-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
              Generate Reports
            </button>
            <button className="admin-tools-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Manage Documents
            </button>
            <button className="admin-tools-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Site Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
