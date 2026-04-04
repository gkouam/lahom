import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ivory, #FAF6F0)' }}>
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 no-underline" style={{ color: 'var(--night, #1A1A1A)' }}>
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
            <path d="M22 2L42 22L22 42L2 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1.6" />
            <path d="M22 10L34 22L22 34L10 22Z" stroke="var(--gold, #D4A017)" strokeWidth="1" opacity="0.5" />
            <circle cx="22" cy="22" r="3.5" fill="var(--gold, #D4A017)" />
          </svg>
          <div>
            <strong style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>Baham Bamiléké</strong>
            <br />
            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Dallas, Texas</span>
          </div>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  )
}
