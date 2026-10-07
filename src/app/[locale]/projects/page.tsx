import type { Metadata } from 'next'

import { PageHeader } from '@/components/ui/PageHeader'
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
    <div className="container-page py-12">
      <PageHeader
        eyebrow={dict.nav.projects}
        title={dict.projects.title}
        subtitle={dict.projects.subtitle}
      />

      {projects.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-muted">{dict.projects.empty}</p>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </div>
  )
}
