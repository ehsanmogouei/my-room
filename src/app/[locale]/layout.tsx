import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'

import { CommandPalette } from '@/components/CommandPalette'
import { Footer } from '@/components/shell/Footer'
import { Header } from '@/components/shell/Header'
import { ThemeProvider } from '@/components/ThemeProvider'
import { site } from '@content/site'
import { getDictionary } from '@/lib/dictionaries'
import { buildSearchIndex } from '@/lib/search-index'
import { themeBootstrapScript } from '@/lib/theme'
import { isLocale, localeMeta, locales, type Locale } from '@/lib/types'
import { absoluteUrl } from '@/lib/utils'

import '../globals.css'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : 'fa'
  const meta = localeMeta[locale]

  const title = `${site.name[locale]} — ${site.tagline[locale]}`
  const description = site.bio[locale]

  return {
    metadataBase: new URL(absoluteUrl('/')),
    title: {
      default: title,
      template: `%s · ${site.name[locale]}`,
    },
    description,
    keywords: [...site.seo.keywords[locale]],
    authors: [{ name: site.name[locale], url: absoluteUrl(`/${locale}`) }],
    creator: site.handle,
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      languages: {
        fa: absoluteUrl('/fa'),
        en: absoluteUrl('/en'),
        'x-default': absoluteUrl('/fa'),
      },
      types: {
        'application/rss+xml': absoluteUrl(`/${locale}/rss.xml`),
      },
    },
    openGraph: {
      type: 'website',
      siteName: site.name[locale],
      title,
      description,
      url: absoluteUrl(`/${locale}`),
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      alternateLocale: locale === 'fa' ? ['en_US'] : ['fa_IR'],
      images: [
        {
          url: absoluteUrl(`/${locale}/og?title=${encodeURIComponent(site.name[locale])}`),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: site.seo.twitter,
      images: [absoluteUrl(`/${locale}/og?title=${encodeURIComponent(site.name[locale])}`)],
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/avatar.svg' }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    formatDetection: { telephone: false, address: false, email: false },
    other: { 'og:locale:alternate': meta.htmlLang },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf6ef' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1017' },
  ],
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()

  const locale = raw
  const meta = localeMeta[locale]
  const dict = getDictionary(locale)
  const otherLocale: Locale = locale === 'fa' ? 'en' : 'fa'
  const searchIndex = buildSearchIndex(locale, dict)

  // Only the subset this locale actually needs is preloaded.
  const preloadFont =
    locale === 'fa' ? '/fonts/vazirmatn-arabic.woff2' : '/fonts/vazirmatn-latin.woff2'

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name[locale],
    alternateName: site.name[locale === 'fa' ? 'en' : 'fa'],
    description: site.bio[locale],
    url: absoluteUrl(`/${locale}`),
    email: `mailto:${site.email}`,
    image: absoluteUrl(site.avatar),
    sameAs: site.socials
      .filter((social) => social.href.startsWith('http'))
      .map((social) => social.href),
  }

  const siteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name[locale],
    url: absoluteUrl(`/${locale}`),
    inLanguage: meta.htmlLang,
    description: site.bio[locale],
  }

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      // Tells Next.js that smooth scrolling is intentional, so it does not
      // warn about it during route transitions.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href={preloadFont}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          // Sets the theme class before first paint. Must stay blocking.
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript(site.room.defaultMode) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema, siteSchema]) }}
        />
      </head>
      <body className="min-h-dvh">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-contrast"
        >
          {dict.common.skipToContent}
        </a>

        <ThemeProvider>
          <div className="flex min-h-dvh flex-col">
            <Header locale={locale} dict={dict} siteName={site.name[locale]} />

            <main id="content" className="flex-1">
              {children}
            </main>

            <Footer locale={locale} dict={dict} />
          </div>

          <CommandPalette
            items={searchIndex}
            dict={dict}
            locale={locale}
            otherLocale={otherLocale}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
