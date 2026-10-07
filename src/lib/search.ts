import type { Locale } from './types'

/**
 * A single entry in the command palette. The index is built on the server
 * from real content and handed to the client component as props, so the
 * palette never needs a search API or a client-side content copy.
 */
export interface SearchItem {
  id: string
  kind: 'page' | 'post' | 'project' | 'gallery' | 'action'
  title: string
  subtitle?: string
  href: string
  /** Extra text that should match but is not displayed. */
  keywords?: string
  /** Actions are executed instead of navigated to. */
  action?: 'toggle-theme' | 'switch-locale'
  locale?: Locale
}

/**
 * Cheap, predictable scorer. Good enough for a personal site's worth of
 * content, and it never surprises the visitor with fuzzy nonsense.
 */
export function scoreItem(item: SearchItem, query: string): number {
  if (!query) return 1

  const needle = query.trim().toLowerCase()
  if (!needle) return 1

  const title = item.title.toLowerCase()
  const subtitle = (item.subtitle ?? '').toLowerCase()
  const keywords = (item.keywords ?? '').toLowerCase()

  if (title === needle) return 100
  if (title.startsWith(needle)) return 80
  if (title.includes(needle)) return 60
  if (subtitle.includes(needle)) return 35
  if (keywords.includes(needle)) return 20

  // Fall back to a per-word match so "css layout" finds "Every Layout".
  const words = needle.split(/\s+/).filter(Boolean)
  if (words.length > 1) {
    const haystack = `${title} ${subtitle} ${keywords}`
    const hits = words.filter((word) => haystack.includes(word)).length
    if (hits === words.length) return 15
    if (hits > 0) return hits * 4
  }

  return 0
}

export function searchItems(items: SearchItem[], query: string, limit = 12): SearchItem[] {
  return items
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item)
}
