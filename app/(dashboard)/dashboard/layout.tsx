'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useLanguage } from '@/lib/i18n/context'

// Shared member-portal shell: sidebar + mobile bar wrap every /dashboard/*
// page (mirrors the admin portal's shared layout).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { t } = useLanguage()
  const user = session?.user
  const hasAdminAccess = (user?.role === 'SUPER_ADMIN') || ((user?.permissions?.length ?? 0) > 0)
  const initial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'M'

  const isHome = pathname === '/dashboard'
  const isEvents = pathname?.startsWith('/dashboard/events') ?? false
  const isMeetings = pathname?.startsWith('/dashboard/meetings') ?? false

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
            <span>{t('dash.memberPortal')}</span>
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
        {hasAdminAccess && (
          <Link href="/admin/members" className="portal-switch-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            {t('dash.switchAdmin')}
          </Link>
        )}

        <nav className="dash-sidebar-nav">
          <Link href="/dashboard" className={isHome ? 'active' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            {t('auth.dashboard')}
          </Link>
          <Link href="/dashboard/events" className={isEvents ? 'active' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {t('eventsPage.title')}
          </Link>
          <Link href="/dashboard/meetings" className={isMeetings ? 'active' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
            </svg>
            {t('meetings.title')}
          </Link>
        </nav>

        <div className="dash-sidebar-bottom">
          <button onClick={() => signOut({ callbackUrl: '/' })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t('auth.signout')}
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
          <Link href="/dashboard" className={isHome ? 'active' : ''}>{t('dash.home')}</Link>
          {hasAdminAccess && <Link href="/admin/members">{t('dash.admin')}</Link>}
          <button onClick={() => signOut({ callbackUrl: '/' })}>{t('auth.signout')}</button>
        </div>
      </div>

      {/* Main Content */}
      <main className="dash-main">
        <div className="dash-main-inner">
          {children}
        </div>
      </main>
    </div>
  )
}
