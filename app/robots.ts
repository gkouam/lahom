import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/auth/signup'],
        // Private areas and APIs have nothing useful for search engines.
        disallow: ['/admin', '/dashboard', '/api/', '/auth/', '/forgot-password', '/reset-password'],
      },
    ],
    sitemap: 'https://lahomdfw.org/sitemap.xml',
    host: 'https://lahomdfw.org',
  }
}
