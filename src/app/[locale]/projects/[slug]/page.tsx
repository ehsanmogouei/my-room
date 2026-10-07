import { ArrowLeft, ArrowUpRight, Languages } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MdxContent } from '@/components/mdx/MdxContent'
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
    )}&kind=project`,
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
  const { title, year, summary, stack, links, cover, featured } = project.frontmatter

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
    ...(cover ? { image: absoluteUrl(cover) } : {}),
    ...(links && links.length > 0 ? { sameAs: links.map((link) => link.href) } : {}),
    author: { '@type': 'Person', name: site.name[locale] },
  }

  return (
    <article className="container-page py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav className="mb-6" aria-label={dict.common.backTo}>
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-1.5 text-xs text-ink-faint transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
          {dict.nav.projects}
        </Link>
      </nav>

      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
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
              className="inline-flex items-center gap-1 rounded-full border border-subtle px-2 py-0.5 font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              <Languages className="size-3" aria-hidden="true" />
              {localeMeta[otherLocale].label}
            </Link>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">{summary}</p>

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
      </header>

      {cover && (
        <div className="relative mt-8 aspect-[16/7] overflow-hidden rounded-2xl border border-subtle">
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-10 max-w-3xl">
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
  )
}
