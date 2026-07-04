'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'

interface MessageRow {
  id: string
  email: string
  name: string
  phone: string | null
  hometown: string | null
  message: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

type Filter = 'all' | 'unread' | 'join'

function relTime(iso: string, lang: 'en' | 'fr') {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (lang === 'fr') {
    if (m < 1) return 'à l\'instant'
    if (m < 60) return `il y a ${m} min`
    if (h < 24) return `il y a ${h} h`
    return `il y a ${d} j`
  }
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  if (h < 24) return `${h} hr ago`
  return `${d} day${d > 1 ? 's' : ''} ago`
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?'
}

export default function MessagesPage() {
  const { lang, t } = useLanguage()
  const [rows, setRows] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const fetchRows = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/messages')
      if (res.ok) {
        const data = await res.json()
        setRows(data.requests)
      }
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchRows() }, [fetchRows])

  const filtered = rows.filter(r => (filter === 'unread' ? r.status === 'PENDING' : true))
  const selected = selectedId ? rows.find(r => r.id === selectedId) || null : null

  const act = async (id: string, action: 'approve' | 'decline') => {
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) await fetchRows()
    } catch {}
    finally { setBusy(false) }
  }

  const FILTERS: { key: Filter; labelKey: string }[] = [
    { key: 'all', labelKey: 'messages.filter.all' },
    { key: 'unread', labelKey: 'messages.filter.unread' },
    { key: 'join', labelKey: 'messages.filter.join' },
  ]

  const statusStyle = (s: string) =>
    s === 'APPROVED' ? { bg: 'rgba(45,106,79,0.14)', color: 'var(--forest-mid)' }
      : s === 'REJECTED' ? { bg: 'rgba(164,36,59,0.12)', color: 'var(--wine-bright)' }
        : { bg: 'rgba(212,160,23,0.15)', color: 'var(--gold-ink)' }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left">
          <h1>{t('messages.title')}</h1>
          <p>{t('messages.subtitle')}</p>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            style={{
              minHeight: '36px',
              padding: '0 16px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: filter === f.key ? 'none' : '1px solid var(--line)',
              background: filter === f.key ? 'var(--gold)' : 'white',
              color: filter === f.key ? 'var(--night)' : 'var(--muted)',
            }}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>{t('messages.loading')}</div>
      ) : (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* List */}
          <div style={{ flex: '0 0 360px', maxWidth: '100%', background: 'white', borderRadius: '14px', border: '1px solid var(--line)', overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)' }}>{t('messages.empty')}</div>
            ) : filtered.map(r => {
              const isSel = r.id === selectedId
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--line)',
                    borderLeft: isSel ? '3px solid var(--gold)' : '3px solid transparent',
                    background: isSel ? 'rgba(212,160,23,0.06)' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  <div className="member-avatar gold-bg" style={{ width: '40px', height: '40px', fontSize: '0.85rem' }}>{initials(r.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 600, color: 'var(--night)', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                      {r.status === 'PENDING' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--wine-bright)', flexShrink: 0, marginTop: '4px' }} aria-label={t('messages.status.PENDING')} />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '2px' }}>
                      {t('messages.joinRequest')} · {relTime(r.createdAt, lang)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.message || r.email}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detail */}
          <div style={{ flex: 1, minWidth: '320px', background: 'white', borderRadius: '14px', border: '1px solid var(--line)', minHeight: '300px' }}>
            {!selected ? (
              <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--muted)' }}>{t('messages.selectPrompt')}</div>
            ) : (
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div className="member-avatar gold-bg" style={{ width: '48px', height: '48px', fontSize: '1rem' }}>{initials(selected.name)}</div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--night)' }}>{selected.name}</h2>
                    <span style={{ ...(() => { const s = statusStyle(selected.status); return { background: s.bg, color: s.color } })(), padding: '2px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {t(`messages.status.${selected.status}`)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px', fontSize: '0.85rem', marginBottom: '20px' }}>
                  <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{t('messages.email')}</span>
                  <span style={{ color: 'var(--night)' }}>{selected.email}</span>
                  {selected.phone && <><span style={{ color: 'var(--muted)', fontWeight: 600 }}>{t('messages.phone')}</span><span style={{ color: 'var(--night)' }}>{selected.phone}</span></>}
                  {selected.hometown && <><span style={{ color: 'var(--muted)', fontWeight: 600 }}>{t('messages.hometown')}</span><span style={{ color: 'var(--night)' }}>{selected.hometown}</span></>}
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                  {selected.message || <em style={{ color: 'var(--muted)' }}>{t('messages.noMessage')}</em>}
                </p>

                <div style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.25)', borderRadius: '10px', padding: '12px 14px', fontSize: '0.8rem', color: 'var(--ink)', marginBottom: '20px' }}>
                  {t('messages.callout')}
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => act(selected.id, 'approve')}
                    disabled={busy || selected.status === 'APPROVED'}
                    style={{ minHeight: '44px', padding: '0 20px', background: 'var(--gold)', color: 'var(--night)', border: 'none', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: busy ? 'default' : 'pointer', opacity: selected.status === 'APPROVED' ? 0.5 : 1 }}
                  >
                    {t('messages.approve')}
                  </button>
                  <button
                    onClick={() => act(selected.id, 'decline')}
                    disabled={busy || selected.status === 'REJECTED'}
                    style={{ minHeight: '44px', padding: '0 20px', background: 'transparent', color: 'var(--muted)', border: '1.5px solid var(--line)', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: busy ? 'default' : 'pointer', opacity: selected.status === 'REJECTED' ? 0.5 : 1 }}
                  >
                    {t('messages.decline')}
                  </button>
                  <a
                    href={`mailto:${selected.email}`}
                    style={{ marginLeft: 'auto', minHeight: '44px', padding: '0 20px', display: 'inline-flex', alignItems: 'center', color: 'var(--gold-ink)', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}
                  >
                    {t('messages.replyByEmail')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
