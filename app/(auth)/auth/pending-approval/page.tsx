'use client'

import { useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'

const WHATSAPP_URL = 'https://chat.whatsapp.com/FdXvBZ537ZdFfJvENDernh'

export default function PendingApprovalPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { data: session, update } = useSession()
  const status = session?.user?.accountStatus
  const rejected = status === 'REJECTED'

  // Ask the server for a fresh session every 30 seconds. The session refresh
  // re-reads the account from the database, so an approval opens the portal
  // without signing out and in again.
  useEffect(() => {
    if (rejected) return
    const id = window.setInterval(() => { update() }, 30_000)
    return () => window.clearInterval(id)
  }, [rejected, update])

  useEffect(() => {
    if (status === 'APPROVED' && session?.user?.emailVerified) router.replace('/dashboard')
  }, [status, session?.user?.emailVerified, router])

  return (
    <div className="auth-card centered">
      <div className="auth-icon" aria-hidden="true">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          {rejected ? <path d="M15 9l-6 6M9 9l6 6" /> : <polyline points="12 6 12 12 16 14" />}
        </svg>
      </div>
      <h1 className="auth-title">{rejected ? t('pending.rejectedTitle') : t('pending.title')}</h1>
      <p className="auth-subtitle">{rejected ? t('pending.rejectedBody') : t('pending.body')}</p>
      <div className="auth-stack">
        {!rejected && (
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="auth-submit whatsapp">
            {t('pending.whatsapp')}
          </a>
        )}
        <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="auth-secondary">
          {t('auth.signout')}
        </button>
      </div>
    </div>
  )
}
