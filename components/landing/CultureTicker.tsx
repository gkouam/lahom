'use client'

import { useLanguage } from '@/lib/i18n/context'

const KEYS = ['ticker.1', 'ticker.2', 'ticker.3', 'ticker.4', 'ticker.5', 'ticker.6', 'ticker.7', 'ticker.8', 'ticker.9']

export default function CultureTicker() {
  const { t } = useLanguage()
  const items = KEYS.map(k => t(k))
  // Drawn twice so the scroll loops seamlessly; the copy is hidden from screen readers.
  return (
    <div className="culture-ticker">
      <div className="ticker-inner">
        {items.map((item, i) => (
          <span key={`a${i}`}><b aria-hidden="true">◆</b> {item}</span>
        ))}
        {items.map((item, i) => (
          <span key={`b${i}`} aria-hidden="true"><b>◆</b> {item}</span>
        ))}
      </div>
    </div>
  )
}
