import type { MetadataRoute } from 'next'

import { getPosts, getProjects } from '@/lib/content'
import { localeMeta, locales, type Locale } from '@/lib/types'
import { absoluteUrl } from '@/lib/utils'

const STATIC_PATHS = ['', '/projects', '/blog', '/gallery', '/now', '/about'] as const

/**
 * One entry per URL, with `alternates.languages` pointing at the translation
 * so search engines never see the two language trees as duplicates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date()
  const entries: MetadataRoute.Sitemap = []

  const languagesFor = (path: string) =>
    Object.fromEntries(
      locales.map((locale) => [localeMeta[locale].htmlLang, absoluteUrl(`/${locale}${path}`)]),
    )

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        lastModified: today,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: { languages: languagesFor(path) },
      })
    }
  }

  for (const locale of locales as readonly Locale[]) {
    for (const post of getPosts(locale)) {
      entries.push({
        url: absoluteUrl(`/${locale}/blog/${post.slug}`),
        lastModified: new Date(`${post.frontmatter.date}T00:00:00Z`),
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: { languages: languagesFor(`/blog/${post.slug}`) },
      })
    }

    for (const project of getProjects(locale)) {
      entries.push({
        url: absoluteUrl(`/${locale}/projects/${project.slug}`),
        lastModified: today,
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: { languages: languagesFor(`/projects/${project.slug}`) },
      })
    }
  }

  return entries
}
