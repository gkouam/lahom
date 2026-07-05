import { chromium } from 'playwright'
import fs from 'fs'

const BASE = 'http://localhost:3000'
const OUT = '_audit'
const ADMIN = { email: process.env.AUDIT_EMAIL || "admin@lahomdfw.org", password: process.env.AUDIT_PASSWORD || "Admin123!@#" }

fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
})
const page = await ctx.newPage()

async function shot(name, { full = true } = {}) {
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full })
  console.log('shot:', name)
}

// 1. Landing (top viewport, then full page)
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await shot('01-landing-top', { full: false })
await shot('02-landing-full')

// 2. Sign-in page
await page.goto(BASE + '/auth/signin', { waitUntil: 'networkidle' })
await shot('03-signin', { full: false })

// 3. Log in as admin
await page.fill('input[type="email"]', ADMIN.email)
await page.fill('input[type="password"]', ADMIN.password)
await Promise.all([
  page.waitForURL('**/dashboard**', { timeout: 30000 }),
  page.click('button[type="submit"]'),
])
await page.waitForLoadState('networkidle')

// 4. Member dashboard
await shot('04-dashboard-top', { full: false })
await shot('05-dashboard-full')

// 5. Member events + meetings
await page.goto(BASE + '/dashboard/events', { waitUntil: 'networkidle' })
await shot('06-member-events', { full: false })
await page.goto(BASE + '/dashboard/meetings', { waitUntil: 'networkidle' })
await shot('07-member-meetings', { full: false })

// 6. Admin members
await page.goto(BASE + '/admin/members', { waitUntil: 'networkidle' })
await shot('08-admin-members-top', { full: false })
await shot('09-admin-members-full')

// 7. Admin More sheet
const moreBtn = page.locator('.mobile-tab-item', { hasText: /More|Plus/ })
if (await moreBtn.count()) {
  await moreBtn.first().click()
  await shot('10-admin-more-sheet', { full: false })
  await page.keyboard.press('Escape')
}

// 8. Admin reports + messages
await page.goto(BASE + '/admin/reports', { waitUntil: 'networkidle' })
await shot('11-admin-reports', { full: false })
await page.goto(BASE + '/admin/messages', { waitUntil: 'networkidle' })
await shot('12-admin-messages', { full: false })

// 9. Horizontal overflow probe on key routes
for (const [label, path] of [['landing', '/'], ['dashboard', '/dashboard'], ['members', '/admin/members']]) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  console.log(`overflow ${label}: ${overflow}px`)
}

await browser.close()
console.log('AUDIT COMPLETE')
