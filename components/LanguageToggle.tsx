'use client'

import { useLanguage } from '@/lib/i18n/context'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <button
      className="lang-toggle"
      onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
      aria-label="Toggle language"
    >
      {lang === 'en' ? 'FR' : 'EN'}
    </button>
  )
}
