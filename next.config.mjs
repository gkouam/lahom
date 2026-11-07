/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Admin-uploaded gallery photos live in Vercel Blob storage.
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  async redirects() {
    return [
      // One public address: the old Vercel alias forwards to the real domain
      // (preview deployments use other hostnames and are unaffected).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'lahom.vercel.app' }],
        destination: 'https://lahomdfw.org/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
