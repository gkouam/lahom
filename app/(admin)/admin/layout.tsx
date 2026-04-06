'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  const initial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'

  return (
    <div className="admin-layout">
      {/* Kente bar at very top */}
      <div className="kente-bar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 51, height: '4px' }} />

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar" style={{ top: '4px' }}>
        {/* Kente bar inside sidebar top */}
        <div className="kente-bar" style={{ height: '3px', flexShrink: 0 }} />

        <div className="admin-sidebar-brand">
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
            <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
            <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
          </svg>
          <div>
            <strong>Baham Admin</strong>
            <span>Control Panel</span>
          </div>
        </div>

        {/* User Avatar Card */}
        <div className="sidebar-user-card">
          <div className="user-avatar-circle">{initial}</div>
          <div className="user-name">{user?.name || 'Admin'}</div>
          <div className="badge-wrap">
            <span className="user-role-badge">{user?.role || 'ADMIN'}</span>
          </div>
        </div>

        {/* Portal Switch */}
        <Link href="/dashboard" className="portal-switch-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
          Switch to Member Portal
        </Link>

        <nav className="admin-sidebar-nav">
          <Link
            href="/admin/members"
            className={pathname?.includes('/members') ? 'active' : ''}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/admin/members"
            className={pathname?.includes('/members') ? 'active' : ''}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Members
            <span className="nav-badge">2</span>
          </Link>
          <Link
            href="/admin/members"
            className=""
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Events
          </Link>
          <Link
            href="/admin/members"
            className=""
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
            Reports
          </Link>
          <Link
            href="/admin/members"
            className=""
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Messages
            <span className="nav-badge">5</span>
          </Link>
        </nav>

        <div className="admin-sidebar-bottom">
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
      <div className="admin-mobile-bar">
        <div className="kente-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px' }} />
        <Link href="/admin/members" className="admin-mobile-brand" style={{ textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 44 44" fill="none">
            <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
            <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
          </svg>
          Baham Admin
        </Link>
        <div className="admin-mobile-nav">
          <Link href="/admin/members" className={pathname?.includes('/members') ? 'active' : ''}>
            Members
          </Link>
          <Link href="/dashboard">Portal</Link>
          <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-main-inner">
          {children}
        </div>
      </main>
    </div>
  )
}
