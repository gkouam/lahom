import type { Metadata, Viewport } from 'next'
import Providers from './providers'
import './globals.css'

const SITE_URL = 'https://lahomdfw.org'
const DESCRIPTION =
  "La'Hom DFW is the Baham Bamiléké community of Dallas–Fort Worth: preserving and teaching the language, history, arts and traditions of the Baham people of Cameroon, and supporting education and the integration of immigrants in North Texas."

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A1208',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "La'Hom DFW · Baham Bamiléké Community of Dallas–Fort Worth",
    template: "%s · La'Hom DFW",
  },
  description: DESCRIPTION,
  applicationName: "La'Hom DFW",
  alternates: { canonical: '/' },
  openGraph: {
    title: "La'Hom DFW · Baham Bamiléké Community of Dallas–Fort Worth",
    description: 'Preserving our Cameroon Grassfields heritage in Dallas–Fort Worth. "Nkam si lah": unity is strength.',
    url: SITE_URL,
    siteName: "La'Hom DFW",
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "La'Hom DFW · Baham Bamiléké Community of Dallas–Fort Worth",
    description: 'Preserving our Cameroon Grassfields heritage in Dallas–Fort Worth.',
  },
}

// Organization details for search engines. No 501(c)(3) or nonprofit claim
// until the Texas certificate and IRS letter are in hand.
const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: "La'Hom DFW",
  alternateName: 'Baham Bamiléké Community of Dallas–Fort Worth',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  email: 'info@lahomdfw.org',
  areaServed: 'Dallas–Fort Worth, Texas',
  description: DESCRIPTION,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
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
