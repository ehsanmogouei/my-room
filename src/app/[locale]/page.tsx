import type { Metadata } from 'next'
import Link from 'next/link'

import { GenerativeArt } from '@/components/art/GenerativeArt'
import { LivingCanvas } from '@/components/art/LivingCanvas'
import { PostCard } from '@/components/ui/PostCard'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { SectionLabel } from '@/components/ui/PageHeader'
import { site } from '@content/site'
import { getGallery, getPostSummaries, getProjects } from '@/lib/content'
import { getDictionary } from '@/lib/dictionaries'
import { resolveLocale, type SectionKey } from '@/lib/types'
import { truncate } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale)

  return {
    description: truncate(site.bio[locale], 160),
    alternates: { canonical: `/${locale}` },
  }
}

const SECTION_LINKS: Array<{ key: SectionKey; path: string }> = [
  { key: 'work', path: '/projects' },
  { key: 'writing', path: '/blog' },
  { key: 'frames', path: '/gallery' },
  { key: 'now', path: '/now' },
]

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)

  const allPosts = getPostSummaries(locale)
  const allProjects = getProjects(locale)
  const frames = getGallery()

  const posts = allPosts.slice(0, 3)
  const projects = allProjects.slice(0, 3)

  const stats = [
    { value: allPosts.length, label: dict.hero.stats.posts },
    { value: allProjects.length, label: dict.hero.stats.projects },
    { value: frames.length, label: dict.hero.stats.frames },
  ]

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="hero grain relative isolate overflow-hidden" aria-label={site.name[locale]}>
        {/* The living half of the artwork engine. The hero is pinned to the
            site's signature palette so the first impression always reads as
            this site; everything further down keeps the full range. */}
        <div className="absolute inset-0" aria-hidden="true">
          <LivingCanvas seed={`hero:${locale}`} intensity={1} inkSetId="ember" />
        </div>
        <div className="hero__veil" aria-hidden="true" />

        <div className="container-page relative flex flex-col justify-center pt-16 pb-28">
          <p className="text-[0.72rem] font-semibold tracking-[0.34em] text-accent uppercase">
            {dict.hero.eyebrow}
          </p>

          <h1 className="hero__title mt-5 max-w-4xl">{site.name[locale]}</h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
            {site.tagline[locale]}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href={`/${locale}/projects`} className="btn btn-primary">
              {dict.sections.work.label}
            </Link>
            <Link href={`/${locale}/blog`} className="btn btn-ghost">
              {dict.sections.writing.label}
            </Link>
          </div>

          <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="tnum text-2xl font-bold text-ink">{stat.value}</dd>
                <span className="text-xs text-ink-faint">{stat.label}</span>
              </div>
            ))}
          </dl>
        </div>

        <p className="hero__cue" aria-hidden="true">
          {dict.hero.cue}
          <span className="hero__cue-line" />
        </p>
      </section>

      <div className="container-page pb-16">
        {/* --------------------------------------------------- sections */}
        <section className="mt-16" aria-label={dict.home.orBrowse}>
          <SectionLabel>{dict.home.orBrowse}</SectionLabel>

          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {SECTION_LINKS.map(({ key, path }) => (
              <li key={key}>
                <Link href={`/${locale}${path}`} className="section-card group">
                  <span className="section-card__art" aria-hidden="true">
                    <GenerativeArt
                      seed={`section:${key}:${locale}`}
                      width={1000}
                      height={640}
                      density="compact"
                    />
                  </span>

                  <span className="section-card__body">
                    <span className="section-card__label">{dict.sections[key].label}</span>
                    <span className="section-card__description">
                      {dict.sections[key].description}
                    </span>
                    <span className="section-card__arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------- writing */}
        {posts.length > 0 && (
          <section className="mt-20" aria-label={dict.home.latestWriting}>
            <div className="flex items-end justify-between gap-4">
              <SectionLabel>{dict.home.latestWriting}</SectionLabel>
              <Link
                href={`/${locale}/blog`}
                className="shrink-0 text-xs font-semibold text-accent hover:underline"
              >
                {dict.home.viewAll}
              </Link>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} dict={dict} />
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------- work */}
        {projects.length > 0 && (
          <section className="mt-20" aria-label={dict.home.selectedWork}>
            <div className="flex items-end justify-between gap-4">
              <SectionLabel>{dict.home.selectedWork}</SectionLabel>
              <Link
                href={`/${locale}/projects`}
                className="shrink-0 text-xs font-semibold text-accent hover:underline"
              >
                {dict.home.viewAll}
              </Link>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
              ))}
            </div>
          </section>
        )}

        {/* -------------------------------------------------------- now */}
        <section className="mt-20" aria-label={dict.home.nowHeading}>
          <SectionLabel>{dict.home.nowHeading}</SectionLabel>

          <Link href={`/${locale}/now`} className="now-teaser group mt-6">
            <span className="now-teaser__art" aria-hidden="true">
              <GenerativeArt
                seed={`now-teaser:${locale}`}
                width={1200}
                height={420}
                density="compact"
              />
            </span>

            <span className="now-teaser__body">
              <span className="now-teaser__title">{dict.sections.now.label}</span>
              <span className="now-teaser__text">{dict.sections.now.description}</span>
            </span>

            <span className="now-teaser__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </section>
      </div>
    </>
  )
}
