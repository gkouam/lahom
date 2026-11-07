'use client'

import { useLanguage } from '@/lib/i18n/context'

// Same rules the server enforces (lib/security/validation.ts).
export const PASSWORD_RULES: { key: string; test: (p: string) => boolean }[] = [
  { key: 'signup.rule.length', test: p => p.length >= 8 },
  { key: 'signup.rule.lower', test: p => /[a-z]/.test(p) },
  { key: 'signup.rule.upper', test: p => /[A-Z]/.test(p) },
  { key: 'signup.rule.number', test: p => /\d/.test(p) },
  { key: 'signup.rule.symbol', test: p => /[^A-Za-z0-9]/.test(p) },
]

export const passwordMeetsRules = (p: string) => PASSWORD_RULES.every(r => r.test(p))

export default function PasswordRules({ id, password }: { id: string; password: string }) {
  const { t } = useLanguage()
  return (
    <div id={id} className="pw-rules">
      <p className="pw-rules-title">{t('signup.rulesTitle')}</p>
      <ul>
        {PASSWORD_RULES.map(rule => {
          const ok = rule.test(password)
          return (
            <li key={rule.key} className={ok ? 'ok' : ''}>
              <span aria-hidden="true">{ok ? '✓' : '○'}</span>
              {t(rule.key)}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
