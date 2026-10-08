import type { Metadata } from 'next'
import Link from 'next/link'

import { SplitText } from '@/components/chrome/SplitText'
import { ProjectCard } from '@/components/ui/ProjectCard'
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

const SECTION_LINKS: Array<{ key: SectionKey; path: string; art: string }> = [
  { key: 'work', path: '/projects', art: 'coral' },
  { key: 'writing', path: '/blog', art: 'violet' },
  { key: 'frames', path: '/gallery', art: 'cyan' },
  { key: 'now', path: '/now', art: 'lime' },
]

/** The ticker is built from real counts, not decoration. */
function tickerUnits(counts: { posts: number; projects: number; frames: number }) {
  return [
    `${counts.posts} writing`,
    '\u25C6',
    `${counts.projects} projects`,
    '\u25C6',
    `${counts.frames} frames`,
    '\u25C6',
    '0 image files',
    '\u25C6',
    'generated imagery',
    '\u25C6',
    'fa / en',
    '\u25C6',
    'Next.js \u00B7 MDX \u00B7 Tailwind',
    '\u25C6',
    'RTL native',
    '\u25C6',
    'no database',
    '\u25C6',
  ]
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)

  const allPosts = getPostSummaries(locale)
  const allProjects = getProjects(locale)
  const frames = getGallery()

  const posts = allPosts.slice(0, 4)
  const projects = allProjects.slice(0, 3)

  const counts = {
    posts: allPosts.length,
    projects: allProjects.length,
    frames: frames.length,
  }

  // Two-line hero: the first word solid, the rest outlined.
  const nameParts = site.name[locale].split(/\s+/)
  const heroFirst = nameParts[0] ?? site.name[locale]
  const heroSecond = nameParts.slice(1).join(' ')

  const stats = [
    { value: counts.posts, pad: 2, suffix: '', label: dict.hero.stats.posts },
    { value: counts.projects, pad: 2, suffix: '', label: dict.hero.stats.projects },
    { value: counts.frames, pad: 2, suffix: '', label: dict.hero.stats.frames },
    { value: 2, pad: 1, suffix: '', label: locale === 'fa' ? 'زبان' : 'languages' },
  ]

  const units = tickerUnits(counts)

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="hero" id="top">
        <div className="hero-inner">
          <p className="kicker">
            <span className="pulse" />
            {dict.hero.eyebrow} · {site.location?.[locale] ?? dict.hero.cue}
          </p>

          <h1 className="hero-title">
            <span className="line">
              <SplitText className="w1" text={heroFirst} />
            </span>
            {heroSecond && (
              <span className="line">
                <SplitText className="w2" text={heroSecond} />
              </span>
            )}
          </h1>

          <p className="hero-sub">
            {site.bio[locale].split('.')[0]}
            <span className="hl"> {site.tagline[locale]}</span>
          </p>

          <div className="hero-actions">
            <Link
              href={`/${locale}/projects`}
              className="btn btn-primary"
              data-magnetic
              data-cursor="link"
            >
              <span>{dict.sections.work.label}</span>
              <Arrow />
            </Link>

            <Link
              href={`/${locale}/blog`}
              className="btn btn-ghost"
              data-magnetic
              data-cursor="link"
            >
              {dict.sections.writing.label}
            </Link>
          </div>

          <div className="hero-meta">
            <span>
              <i>◆</i> generated imagery
            </span>
            <span>
              <i>◆</i> 0 bytes of images
            </span>
            <span>
              <i>◆</i> {locale === 'fa' ? 'راست‌به‌چپ' : 'RTL native'}
            </span>
          </div>
        </div>

        <a className="scroll-cue" href="#index" data-cursor="link">
          <span>Scroll</span>
          <i />
        </a>
      </section>

      {/* ---------------------------------------------------------- ticker */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-row">
          {[0, 1].map((pass) => (
            <span key={pass} className="contents">
              {units.map((unit, index) =>
                unit === '\u25C6' ? (
                  <b key={`${pass}-${index}`} className="px-0">
                    {unit}
                  </b>
                ) : (
                  <span key={`${pass}-${index}`}>{unit}</span>
                ),
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------- index */}
      <section className="band" id="index">
        <div className="sec-head" data-reveal>
          <span className="sec-num">01</span>
          <span>{dict.home.orBrowse}</span>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SECTION_LINKS.map(({ key, path }, index) => (
            <Link
              key={key}
              href={`/${locale}${path}`}
              className="card group"
              data-tilt
              data-reveal
              data-cursor="card"
            >
              <div className="card-body">
                <span className="card-idx">{String(index + 1).padStart(2, '0')}</span>
                <h3>{dict.sections[key].label}</h3>
                <p>{dict.sections[key].description}</p>
                <span className="card-meta">
                  <span>{'\u2192'}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- ledger */}
      {posts.length > 0 && (
        <section className="band">
          <div className="sec-head" data-reveal>
            <span className="sec-num">02</span>
            <span>{dict.home.latestWriting}</span>
          </div>

          <div className="ledger mt-10" data-reveal>
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="row"
                data-cursor="link"
              >
                <span className="row-idx">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="row-title">{post.title}</span>
                  <span className="row-sub">{post.summary}</span>
                </span>
                <span className="row-side">
                  {post.date.slice(0, 7)} · {post.readingMinutes}
                  {dict.common.minutes}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Link href={`/${locale}/blog`} className="btn btn-ghost btn-sm" data-cursor="link">
              {dict.home.viewAll}
            </Link>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ work */}
      {projects.length > 0 && (
        <section className="band">
          <div className="sec-head" data-reveal>
            <span className="sec-num">03</span>
            <span>{dict.home.selectedWork}</span>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- stats */}
      <section className="band">
        <div className="sec-head" data-reveal>
          <span className="sec-num">04</span>
          <span>{dict.home.nowHeading}</span>
        </div>

        <div className="stats" data-reveal>
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <b data-count={stat.value} data-pad={stat.pad} data-suffix={stat.suffix}>
                {stat.value}
              </b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="band pb-32 text-center">
        <p className="kicker mx-auto">
          <span className="pulse" />
          {site.email}
        </p>

        <h2 className="sec-title mx-auto mt-8" data-split>
          <SplitText text={dict.about.getInTouch.toUpperCase()} />
        </h2>

        <a
          className="magnet-link mt-8 inline-block font-mono text-sm tracking-[0.1em] text-[var(--dim)]"
          href={`mailto:${site.email}`}
          data-magnetic
          data-cursor="link"
        >
          {site.email}
        </a>
      </section>
    </>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M2 8h11M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
