'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'

// Mobile-only fixed bottom CTA on the landing page. Hides itself while the
// #join section is on screen (no point advertising what's already visible).
export default function StickyJoinCta() {
  const { t } = useLanguage()
  const [joinVisible, setJoinVisible] = useState(false)

  useEffect(() => {
    const join = document.getElementById('join')
    if (!join) return
    const observer = new IntersectionObserver(
      entries => setJoinVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0.15 },
    )
    observer.observe(join)
    return () => observer.disconnect()
  }, [])

  if (joinVisible) return null

  return (
    <a href="#join" className="sticky-join-cta mobile-only">
      {t('join.btn')}
    </a>
  )
}
