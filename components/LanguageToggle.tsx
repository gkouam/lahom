'use client'

import { useLanguage } from '@/lib/i18n/context'

// "compact" shows FR / EN (site header); "full" shows Français / English
// (portal sidebars and the sign-in pages, where there is room for the word).
export default function LanguageToggle({ variant = 'compact', className = '' }: { variant?: 'compact' | 'full'; className?: string }) {
  const { lang, setLang, t } = useLanguage()
  const next = lang === 'en' ? 'fr' : 'en'

  return (
    <button
      type="button"
      className={`lang-toggle${variant === 'full' ? ' lang-toggle-full' : ''}${className ? ` ${className}` : ''}`}
      onClick={() => setLang(next)}
      aria-label={lang === 'en' ? 'Passer en français' : 'Switch to English'}
      lang={next}
    >
      {variant === 'full' ? t('lang.label') : next.toUpperCase()}
    </button>
  )
}
