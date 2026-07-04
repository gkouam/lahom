'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useLanguage } from '@/lib/i18n/context'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { t } = useLanguage()
  const user = session?.user
  const initial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'

  const isSuper = user?.role === 'SUPER_ADMIN'
  const can = (p: string) => isSuper || (user?.permissions?.includes(p) ?? false)
  const canManageMembers = isSuper || can('MANAGE_MEMBERS') || can('VIEW_MEMBERS')

  const [counts, setCounts] = useState<{ pendingMembers: number; unreadMessages: number }>({ pendingMembers: 0, unreadMessages: 0 })

  useEffect(() => {
    let active = true
    fetch('/api/admin/counts')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (active && d) setCounts({ pendingMembers: d.pendingMembers ?? 0, unreadMessages: d.unreadMessages ?? 0 }) })
      .catch(() => {})
    return () => { active = false }
  }, [pathname])

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
            <span>{t('admin.controlPanel')}</span>
          </div>
        </div>

        {/* User Avatar Card */}
        <div className="sidebar-user-card">
          <div className="user-avatar-circle">{initial}</div>
          <div className="user-name">{user?.name || 'Admin'}</div>
          <div className="badge-wrap">
            <span className="user-role-badge">{user?.officerTitle || (isSuper ? 'Super Admin' : 'Officer')}</span>
          </div>
        </div>

        {/* Portal Switch */}
        <Link href="/dashboard" className="portal-switch-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
          {t('admin.switchToMember')}
        </Link>

        <nav className="admin-sidebar-nav">
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
            {t('admin.members')}
            {counts.pendingMembers > 0 && <span className="nav-badge">{counts.pendingMembers}</span>}
          </Link>
          {can('MANAGE_PERMISSIONS') && (
            <Link
              href="/admin/permissions"
              className={pathname?.includes('/permissions') ? 'active' : ''}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {t('admin.permissions')}
            </Link>
          )}
          {can('MANAGE_FINANCES') && (
            <Link
              href="/admin/finances"
              className={pathname?.includes('/finances') ? 'active' : ''}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              {t('admin.finances')}
            </Link>
          )}
          {can('MANAGE_MEETINGS') && (
            <Link
              href="/admin/meetings"
              className={pathname?.includes('/meetings') ? 'active' : ''}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              {t('admin.meetings')}
            </Link>
          )}
          {can('MANAGE_EVENTS') && (
            <Link
              href="/admin/events"
              className={pathname?.includes('/events') ? 'active' : ''}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              {t('admin.events')}
            </Link>
          )}
          {(isSuper || can('MANAGE_MEMBERS') || can('MANAGE_FINANCES')) && (
            <Link
              href="/admin/reports"
              className={pathname?.includes('/reports') ? 'active' : ''}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
              {t('admin.reports')}
            </Link>
          )}
          {canManageMembers && (
            <Link
              href="/admin/messages"
              className={pathname?.includes('/messages') ? 'active' : ''}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {t('admin.messages')}
              {counts.unreadMessages > 0 && <span className="nav-badge">{counts.unreadMessages}</span>}
            </Link>
          )}
        </nav>

        <div className="admin-sidebar-bottom">
          <button onClick={() => signOut({ callbackUrl: '/' })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t('admin.signOut')}
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
            {t('admin.members')}
          </Link>
          <Link href="/dashboard">{t('admin.portal')}</Link>
          <button onClick={() => signOut({ callbackUrl: '/' })}>{t('admin.signOut')}</button>
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
