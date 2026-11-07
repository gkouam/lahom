'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Language, translations } from './translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
  /** t() with {placeholders} filled in. */
  tf: (key: string, params: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function fill(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? String(params[k]) : `{${k}}`))
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem('lang') } catch {}
    if (saved === 'fr') setLangState('fr')
  }, [])

  // Keep <html lang> in step with the chosen language, so screen readers
  // pronounce French text correctly and search engines label it properly.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang)
    try { localStorage.setItem('lang', newLang) } catch {}
  }, [])

  const t = useCallback((key: string): string => translations[key]?.[lang] || key, [lang])
  const tf = useCallback((key: string, params: Record<string, string | number>) => fill(t(key), params), [t])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tf }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
