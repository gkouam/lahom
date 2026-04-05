'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isSignIn = pathname === '/auth/signin'
  const isSignUp = pathname === '/auth/signup'

  return (
    <div className="auth-split">
      {/* ── Branded Left Panel ── */}
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-logo">
            <svg width="64" height="64" viewBox="0 0 44 44" fill="none">
              <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
              <path d="M22 10L34 22L22 34L10 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1" opacity="0.5" />
              <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
            </svg>
          </div>
          <div className="auth-panel-text-group">
            <div className="auth-panel-title">Baham Bamiléké</div>
            <div className="auth-panel-subtitle">Dallas, Texas</div>
          </div>
          <p className="auth-panel-motto">&ldquo;Nkam si lah&rdquo; &mdash; Unity is Strength</p>
          <div className="kente-bar" />
          <p className="auth-panel-tagline">
            Connecting our community, preserving our heritage, building our future together.
          </p>
        </div>
      </div>

      {/* ── Right Side ── */}
      <div className="auth-right">
        <nav className="auth-nav">
          <Link href="/" className="auth-nav-home">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8L8 3L3 8" />
              <path d="M3 8v5a1 1 0 001 1h2.5v-3h3v3H12a1 1 0 001-1V8" />
            </svg>
            Home
          </Link>
          <div className="auth-nav-links">
            <Link
              href="/auth/signin"
              className={`auth-nav-link${isSignIn ? ' active' : ''}`}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className={`auth-nav-link${isSignUp ? ' active' : ''}`}
            >
              Create Account
            </Link>
          </div>
        </nav>

        <div className="auth-form-area">
          {children}
        </div>

        <div className="auth-footer">
          &copy; 2026 Baham Bamiléké Community of Dallas
        </div>
      </div>
    </div>
  )
}
