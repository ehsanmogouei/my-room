import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'

import { gallery as gallerySource } from '@content/gallery'
import { links as linksSource } from '@content/links'
import { site } from '@content/site'

import type {
  Entry,
  GalleryItem,
  LinkItem,
  Locale,
  Post,
  PostFrontmatter,
  Project,
  ProjectFrontmatter,
} from './types'
import { estimateReadingMinutes } from './utils'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

/* -------------------------------------------------------------------------- */
/* Validation helpers                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Frontmatter mistakes are the single most likely thing to break this site
 * when you edit content, so every failure names the file and the field.
 */
class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`\n\n  ✖ Invalid content in ${path.relative(process.cwd(), file)}\n    ${message}\n`)
    this.name = 'ContentError'
  }
}

function requireString(
  data: Record<string, unknown>,
  field: string,
  file: string,
): string {
  const value = data[field]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ContentError(
      file,
      `Missing required field \`${field}\`. Add it to the frontmatter, for example:\n      ${field}: "..."`,
    )
  }
  return value.trim()
}

function optionalString(data: Record<string, unknown>, field: string): string | undefined {
  const value = data[field]
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

function optionalStringArray(data: Record<string, unknown>, field: string): string[] | undefined {
  const value = data[field]
  if (value === undefined || value === null) return undefined
  if (!Array.isArray(value)) {
    throw new ContentError(
      String(field),
      `\`${field}\` must be a list, for example:\n      ${field}:\n        - first\n        - second`,
    )
  }
  return value.map((item) => String(item))
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function requireDate(data: Record<string, unknown>, field: string, file: string): string {
  const raw = data[field]
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.toISOString().slice(0, 10)
  }
  const value = requireString(data, field, file)
  if (!DATE_PATTERN.test(value)) {
    throw new ContentError(
      file,
      `\`${field}\` must look like YYYY-MM-DD (got "${value}"). Remember to wrap it in quotes.`,
    )
  }
  return value
}

/* -------------------------------------------------------------------------- */
/* Frontmatter parsers                                                        */
/* -------------------------------------------------------------------------- */

function parsePost(file: string, data: Record<string, unknown>): PostFrontmatter {
  return {
    title: requireString(data, 'title', file),
    date: requireDate(data, 'date', file),
    summary: requireString(data, 'summary', file),
    tags: optionalStringArray(data, 'tags'),
    cover: optionalString(data, 'cover'),
    draft: data.draft === true,
  }
}

function parseProject(file: string, data: Record<string, unknown>): ProjectFrontmatter {
  const links = Array.isArray(data.links)
    ? (data.links as Array<Record<string, unknown>>).map((link, index) => ({
        label: requireString(link, 'label', `${file} → links[${index}]`),
        href: requireString(link, 'href', `${file} → links[${index}]`),
      }))
    : undefined

  return {
    title: requireString(data, 'title', file),
    year: String(data.year ?? '').trim() || requireString(data, 'year', file),
    summary: requireString(data, 'summary', file),
    stack: optionalStringArray(data, 'stack') ?? [],
    links,
    cover: optionalString(data, 'cover'),
    featured: data.featured === true,
    order: typeof data.order === 'number' ? data.order : 100,
    draft: data.draft === true,
  }
}

/* -------------------------------------------------------------------------- */
/* Directory reader                                                           */
/* -------------------------------------------------------------------------- */

function showDrafts(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_DRAFTS === '1' && process.env.NODE_ENV !== 'production'
}

function readCollection<T>(
  collection: 'posts' | 'projects',
  locale: Locale,
  parse: (file: string, data: Record<string, unknown>) => T & { draft?: boolean },
): Array<Entry<T>> {
  const dir = path.join(CONTENT_ROOT, collection, locale)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => {
      const file = path.join(dir, entry.name)
      const raw = fs.readFileSync(file, 'utf8')
      const { data, content } = matter(raw)

      const frontmatter = parse(file, data as Record<string, unknown>)
      if (frontmatter.draft && !showDrafts()) return null

      const slug = entry.name.replace(/\.mdx?$/, '')

      return {
        slug,
        locale,
        frontmatter: frontmatter as T,
        body: content,
        readingMinutes: estimateReadingMinutes(content, locale),
      } satisfies Entry<T>
    })
    .filter((entry): entry is Entry<T> => entry !== null)
}

