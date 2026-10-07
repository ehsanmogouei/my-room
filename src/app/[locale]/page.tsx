import type { Metadata } from 'next'
import Link from 'next/link'

import { RoomExperience } from '@/components/room/RoomExperience'
import { PostCard } from '@/components/ui/PostCard'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { SectionLabel } from '@/components/ui/PageHeader'
import { site } from '@content/site'
import { getPostSummaries, getProjects } from '@/lib/content'
import { getDictionary } from '@/lib/dictionaries'
import { resolveLocale } from '@/lib/types'
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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)

  const posts = getPostSummaries(locale).slice(0, 3)
  const projects = getProjects(locale).slice(0, 3)

  return (
    <div className="container-page pb-16">
      {/* ------------------------------------------------------------ room */}
      <section className="pt-6 sm:pt-8" aria-label={dict.room.title}>
        <RoomExperience
          locale={locale}
          dict={dict}
          siteName={site.name[locale]}
          tagline={site.tagline[locale]}
        />
      </section>

      {/* --------------------------------------------------- direct routes */}
      <nav aria-label={dict.home.orBrowse} className="mt-12">
        <SectionLabel>{dict.home.orBrowse}</SectionLabel>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {(
            [
              ['projects', dict.nav.projects],
              ['blog', dict.nav.blog],
              ['gallery', dict.nav.gallery],
            ] as const
          ).map(([path, label]) => (
            <li key={path}>
              <Link
                href={`/${locale}/${path}`}
                className="card flex items-center justify-between gap-4 px-5 py-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="font-semibold text-ink">{label}</span>
                <span className="text-accent" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ---------------------------------------------------------- writing */}
      {posts.length > 0 && (
        <section className="mt-16" aria-label={dict.home.latestWriting}>
          <div className="flex items-end justify-between gap-4">
            <SectionLabel>{dict.home.latestWriting}</SectionLabel>
            <Link
              href={`/${locale}/blog`}
              className="shrink-0 text-xs font-semibold text-accent hover:underline"
            >
              {dict.home.viewAll}
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- work */}
      {projects.length > 0 && (
        <section className="mt-16" aria-label={dict.home.selectedWork}>
          <div className="flex items-end justify-between gap-4">
            <SectionLabel>{dict.home.selectedWork}</SectionLabel>
            <Link
              href={`/${locale}/projects`}
              className="shrink-0 text-xs font-semibold text-accent hover:underline"
            >
              {dict.home.viewAll}
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- now */}
      <section className="mt-16" aria-label={dict.home.nowHeading}>
        <SectionLabel>{dict.home.nowHeading}</SectionLabel>
        <Link
          href={`/${locale}/now`}
          className="card mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2 px-6 py-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span className="text-sm text-ink-muted">{site.tagline[locale]}</span>
          <span className="text-xs font-semibold text-accent">{dict.home.viewAll} →</span>
        </Link>
      </section>
    </div>
  )
}
