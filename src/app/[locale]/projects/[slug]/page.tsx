import { ArrowUpRight, Languages } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MdxContent } from '@/components/mdx/MdxContent'
import { PageHero } from '@/components/ui/PageHeader'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { site } from '@content/site'
import { getProject, getProjectSlugs, getProjects } from '@/lib/content'
import { getDictionary } from '@/lib/dictionaries'
import { localeMeta, locales, resolveLocale, type Locale } from '@/lib/types'
import { absoluteUrl, truncate } from '@/lib/utils'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getProjectSlugs(locale).map((slug) => ({ locale, slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale = resolveLocale(rawLocale)
  const project = getProject(locale, slug)

  if (!project) return { title: 'Not found' }

  const { title, summary, cover, stack } = project.frontmatter
  const otherLocale: Locale = locale === 'fa' ? 'en' : 'fa'
  const translation = getProject(otherLocale, slug)

  const ogImage = absoluteUrl(
    `/${locale}/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(
      truncate(summary, 90),
    )}&seed=${encodeURIComponent(`project:${slug}:${locale}`)}`,
  )

  return {
    title,
    description: truncate(summary, 160),
    keywords: stack,
    alternates: {
      canonical: absoluteUrl(`/${locale}/projects/${slug}`),
      languages: {
        [localeMeta[locale].htmlLang]: absoluteUrl(`/${locale}/projects/${slug}`),
        ...(translation
          ? {
              [localeMeta[otherLocale].htmlLang]: absoluteUrl(
                `/${otherLocale}/projects/${slug}`,
              ),
            }
          : {}),
      },
    },
    openGraph: {
      type: 'article',
      title,
      description: truncate(summary, 160),
      url: absoluteUrl(`/${locale}/projects/${slug}`),
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const locale = resolveLocale(rawLocale)

  const project = getProject(locale, slug)
  if (!project) notFound()

  const dict = getDictionary(locale)
  const { title, year, summary, stack, links, featured } = project.frontmatter

  const others = getProjects(locale)
    .filter((entry) => entry.slug !== slug)
    .slice(0, 2)

  const otherLocale: Locale = locale === 'fa' ? 'en' : 'fa'
  const translation = getProject(otherLocale, slug)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: summary,
    url: absoluteUrl(`/${locale}/projects/${slug}`),
    ...(project.frontmatter.cover ? { image: absoluteUrl(project.frontmatter.cover) } : {}),
    ...(links && links.length > 0 ? { sameAs: links.map((link) => link.href) } : {}),
    author: { '@type': 'Person', name: site.name[locale] },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHero
        // Same seed as the card on the index, so the artwork carries across.
        seed={`project:${slug}:${locale}`}
        eyebrow={dict.nav.projects}
        title={title}
        subtitle={summary}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-muted">
          <span className="tnum">{year}</span>

          {featured && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-accent">{dict.common.featured}</span>
            </>
          )}

          {translation && (
            <Link
              href={`/${otherLocale}/projects/${slug}`}
              hrefLang={localeMeta[otherLocale].htmlLang}
              className="inline-flex items-center gap-1 rounded-full border border-subtle bg-surface-raised/70 px-2 py-0.5 font-semibold backdrop-blur transition-colors hover:border-accent hover:text-accent"
            >
              <Languages className="size-3" aria-hidden="true" />
              {localeMeta[otherLocale].label}
            </Link>
          )}
        </div>

        {stack.length > 0 && (
          <div className="mt-6">
            <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-ink-faint uppercase">
              {dict.common.stack}
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {stack.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {links && links.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </PageHero>

      <article className="wrap band">
        <div className="max-w-3xl">
          <MdxContent source={project.body} locale={locale} />
        </div>

      {others.length > 0 && (
          <section className="mt-14" aria-label={dict.projects.title}>
            <h2 className="text-xs font-semibold tracking-[0.18em] text-ink-faint uppercase">
              {dict.home.selectedWork}
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {others.map((entry) => (
                <ProjectCard key={entry.slug} project={entry} locale={locale} dict={dict} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
