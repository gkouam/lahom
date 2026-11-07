// Calendar dates (events, contributions, meeting notes) come from <input type="date">
// and are stored as midnight UTC of the chosen day. Format them in UTC so every viewer
// sees the day the officer picked, and compute "today" in the association's time zone
// so an evening event in Dallas is still "upcoming" until midnight Central.

export const ORG_TIME_ZONE = 'America/Chicago'

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/** True for a "YYYY-MM-DD" value (time part, if any, is ignored). */
export function isCalendarDate(value: string): boolean {
  const day = value.slice(0, 10)
  if (!DATE_ONLY.test(day)) return false
  return !Number.isNaN(new Date(`${day}T00:00:00.000Z`).getTime())
}

/** "YYYY-MM-DD" (from a date input) → midnight UTC of that day. */
export function parseCalendarDate(value: string): Date {
  const day = value.slice(0, 10)
  if (!isCalendarDate(day)) throw new Error('Invalid date')
  return new Date(`${day}T00:00:00.000Z`)
}

/** Today's date in Central Time as "YYYY-MM-DD" (default value for date inputs). */
export function todayInOrgTimeZone(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ORG_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

/** Start of today in Central Time, comparable with stored calendar dates. */
export function startOfTodayOrg(now: Date = new Date()): Date {
  return new Date(`${todayInOrgTimeZone(now)}T00:00:00.000Z`)
}

type Lang = 'en' | 'fr'

/** Format a stored calendar date for display, in the viewer's language. */
export function formatCalendarDate(
  value: string | Date,
  lang: Lang = 'en',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
): string {
  return new Date(value).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { ...options, timeZone: 'UTC' })
}

/** Day of the month of a stored calendar date (for date badges). */
export function calendarDayOfMonth(value: string | Date): number {
  return new Date(value).getUTCDate()
}
