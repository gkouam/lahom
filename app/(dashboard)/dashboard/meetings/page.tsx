'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

interface MeetingNote {
  id: string
  title: string | null
  titleFr: string | null
  body: string | null
  bodyFr: string | null
  date: string
  createdAt: string
  updatedAt: string
  author: { name: string | null }
}

function resolveContent(note: MeetingNote, lang: 'en' | 'fr') {
  const hasEn = !!(note.title && note.body)
  const hasFr = !!(note.titleFr && note.bodyFr)

  if (lang === 'fr' && hasFr) {
    return { title: note.titleFr!, body: note.bodyFr!, fallback: null }
  }
  if (lang === 'en' && hasEn) {
    return { title: note.title!, body: note.body!, fallback: null }
  }
  if (hasEn) {
    return { title: note.title!, body: note.body!, fallback: 'meetings.fallback.enOnly' }
  }
  if (hasFr) {
    return { title: note.titleFr!, body: note.bodyFr!, fallback: 'meetings.fallback.frOnly' }
  }
  return { title: '', body: '', fallback: 'meetings.contentUnavailable' }
}

export default function MeetingsPage() {
  const { lang, t } = useLanguage()
  const [notes, setNotes] = useState<MeetingNote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/meetings')
      if (res.ok) {
        const data = await res.json()
        setNotes(data.notes)
      }
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  const selectedNote = selectedId ? notes.find(n => n.id === selectedId) : null

  if (loading) {
    return (
      <div className="dash-layout">
        <main className="dash-main">
          <div className="dash-main-inner">
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
                <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
                <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
              </svg>
              <p>{t('meetings.title')}...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Detail view
  if (selectedNote) {
    const { title, body, fallback } = resolveContent(selectedNote, lang)
    return (
      <div className="dash-layout">
        <main className="dash-main">
          <div className="dash-main-inner">
            <div className="topbar">
              <div className="topbar-left">
                <h1>{t('meetings.title')}</h1>
              </div>
            </div>

            <div className="dash-content-card">
              <div style={{ padding: '24px' }}>
                <button
                  onClick={() => setSelectedId(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '16px', padding: 0 }}
                >
                  &larr; {t('meetings.backToList')}
                </button>

                {fallback && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    marginBottom: '16px',
                    background: '#FFF3CD',
                    color: '#856404',
                    fontStyle: 'italic',
                  }}>
                    {t(fallback)}
                  </div>
                )}

                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '8px' }}>
                  {new Date(selectedNote.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {selectedNote.author.name && <> &middot; {selectedNote.author.name}</>}
                </div>

                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--night)', marginBottom: '16px' }}>
                  {title}
                </h2>

                <div style={{ fontSize: '0.92rem', color: 'var(--night)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {body}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // List view
  return (
    <div className="dash-layout">
      <main className="dash-main">
        <div className="dash-main-inner">
          <div className="topbar">
            <div className="topbar-left">
              <h1>{t('meetings.title')}</h1>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="dash-content-card">
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>
                {t('meetings.noNotes')}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notes.map(note => {
                const { title, body, fallback } = resolveContent(note, lang)
                return (
                  <div
                    key={note.id}
                    className="dash-content-card"
                    style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                    onClick={() => setSelectedId(note.id)}
                  >
                    <div style={{ padding: '20px' }}>
                      {fallback && (
                        <div style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          marginBottom: '10px',
                          background: '#FFF3CD',
                          color: '#856404',
                          fontStyle: 'italic',
                          display: 'inline-block',
                        }}>
                          {t(fallback)}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '6px' }}>
                        {new Date(note.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {note.author.name && <> &middot; {note.author.name}</>}
                      </div>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--night)', marginBottom: '8px' }}>
                        {title || t('meetings.contentUnavailable')}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {body}
                      </p>
                      <span style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600, marginTop: '8px', display: 'inline-block' }}>
                        {t('meetings.readMore')} &rarr;
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link href="/dashboard" style={{ color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
              &larr; {t('auth.dashboard')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
