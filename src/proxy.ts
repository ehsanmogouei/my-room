import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, locales, type Locale } from '@/lib/types'

/**
 * Next.js 16 renamed the `middleware` convention to `proxy`; this file is the
 * same idea under the new name.
 *
 * Every page lives under a locale segment (`/fa/...`, `/en/...`).
 * Requests without one are redirected:
 *   - `/`      → the visitor's preferred language, sniffed from Accept-Language
 *   - `/blog`  → `/fa/blog` (the site's default language)
 *
 * Paths containing a dot (`/sitemap.xml`, `/robots.txt`, `/gallery/x.jpg`,
 * `/fonts/x.woff2`) are excluded by the matcher below and never redirected.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const alreadyLocalized = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )

  if (alreadyLocalized) return NextResponse.next()

  const locale = pathname === '/' ? detectLocale(request) : defaultLocale

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  return NextResponse.redirect(url)
}

/** Very small Accept-Language negotiation. Good enough for two languages. */
function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language') ?? ''

  for (const part of header.split(',')) {
    const tag = part.split(';')[0]?.trim().toLowerCase()
    if (!tag) continue

    const base = tag.split('-')[0]

    // Languages that use the Perso-Arabic script and read right-to-left.
    if (base === 'fa' || base === 'ps' || base === 'tg' || base === 'ur') return 'fa'
    if (base === 'en') return 'en'
  }

  return defaultLocale
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)'],
}
