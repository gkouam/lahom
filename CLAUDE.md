# LAHOM — Baham Bamileke Community of Dallas

## What This Project Is

LAHOM is the digital home of the **Baham Bamileke Community of Dallas-Fort Worth** — a diaspora organization connecting people from the Kingdom of Baham in Cameroon's Western Highlands who now live in the DFW metroplex.

The app serves two purposes:
1. **Public-facing website** at [lahomdfw.org](https://lahomdfw.org) — showcasing heritage, culture, events, leadership, and a membership sign-up form
2. **Authenticated portal** — a member dashboard and admin control panel for community management

## The Spirit Behind It

The Bamileke people of Baham have a deep tradition of community solidarity, expressed in the motto **"Nkam si lah"** — *Unity is Strength*. This project digitizes that spirit.

**Cultural identity is central to every design decision.** The color palette draws from kente cloth (gold, wine, forest, clay). Typography pairs a ceremonial serif (Cormorant Garamond) with a modern sans (Plus Jakarta Sans). The kente bar — a striped border in community colors — appears at the top of every page. Diamond geometric patterns (inspired by Bamileke royal art) subtly overlay backgrounds. Leadership photos are displayed in circular frames, echoing the shape of traditional Bamileke elephant masks.

The site is **bilingual** (English and French) because the community straddles both linguistic traditions of Cameroon.

**Key cultural values embedded in the codebase:**
- Community approval: new members must be vetted by admins before accessing the portal
- Hierarchy and respect: leadership photos are prominently displayed with proper titles
- Collective memory: events, gallery, and heritage sections preserve and transmit culture
- Accessibility: bilingual support ensures no member is excluded by language

## What Has Been Achieved

### Milestone 1: Public Website (Commit 1-2)
- Full landing page with Hero, Heritage, Culture, Events, Gallery, Leadership, Join sections
- Mobile navigation, WhatsApp integration, language toggle (EN/FR)
- Email validation on join form

### Milestone 2: Auth & Data Layer (Commit 3-9)
- Converted from static HTML to Next.js 15 App Router with TypeScript
- Prisma + PostgreSQL data model (Users, Events, RSVPs, Announcements, MembershipRequests)
- NextAuth.js credentials authentication with JWT sessions
- Full security suite: account lockout, rate limiting, Pwned Passwords API, Zod validation
- Email verification flow via Resend (custom domain: send.lahomdfw.org)
- Admin approval workflow: register -> verify email -> await admin approval -> access portal
- Branded split-panel auth pages (signin, signup, verify, forgot/reset password, pending approval)

### Milestone 3: Leadership & Photos (Commits 10-22)
- Real community leaders with actual photos (President, VP, Secretary General, Treasurer)
- Photo cropping/processing pipeline using Sharp
- WhatsApp links updated to community group

### Milestone 4: Portal Design Integration (Commits 17-23)
- **Admin portal**: sidebar with user avatar card, portal switch, nav badges, gold border; topbar with notifications; stat cards redesigned with border-left accents and icon circles; pending actions card; activity log; admin tools panel
- **Member dashboard**: full sidebar layout matching admin style; stat cards (events, dues, members, attendance); upcoming events with date badges; quick actions (pay dues, RSVP, update profile, contact leadership); membership status card; community activity feed
- Mobile-friendly: both portals collapse sidebars to mobile bars, tables scroll horizontally, grids stack vertically

### Deployment
- Hosted on **Vercel** with auto-deploy from `main` branch
- Custom domain: **lahomdfw.org**
- Vercel alias: lahom.vercel.app

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 15.4** (App Router) | Server components, file-based routing, API routes, middleware |
| Language | **TypeScript 5.7** | Type safety across frontend and backend |
| UI | **React 19** | Component model, hooks |
| Styling | **Custom CSS** (`styles/legacy.css`) + Tailwind 4 | Hand-crafted design system with cultural branding; Tailwind for utilities |
| Database | **PostgreSQL** | Relational data (users, events, RSVPs), hosted externally |
| ORM | **Prisma 6** | Type-safe queries, schema-driven migrations |
| Auth | **NextAuth.js 4** | Credentials provider, JWT sessions, role-based access |
| Email | **Resend** | Transactional emails (verification, password reset, approval notifications) |
| Validation | **Zod** | Schema validation for all API inputs |
| Image Processing | **Sharp** | Cropping/resizing leadership photos |
| Deployment | **Vercel** | Git-push deploy, edge middleware, custom domain |

## Architecture

```
C:\projects\lahom\
|
|-- app/                          # Next.js App Router
|   |-- layout.tsx                # Root: fonts, metadata, providers
|   |-- page.tsx                  # Landing page (public)
|   |-- providers.tsx             # SessionProvider + LanguageProvider
|   |-- globals.css               # Tailwind base
|   |-- (auth)/                   # Auth route group
|   |   |-- layout.tsx            # Split-panel auth layout
|   |   |-- auth/signin/          # Sign in
|   |   |-- auth/signup/          # Register
|   |   |-- auth/verify-email/    # Email verification
|   |   |-- auth/verify-email-required/
|   |   |-- auth/pending-approval/
|   |   |-- forgot-password/
|   |   |-- reset-password/
|   |-- (dashboard)/              # Member portal route group
|   |   |-- dashboard/page.tsx    # Member dashboard (sidebar layout)
|   |-- (admin)/                  # Admin route group
|   |   |-- admin/layout.tsx      # Admin sidebar layout
|   |   |-- admin/page.tsx        # Redirects to /admin/members
|   |   |-- admin/members/page.tsx
|   |-- api/
|       |-- auth/[...nextauth]/   # NextAuth handler
|       |-- auth/register/        # POST: user registration
|       |-- auth/verify-email/    # GET: token verification
|       |-- auth/resend-verification/
|       |-- auth/forgot-password/
|       |-- auth/reset-password/
|       |-- join/                 # POST: public membership request
|       |-- admin/members/        # GET: list users, PATCH: approve/reject
|
|-- components/
|   |-- NavBar.tsx                # Site navigation (language toggle, auth-aware)
|   |-- LanguageToggle.tsx        # EN/FR switch
|   |-- WhatsAppFloat.tsx         # Floating WhatsApp button
|   |-- landing/                  # Landing page sections
|       |-- LandingPage.tsx       # Composes all sections
|       |-- Hero.tsx
|       |-- HeritageSection.tsx
|       |-- CultureShowcase.tsx
|       |-- EventsSection.tsx
|       |-- GallerySection.tsx
|       |-- LeadershipSection.tsx
|       |-- JoinSection.tsx
|       |-- Footer.tsx
|       |-- Lightbox.tsx
|
|-- lib/
|   |-- db.ts                     # Prisma singleton
|   |-- auth.ts                   # NextAuth config (credentials, JWT, callbacks)
|   |-- security/
|   |   |-- account-security.ts   # Lockout (5 attempts / 15 min), audit logging
|   |   |-- email-verification.ts # Token creation/verification
|   |   |-- password-breach.ts    # Pwned Passwords API check
|   |   |-- rate-limiter.ts       # LRU-cache per-endpoint rate limiting
|   |   |-- validation.ts         # Zod schemas, HTML escaping
|   |-- email/
|   |   |-- service.ts            # Resend integration (6 email types)
|   |-- i18n/
|   |   |-- context.tsx           # useLanguage hook, LanguageProvider
|   |   |-- translations.ts       # EN/FR content for all UI
|   |-- hooks/
|       |-- useFadeIn.ts          # Intersection Observer for scroll animations
|
|-- prisma/
|   |-- schema.prisma             # Data model
|   |-- seed.ts                   # Admin user + sample events
|
|-- styles/
|   |-- legacy.css                # Full design system (~3200 lines)
|
|-- public/images/                # Static assets (photos, patterns, SVGs)
|-- middleware.ts                  # Route protection, security headers, CSP
|-- types/next-auth.d.ts          # Session/JWT type augmentation
```

## Data Model

**User** — `id, email, password, name, phone, hometown, role (MEMBER|ADMIN), accountStatus (PENDING_APPROVAL|APPROVED|REJECTED), emailVerified`

**Event** — `id, title, titleFr, description, descriptionFr, date, location, color` (bilingual)

**RSVP** — `userId + eventId` (unique pair, cascade delete)

**Announcement** — `id, title, titleFr, content, contentFr, authorId`

**MembershipRequest** — `name, email, phone, hometown, message, status` (from public join form)

**VerificationToken** — `token, email, type (EMAIL_VERIFICATION|PASSWORD_RESET), expires`

**LoginAttempt** — `email, ipAddress, userAgent, success` (security audit trail)

**AuditLog** — `userId, action, resource, resourceId, ipAddress, userAgent, metadata`

## Authentication Flow

```
Register -> Verify Email (24h token) -> Await Admin Approval -> Access Portal
                                              |
                                        Admin reviews in /admin/members
                                        Approves or Rejects
                                              |
                                        Email notification sent
```

**Security layers:** Zod input validation -> Rate limiting -> Account lockout check -> Pwned password check -> bcrypt hash -> JWT session -> Middleware route protection -> Security headers (CSP, HSTS, etc.)

## Key Conventions

- **Bilingual content**: Data model has `title` + `titleFr` pairs; UI uses `useLanguage()` hook with `t('key')` pattern
- **Cultural CSS**: All brand styling lives in `styles/legacy.css` using CSS custom properties (`--gold`, `--night`, `--forest`, etc.)
- **Route groups**: `(auth)`, `(dashboard)`, `(admin)` keep layouts separate without affecting URLs
- **API pattern**: Zod parse -> rate limit -> business logic -> NextResponse.json
- **Prisma singleton**: Global instance reused across hot reloads in dev
- **Session types**: Augmented in `types/next-auth.d.ts` to include `role`, `accountStatus`, `emailVerified`

## Environment Variables

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://lahomdfw.org
NEXTAUTH_SECRET=<openssl rand -base64 32>
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@lahomdfw.org
```

## Getting Started

```bash
cd C:\projects\lahom
npm install
# Set up .env.local with the variables above
npx prisma db push        # Create tables
npx tsx prisma/seed.ts     # Seed admin user + sample events
npm run dev                # http://localhost:3000
```

Default admin: `admin@lahomdfw.org` / `Admin123!@#`

## Deployment

Push to `main` branch triggers Vercel auto-deploy. For manual deploy:

```bash
npx vercel --prod
```

Live at: **https://lahomdfw.org** (custom domain) and **https://lahom.vercel.app** (Vercel alias)
