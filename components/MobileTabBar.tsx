'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'

export interface MobileTab {
  /** Link target. Omit (and set onClick) for action tabs like "More". */
  href?: string
  onClick?: () => void
  labelKey: string
  icon: React.ReactNode
  badge?: number
}

// Bottom tab bar shown only under 768px (CSS-hidden above). Shared by the
// member and admin portals via the tabs prop. Only the first tab whose
// pathname matches is marked active, so hash links to the same route
// (e.g. /dashboard#my-contributions) don't double-highlight.
export default function MobileTabBar({ tabs }: { tabs: MobileTab[] }) {
  const pathname = usePathname()
  const { t } = useLanguage()

  // Longest matching base wins so /dashboard doesn't stay highlighted on
  // /dashboard/events; hash links never match (they share another tab's route).
  let activeIndex = -1
  let bestLen = -1
  tabs.forEach((tab, i) => {
    if (!tab.href || tab.href.includes('#')) return
    const base = tab.href
    const hit = pathname === base || (pathname?.startsWith(base + '/') ?? false)
    if (hit && base.length > bestLen) { activeIndex = i; bestLen = base.length }
  })

  return (
    <nav className="mobile-tab-bar" aria-label="Navigation">
      {tabs.map((tab, i) => {
        const inner = (
          <>
            <span className="mobile-tab-icon" aria-hidden="true">
              {tab.icon}
              {(tab.badge ?? 0) > 0 && <span className="mobile-tab-badge">{tab.badge}</span>}
            </span>
            <span>{t(tab.labelKey)}</span>
          </>
        )
        const cls = `mobile-tab-item${i === activeIndex ? ' active' : ''}`
        return tab.href ? (
          <Link key={tab.labelKey} href={tab.href} className={cls}>
            {inner}
          </Link>
        ) : (
          <button key={tab.labelKey} type="button" onClick={tab.onClick} className={cls}>
            {inner}
          </button>
        )
      })}
    </nav>
  )
}
