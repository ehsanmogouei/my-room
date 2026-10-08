import { Clock, Languages } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TableOfContents } from '@/components/blog/TableOfContents'
import { MdxContent } from '@/components/mdx/MdxContent'
import { PageHero } from '@/components/ui/PageHero'
import { PostCard } from '@/components/ui/PostCard'
import { site } from '@content/site'
import { getPost, getPostSlugs, getPosts, getRelatedPosts, toPostSummary } from '@/lib/content'
import { getDictionary } from '@/lib/dictionaries'
import { extractToc } from '@/lib/toc'
import { localeMeta, locales, resolveLocale, type Locale } from '@/lib/types'
import { absoluteUrl, formatDate, toIsoDate, truncate } from '@/lib/utils'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) => getPostSlugs(locale).map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale = resolveLocale(rawLocale)
  const post = getPost(locale, slug)

  if (!post) return { title: 'Not found' }

  const { title, summary, date, cover, tags } = post.frontmatter
  const ogImage = absoluteUrl(
    `/${locale}/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(
      truncate(summary, 90),
    )}&seed=${encodeURIComponent(`post:${slug}:${locale}`)}`,
  )

  // Link the translation only when it actually exists.
  const otherLocale: Locale = locale === 'fa' ? 'en' : 'fa'
  const translation = getPost(otherLocale, slug)

  return {
    title,
    description: truncate(summary, 160),
    keywords: tags,
    authors: [{ name: site.name[locale], url: absoluteUrl(`/${locale}`) }],
    alternates: {
      canonical: absoluteUrl(`/${locale}/blog/${slug}`),
      languages: {
        [localeMeta[locale].htmlLang]: absoluteUrl(`/${locale}/blog/${slug}`),
        ...(translation
          ? { [localeMeta[otherLocale].htmlLang]: absoluteUrl(`/${otherLocale}/blog/${slug}`) }
          : {}),
      },
    },
    openGraph: {
      type: 'article',
      title,
      description: truncate(summary, 160),
      url: absoluteUrl(`/${locale}/blog/${slug}`),
      publishedTime: toIsoDate(date),
      tags,
      images: [{ url: cover ? absoluteUrl(cover) : ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: truncate(summary, 160),
      images: [cover ? absoluteUrl(cover) : ogImage],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const locale = resolveLocale(rawLocale)

  const post = getPost(locale, slug)
  if (!post) notFound()

  const dict = getDictionary(locale)
  const { title, date, summary, tags } = post.frontmatter

  const toc = extractToc(post.body)
  const related = getRelatedPosts(locale, slug, 3)

  // Previous and next in chronological order.
  const all = getPosts(locale)
  const index = all.findIndex((entry) => entry.slug === slug)
  const newer = index > 0 ? all[index - 1] : undefined
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined

  const otherLocale: Locale = locale === 'fa' ? 'en' : 'fa'
  const translation = getPost(otherLocale, slug)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: summary,
    datePublished: toIsoDate(date),
    inLanguage: localeMeta[locale].htmlLang,
    url: absoluteUrl(`/${locale}/blog/${slug}`),
    // Only set when the author supplied a real photograph; otherwise the
    // generated Open Graph card is already referenced by the metadata above.
    ...(post.frontmatter.cover ? { image: absoluteUrl(post.frontmatter.cover) } : {}),
    author: { '@type': 'Person', name: site.name[locale], url: absoluteUrl(`/${locale}`) },
    keywords: (tags ?? []).join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <PageHero
        // Same seed as the card on the index, so the artwork carries across.
        seed={`post:${slug}:${locale}`}
        eyebrow={dict.nav.blog}
        title={title}
        subtitle={summary}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-muted">
          <time dateTime={toIsoDate(date)}>{formatDate(date, locale)}</time>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            <span className="tnum">{post.readingMinutes}</span>
            {dict.common.minutes}
          </span>

          {translation && (
            <Link
              href={`/${otherLocale}/blog/${slug}`}
              hrefLang={localeMeta[otherLocale].htmlLang}
              className="inline-flex items-center gap-1 rounded-full border border-subtle bg-surface-raised/70 px-2 py-0.5 font-semibold backdrop-blur transition-colors hover:border-accent hover:text-accent"
            >
              <Languages className="size-3" aria-hidden="true" />
              {localeMeta[otherLocale].label}
            </Link>
          )}

          {tags?.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      </PageHero>

      <article className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 max-w-3xl">
          <MdxContent source={post.body} locale={locale} />
        </div>

        {toc.length >= 2 && (
          <aside className="order-first lg:order-none">
            <div className="lg:sticky lg:top-24">
              <TableOfContents entries={toc} label={dict.blog.toc} />
            </div>
          </aside>
        )}
      </div>

      {/* ------------------------------------------------------ prev / next */}
      {(newer || older) && (
        <nav className="mt-14 grid gap-3 border-t border-subtle pt-8 sm:grid-cols-2">
          {older ? (
            <Link
              href={`/${locale}/blog/${older.slug}`}
              className="card px-5 py-4 transition-transform hover:-translate-y-0.5"
            >
              <span className="text-xs text-ink-faint">← {dict.common.publishedOn}</span>
              <span className="mt-1 block text-sm font-semibold text-ink">
                {older.frontmatter.title}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {newer && (
            <Link
              href={`/${locale}/blog/${newer.slug}`}
              className="card px-5 py-4 text-end transition-transform hover:-translate-y-0.5"
            >
              <span className="text-xs text-ink-faint">{dict.common.publishedOn} →</span>
              <span className="mt-1 block text-sm font-semibold text-ink">
                {newer.frontmatter.title}
              </span>
            </Link>
          )}
        </nav>
      )}

      {/* -------------------------------------------------------- related */}
      {related.length > 0 && (
        <section className="mt-14" aria-label={dict.blog.relatedPosts}>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-ink-faint uppercase">
            {dict.blog.relatedPosts}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((entry) => (
              <PostCard
                key={entry.slug}
                post={toPostSummary(entry)}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>
        </section>
      )}
      </article>
    </>
  )
}
