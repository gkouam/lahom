'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session } = useSession()
  const user = session?.user
  const isAdmin = user?.role === 'ADMIN'
  const initial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'M'

  return (
    <div className="dash-layout">
      {/* Desktop Sidebar */}
      <aside className="dash-sidebar">
        <div className="kente-bar" style={{ height: '3px', flexShrink: 0 }} />

        <div className="dash-sidebar-brand">
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
            <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
            <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
          </svg>
          <div>
            <strong>Baham</strong>
            <span>Member Portal</span>
          </div>
        </div>

        {/* User Avatar Card */}
        <div className="sidebar-user-card">
          <div className="user-avatar-circle">{initial}</div>
          <div className="user-name">{user?.name || 'Member'}</div>
          <div className="badge-wrap">
            <span className="user-role-badge">{user?.role || 'MEMBER'}</span>
          </div>
        </div>

        {/* Portal Switch (if admin) */}
        {isAdmin && (
          <Link href="/admin/members" className="portal-switch-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            Switch to Admin Portal
          </Link>
        )}

        <nav className="dash-sidebar-nav">
          <Link href="/dashboard" className="active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            Dashboard
          </Link>
          <Link href="/dashboard" className="">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Events
          </Link>
          <Link href="/dashboard" className="">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Gallery
          </Link>
          <Link href="/dashboard" className="">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Dues
          </Link>
          <Link href="/dashboard" className="">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Documents
          </Link>
          <Link href="/dashboard" className="">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Messages
            <span className="nav-badge">3</span>
          </Link>
          <Link href="/dashboard" className="">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </Link>
        </nav>

        <div className="dash-sidebar-bottom">
          <button onClick={() => signOut({ callbackUrl: '/' })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="dash-mobile-bar">
        <div className="kente-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px' }} />
        <Link href="/dashboard" className="dash-mobile-brand" style={{ textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 44 44" fill="none">
            <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
            <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
          </svg>
          Baham Portal
        </Link>
        <div className="dash-mobile-nav">
          <Link href="/dashboard" className="active">Home</Link>
          {isAdmin && <Link href="/admin/members">Admin</Link>}
          <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="dash-main">
        <div className="dash-main-inner">
          {/* TopBar */}
          <div className="topbar">
            <div className="topbar-left">
              <h1>Welcome back, <span style={{ color: 'var(--gold)' }}>{user?.name || 'Member'}</span></h1>
              <p>&ldquo;Nkam si lah&rdquo; — Unity is Strength</p>
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
                  <div className="stat-label">Upcoming Events</div>
                  <div className="stat-value">3</div>
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
                  <div className="stat-label">Dues Paid</div>
                  <div className="stat-value">$150</div>
                </div>
              </div>
            </div>
            <div className="dash-stat-card blue">
              <div className="stat-card-inner">
                <div className="stat-icon-circle blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <div className="stat-label">Active Members</div>
                  <div className="stat-value">48</div>
                </div>
              </div>
            </div>
            <div className="dash-stat-card clay">
              <div className="stat-card-inner">
                <div className="stat-icon-circle clay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <div className="stat-label">Events Attended</div>
                  <div className="stat-value">7</div>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Content */}
          <div className="dash-content-grid">
            {/* Upcoming Events */}
            <div className="dash-content-card">
              <div className="dash-content-card-header">
                <h3>Upcoming Events</h3>
                <a href="#">View All</a>
              </div>
              <div className="dash-content-card-body">
                <div className="event-item">
                  <div className="event-date-badge">
                    <span className="event-month">Apr</span>
                    <span className="event-day">19</span>
                  </div>
                  <div className="event-info">
                    <h4>Community General Assembly</h4>
                    <p>Dallas Community Center, 2:00 PM</p>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-date-badge">
                    <span className="event-month">May</span>
                    <span className="event-day">10</span>
                  </div>
                  <div className="event-info">
                    <h4>Cultural Heritage Celebration</h4>
                    <p>Richardson Civic Center, 5:00 PM</p>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-date-badge">
                    <span className="event-month">Jun</span>
                    <span className="event-day">7</span>
                  </div>
                  <div className="event-info">
                    <h4>Youth Mentorship Workshop</h4>
                    <p>Plano Library Hall, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions + Membership Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Quick Actions */}
              <div className="dash-content-card">
                <div className="dash-content-card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="dash-content-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button className="quick-action-btn">
                    <div className="qa-icon gold">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    Pay Dues
                    <div className="qa-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="qa-icon green">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                    </div>
                    RSVP to Events
                    <div className="qa-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="qa-icon clay">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    Update Profile
                    <div className="qa-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="qa-icon wine">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    Contact Leadership
                    <div className="qa-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Membership Status */}
              <div className="membership-status-card">
                <div className="status-indicator">
                  <div className="green-dot" />
                  <span>Active Member</span>
                </div>
                <h3>Membership Status</h3>
                <p>Your dues are current through Q2 2026. Next payment due July 1, 2026.</p>
              </div>
            </div>
          </div>

          {/* Recent Community Activity */}
          <div className="dash-content-card">
            <div className="dash-content-card-header">
              <h3>Recent Community Activity</h3>
              <a href="#">View All</a>
            </div>
            <div className="dash-content-card-body">
              <div className="activity-row">
                <div className="activity-avatar">T</div>
                <div style={{ flex: 1 }}>
                  <div className="activity-text"><strong>Tagne P.</strong> joined the community as a new member</div>
                  <span className="activity-time">2 hours ago</span>
                </div>
                <span className="activity-badge new">New</span>
              </div>
              <div className="activity-row">
                <div className="activity-avatar">F</div>
                <div style={{ flex: 1 }}>
                  <div className="activity-text"><strong>Fotso M.</strong> RSVP&apos;d to Community General Assembly</div>
                  <span className="activity-time">5 hours ago</span>
                </div>
                <span className="activity-badge approved">Confirmed</span>
              </div>
              <div className="activity-row">
                <div className="activity-avatar">N</div>
                <div style={{ flex: 1 }}>
                  <div className="activity-text"><strong>Nganou S.</strong> submitted quarterly dues payment</div>
                  <span className="activity-time">1 day ago</span>
                </div>
                <span className="activity-badge approved">Paid</span>
              </div>
              <div className="activity-row">
                <div className="activity-avatar">K</div>
                <div style={{ flex: 1 }}>
                  <div className="activity-text"><strong>Kouam D.</strong> uploaded photos from the last event</div>
                  <span className="activity-time">2 days ago</span>
                </div>
                <span className="activity-badge new">Gallery</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
