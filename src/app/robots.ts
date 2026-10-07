import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The generated OG images are for crawlers, not for indexing.
        disallow: ['/api/', '/fa/og', '/en/og'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
