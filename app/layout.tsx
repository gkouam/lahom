import type { Metadata } from 'next'
import Providers from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Baham Bamiléké Community — Dallas, Texas',
  description: 'Official community website of the Baham Bamiléké people of Dallas-Fort Worth, Texas. Preserving our Cameroon Grassfields heritage, honoring the Fon, and building community across generations.',
  openGraph: {
    title: 'Baham Bamiléké Community — Dallas, Texas',
    description: 'Preserving our Cameroon Grassfields heritage in Dallas-Fort Worth. "Nkam si lah" — Unity is Strength.',
    type: 'website',
    locale: 'en_US',
    images: ['/images/baham-ceremony.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baham Bamiléké Community — Dallas, Texas',
    description: 'Preserving our Cameroon Grassfields heritage in Dallas-Fort Worth.',
    images: ['/images/baham-ceremony.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
