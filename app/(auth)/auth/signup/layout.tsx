import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Become a member',
  robots: { index: true, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
