import { getGallery, getPosts, getProjects } from './content'
import type { Dictionary } from './dictionaries'
import { NAV_ITEMS, navHref } from './nav'
import type { SearchItem } from './search'
import type { Locale } from './types'

/**
 * Builds the command palette index on the server, so the client never has to
 * fetch content just to search it.
 */
export function buildSearchIndex(locale: Locale, dict: Dictionary): SearchItem[] {
  const items: SearchItem[] = []

  for (const nav of NAV_ITEMS) {
    items.push({
      id: `page-${nav.key}`,
      kind: 'page',
      title: dict.nav[nav.key],
      subtitle: pageSubtitle(nav.key, dict),
      href: navHref(locale, nav.path),
      keywords: `${nav.key} ${nav.path}`,
      locale,
    })
  }

  for (const post of getPosts(locale)) {
    items.push({
      id: `post-${post.slug}`,
      kind: 'post',
      title: post.frontmatter.title,
      subtitle: post.frontmatter.summary,
      href: navHref(locale, `/blog/${post.slug}`),
      keywords: [...(post.frontmatter.tags ?? []), post.frontmatter.date].join(' '),
      locale,
    })
  }

  for (const project of getProjects(locale)) {
    items.push({
      id: `project-${project.slug}`,
      kind: 'project',
      title: project.frontmatter.title,
      subtitle: project.frontmatter.summary,
      href: navHref(locale, `/projects/${project.slug}`),
      keywords: [...project.frontmatter.stack, project.frontmatter.year].join(' '),
      locale,
    })
  }

  for (const entry of getGallery()) {
    items.push({
      id: `gallery-${entry.id}`,
      kind: 'gallery',
      title: entry.title[locale],
      subtitle: entry.caption?.[locale] ?? entry.group[locale],
      href: navHref(locale, `/gallery#${entry.id}`),
      keywords: `${entry.kind} ${entry.group[locale]} ${entry.date ?? ''}`,
      locale,
    })
  }

  return items
}

function pageSubtitle(key: (typeof NAV_ITEMS)[number]['key'], dict: Dictionary): string {
  switch (key) {
    case 'projects':
      return dict.projects.subtitle
    case 'blog':
      return dict.blog.subtitle
    case 'gallery':
      return dict.gallery.subtitle
    case 'now':
      return dict.nowPage.subtitle
    case 'about':
      return dict.about.subtitle
    default:
      return dict.hero.cue
  }
}
