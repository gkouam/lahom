import type { MetadataRoute } from 'next'

// Only public pages belong here; the portals and sign-in pages are excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://lahomdfw.org', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  ]
}