/* -------------------------------------------------------------------------- */
/* Posts                                                                      */
/* -------------------------------------------------------------------------- */

export function getPosts(locale: Locale): Post[] {
  return readCollection<PostFrontmatter>('posts', locale, parsePost).sort((a, b) =>
    b.frontmatter.date.localeCompare(a.frontmatter.date),
  )
}

export function getPost(locale: Locale, slug: string): Post | undefined {
  return getPosts(locale).find((post) => post.slug === slug)
}

export function getPostSlugs(locale: Locale): string[] {
  return getPosts(locale).map((post) => post.slug)
}

export function getAllTags(locale: Locale): string[] {
  const tags = getPosts(locale).flatMap((post) => post.frontmatter.tags ?? [])
  return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b, locale))
}

export function getRelatedPosts(locale: Locale, slug: string, limit = 3): Post[] {
  const current = getPost(locale, slug)
  if (!current) return []

  const currentTags = new Set(current.frontmatter.tags ?? [])

  return getPosts(locale)
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: (post.frontmatter.tags ?? []).filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.post.frontmatter.date.localeCompare(a.post.frontmatter.date))
    .slice(0, limit)
    .map(({ post }) => post)
}

/**
 * The serialisable shape a post takes when it crosses into a client component.
 * Sending the whole `Post` would ship every article body to the browser just
 * to render a list of titles.
 */
export interface PostSummary {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  cover?: string
  readingMinutes: number
}

export function toPostSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.frontmatter.title,
    date: post.frontmatter.date,
    summary: post.frontmatter.summary,
    tags: post.frontmatter.tags ?? [],
    cover: post.frontmatter.cover,
    readingMinutes: post.readingMinutes,
  }
}

export function getPostSummaries(locale: Locale): PostSummary[] {
  return getPosts(locale).map(toPostSummary)
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export function getProjects(locale: Locale): Project[] {
  return readCollection<ProjectFrontmatter>('projects', locale, parseProject).sort((a, b) => {
    if (a.frontmatter.featured !== b.frontmatter.featured) {
      return a.frontmatter.featured ? -1 : 1
    }

    const orderA = a.frontmatter.order ?? 100
    const orderB = b.frontmatter.order ?? 100
    if (orderA !== orderB) return orderA - orderB

    return b.frontmatter.year.localeCompare(a.frontmatter.year)
  })
}

export function getProject(locale: Locale, slug: string): Project | undefined {
  return getProjects(locale).find((project) => project.slug === slug)
}

export function getProjectSlugs(locale: Locale): string[] {
  return getProjects(locale).map((project) => project.slug)
}

/* -------------------------------------------------------------------------- */
/* Now page                                                                   */
/* -------------------------------------------------------------------------- */

export interface NowDocument {
  body: string
  updated?: string
}

export function getNow(locale: Locale): NowDocument | undefined {
  const file = path.join(CONTENT_ROOT, 'now', `${locale}.md`)
  if (!fs.existsSync(file)) return undefined

  const { data, content } = matter(fs.readFileSync(file, 'utf8'))

  return {
    body: content,
    updated: typeof data.updated === 'string' ? data.updated : undefined,
  }
}

/* -------------------------------------------------------------------------- */
/* Gallery + links                                                            */
/* -------------------------------------------------------------------------- */

export function getGallery(): GalleryItem[] {
  return [...gallerySource].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

export function getGalleryGroups(locale: Locale): string[] {
  const groups = getGallery().map((item) => item.group[locale])
  return Array.from(new Set(groups))
}

export function getLinks(): LinkItem[] {
  return [...linksSource]
}

export function getLinkTags(locale: Locale): string[] {
  const tags = getLinks().map((item) => item.tag[locale])
  return Array.from(new Set(tags))
}

/* -------------------------------------------------------------------------- */
/* Re-exports so pages only import from one place                             */
/* -------------------------------------------------------------------------- */

export { site }
export type { GalleryItem, LinkItem, Post, Project }
