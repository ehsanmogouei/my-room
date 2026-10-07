import GithubSlugger from 'github-slugger'

export interface TocEntry {
  id: string
  text: string
  depth: 2 | 3
}

/**
 * Extracts an in-page table of contents from raw MDX.
 *
 * Ids are produced with the same `github-slugger` version that `rehype-slug`
 * uses, so the links are guaranteed to match the rendered headings — including
 * for Persian titles.
 *
 * Strips fenced code blocks first so a `## heading` inside a code sample is
 * never picked up.
 */
export function extractToc(body: string, maxDepth: 2 | 3 = 3): TocEntry[] {
  const withoutCode = body.replace(/^```[\s\S]*?^```/gm, '').replace(/~~~[\s\S]*?~~~/g, '')

  const slugger = new GithubSlugger()
  const entries: TocEntry[] = []

  for (const line of withoutCode.split(/\r?\n/)) {
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue

    const depth = match[1].length as 2 | 3
    if (depth > maxDepth) continue

    // Drop inline markdown so "the `useMemo` hook" becomes "the useMemo hook".
    const text = match[2]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`~]/g, '')
      .trim()

    if (!text) continue

    entries.push({ id: slugger.slug(text), text, depth })
  }

  return entries
}
