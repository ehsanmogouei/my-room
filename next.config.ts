import type { NextConfig } from 'next'

/**
 * Security headers applied to every response.
 * Kept permissive enough for inline SVG artwork and the theme bootstrap script.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Turbopack otherwise walks up to the nearest lockfile, which can be well
  // outside this project and drag unrelated directories into the build graph.
  turbopack: {
    root: process.cwd(),
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
