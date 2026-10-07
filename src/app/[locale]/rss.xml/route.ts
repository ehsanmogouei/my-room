import { site } from '@content/site'
import { getPosts } from '@/lib/content'
import { localeMeta, locales, resolveLocale, type Locale } from '@/lib/types'
import { absoluteUrl, truncate } from '@/lib/utils'

export const dynamic = 'force-static'

/**
 * Route handlers do not inherit `generateStaticParams` from their layout, so
 * without this the feed would be built once and `/en/rss.xml` would serve the
 * Persian one.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/** Escape the five characters that would otherwise break an XML document. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const locale: Locale = resolveLocale((await params).locale)
  const posts = getPosts(locale)
  const meta = localeMeta[locale]

  const feedUrl = absoluteUrl(`/${locale}/rss.xml`)
  const siteUrl = absoluteUrl(`/${locale}`)

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/${locale}/blog/${post.slug}`)

      return `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.frontmatter.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(truncate(post.frontmatter.summary, 400))}</description>
${(post.frontmatter.tags ?? [])
  .map((tag) => `      <category>${escapeXml(tag)}</category>`)
  .join('\n')}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name[locale]} — ${site.tagline[locale]}`)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(site.bio[locale])}</description>
    <language>${meta.htmlLang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
