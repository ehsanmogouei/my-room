import type { Metadata } from 'next'

import { PageHero } from '@/components/ui/PageHeader'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { getProjects } from '@/lib/content'
import { getDictionary } from '@/lib/dictionaries'
import { resolveLocale } from '@/lib/types'
import { truncate } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)

  return {
    title: dict.projects.title,
    description: truncate(dict.projects.subtitle, 160),
    alternates: { canonical: `/${locale}/projects` },
  }
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)
  const projects = getProjects(locale)

  return (
    <>
      <PageHero
        seed={`projects:${locale}`}
        eyebrow={dict.nav.projects}
        title={dict.projects.title}
        subtitle={dict.projects.subtitle}
        size="compact"
      />

      <div className="wrap band">
        {projects.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-muted">{dict.projects.empty}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
