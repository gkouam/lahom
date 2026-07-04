'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/context'

interface Bar { label: string; value: number }
interface AttendanceRow {
  id: string
  title: string | null
  titleFr: string | null
  date: string
  rsvpd: number
  attended: number
  turnout: number
}
interface ReportData {
  period: string
  stats: { activeMembers: number; duesCollected: string; avgAttendance: number; behindOnDues: number }
  charts: { membershipGrowth: Bar[]; contributionsByMonth: Bar[] }
  attendance: AttendanceRow[]
}

const PERIODS = [
  { key: 'ytd', labelKey: 'reports.period.ytd' },
  { key: '12mo', labelKey: 'reports.period.12mo' },
  { key: 'all', labelKey: 'reports.period.all' },
] as const

function turnoutStyle(pct: number): { bg: string; color: string } {
  if (pct >= 85) return { bg: 'rgba(45,106,79,0.14)', color: 'var(--forest-mid)' }
  if (pct >= 70) return { bg: 'rgba(212,160,23,0.15)', color: 'var(--gold-ink)' }
  return { bg: 'rgba(164,36,59,0.12)', color: 'var(--wine-bright)' }
}

function BarChart({ bars, color, format }: { bars: Bar[]; color: string; format?: (n: number) => string }) {
  const max = Math.max(1, ...bars.map(b => b.value))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '180px', padding: '8px 4px 0' }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--night)' }}>{format ? format(b.value) : b.value}</span>
          <div
            title={`${b.label}: ${format ? format(b.value) : b.value}`}
            style={{ width: '100%', maxWidth: '46px', height: `${(b.value / max) * 100}%`, minHeight: b.value > 0 ? '4px' : '0', background: color, borderRadius: '6px 6px 0 0', transition: 'height 0.3s' }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{b.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  const { lang, t } = useLanguage()
  const [period, setPeriod] = useState('ytd')
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async (p: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/reports?period=${p}`)
      if (res.ok) setData(await res.json())
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData(period) }, [period, fetchData])

  const eventName = (r: AttendanceRow) => (lang === 'fr' ? r.titleFr || r.title : r.title || r.titleFr) || '—'

  const exportCsv = () => {
    if (!data) return
    const rows: string[][] = [
      [t('reports.stat.activeMembers'), String(data.stats.activeMembers)],
      [t('reports.stat.duesCollected'), `$${data.stats.duesCollected}`],
      [t('reports.stat.avgAttendance'), String(data.stats.avgAttendance)],
      [t('reports.stat.behindOnDues'), String(data.stats.behindOnDues)],
      [],
      [t('reports.table.event'), t('reports.table.date'), t('reports.table.rsvpd'), t('reports.table.attended'), t('reports.table.turnout')],
      ...data.attendance.map(r => [eventName(r), new Date(r.date).toLocaleDateString(), String(r.rsvpd), String(r.attended), `${r.turnout}%`]),
    ]
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lahom-report-${period}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left">
          <h1>{t('reports.title')}</h1>
          <p>{t('reports.subtitle')}</p>
        </div>
        <div className="topbar-actions" style={{ gap: '12px' }}>
          <div role="tablist" aria-label={t('reports.title')} style={{ display: 'inline-flex', background: 'white', border: '1px solid var(--line)', borderRadius: '10px', overflow: 'hidden' }}>
            {PERIODS.map(p => (
              <button
                key={p.key}
                role="tab"
                aria-selected={period === p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: '0 14px',
                  minHeight: '40px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: period === p.key ? 'var(--gold)' : 'transparent',
                  color: period === p.key ? 'var(--night)' : 'var(--muted)',
                }}
              >
                {t(p.labelKey)}
              </button>
            ))}
          </div>
          <button
            onClick={exportCsv}
            disabled={!data}
            style={{ minHeight: '44px', padding: '0 20px', background: 'var(--gold)', color: 'var(--night)', border: 'none', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: data ? 'pointer' : 'default' }}
          >
            {t('reports.exportCsv')}
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>{t('reports.loading')}</div>
      ) : data ? (
        <>
          {/* Stat cards */}
          <div className="admin-stats-row">
            <div className="admin-stat-card gold">
              <div className="stat-card-inner">
                <div className="stat-icon-circle gold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></svg>
                </div>
                <div>
                  <div className="stat-label">{t('reports.stat.activeMembers')}</div>
                  <div className="stat-value">{data.stats.activeMembers}</div>
                </div>
              </div>
            </div>
            <div className="admin-stat-card green">
              <div className="stat-card-inner">
                <div className="stat-icon-circle green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <div>
                  <div className="stat-label">{t('reports.stat.duesCollected')}</div>
                  <div className="stat-value">${data.stats.duesCollected}</div>
                </div>
              </div>
            </div>
            <div className="admin-stat-card clay">
              <div className="stat-card-inner">
                <div className="stat-icon-circle clay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                </div>
                <div>
                  <div className="stat-label">{t('reports.stat.avgAttendance')}</div>
                  <div className="stat-value">{data.stats.avgAttendance}</div>
                </div>
              </div>
            </div>
            <div className="admin-stat-card red">
              <div className="stat-card-inner">
                <div className="stat-icon-circle red">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
                </div>
                <div>
                  <div className="stat-label">{t('reports.stat.behindOnDues')}</div>
                  <div className="stat-value">{data.stats.behindOnDues}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }} className="admin-below-table">
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)', marginBottom: '8px' }}>{t('reports.chart.membership')}</h3>
              <BarChart bars={data.charts.membershipGrowth} color="var(--gold)" />
            </div>
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--line)', padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)', marginBottom: '8px' }}>{t('reports.chart.contributions')}</h3>
              <BarChart bars={data.charts.contributionsByMonth} color="var(--forest-mid)" format={(n) => `$${n}`} />
            </div>
          </div>

          {/* Attendance table */}
          <div className="admin-table-wrap">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--night)' }}>{t('reports.table.title')}</h3>
            </div>
            {data.attendance.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>{t('reports.noEvents')}</div>
            ) : (
              <table className="admin-table" style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th>{t('reports.table.event')}</th>
                    <th>{t('reports.table.date')}</th>
                    <th>{t('reports.table.rsvpd')}</th>
                    <th>{t('reports.table.attended')}</th>
                    <th style={{ textAlign: 'right' }}>{t('reports.table.turnout')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.attendance.map(r => {
                    const s = turnoutStyle(r.turnout)
                    return (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{eventName(r)}</td>
                        <td style={{ color: 'var(--muted)' }}>{new Date(r.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}</td>
                        <td>{r.rsvpd}</td>
                        <td>{r.attended}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ background: s.bg, color: s.color, padding: '3px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>{r.turnout}%</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>{t('reports.noEvents')}</div>
      )}
    </div>
  )
}
