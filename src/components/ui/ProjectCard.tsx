import Link from 'next/link'

import { GenerativeArt } from '@/components/art/GenerativeArt'
import type { Project } from '@/lib/content'
import type { Dictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/types'

/** A project card. The cover is generated from the project's slug. */
export function ProjectCard({
  project,
  locale,
  dict,
  index = 0,
}: {
  project: Project
  locale: Locale
  dict: Dictionary
  index?: number
}) {
  const { title, year, summary, stack, featured, links } = project.frontmatter

  return (
    <article className="card group" data-tilt data-reveal data-cursor="card">
      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="card-art aspect-[16/10]"
        tabIndex={-1}
        aria-hidden="true"
      >
        <GenerativeArt
          seed={`project:${project.slug}:${locale}`}
          width={1000}
          height={625}
          density="compact"
        />
      </Link>

      <div className="card-body">
        <div className="flex items-center justify-between gap-3">
          <span className="card-idx">
            {String(index + 1).padStart(2, '0')} · {year}
          </span>
          {featured && <span className="card-idx opacity-70">{dict.common.featured}</span>}
        </div>

        <h3>
          <Link href={`/${locale}/projects/${project.slug}`}>{title}</Link>
        </h3>

        <p>{summary}</p>

        <span className="card-meta mt-auto pt-5">
          {stack.slice(0, 4).map((item) => (
            <span key={item}>{item}</span>
          ))}
          {links?.[0] && (
            <a
              href={links[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--acc)]"
            >
              {links[0].label} →
            </a>
          )}
        </span>
      </div>
    </article>
  )
}
