import { ArrowUpRight, Star } from 'lucide-react'
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
}: {
  project: Project
  locale: Locale
  dict: Dictionary
}) {
  const { title, year, summary, stack, featured } = project.frontmatter

  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="art-frame aspect-[16/10]"
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

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-ink-faint">
          {featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent">
              <Star className="size-3" aria-hidden="true" />
              {dict.common.featured}
            </span>
          )}
          <span className="tnum">{year}</span>
        </div>

        <h3 className="text-lg font-bold">
          <Link href={`/${locale}/projects/${project.slug}`} className="link-underline text-ink">
            {title}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-ink-muted">{summary}</p>

        {stack.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {stack.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        )}

        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="mt-1 inline-flex items-center gap-1 self-start text-sm font-semibold text-accent"
        >
          {dict.common.readMore}
          <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
