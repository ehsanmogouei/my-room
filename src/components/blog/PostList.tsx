'use client'

import { useMemo, useState } from 'react'

import { PostCard } from '@/components/ui/PostCard'
import type { PostSummary } from '@/lib/content'
import type { Dictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Tag filtering happens in the browser.
 *
 * A `?tag=` query parameter would force the whole blog index to render on the
 * server on every request; with a personal site's worth of posts, filtering a
 * list that is already on the page is instant, keeps the route fully static,
 * and still works with JavaScript disabled (all posts simply show).
 */
export function PostList({
  posts,
  locale,
  dict,
}: {
  posts: PostSummary[]
  locale: Locale
  dict: Dictionary
}) {
  const [tag, setTag] = useState<string | null>(null)

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const post of posts) {
      for (const value of post.tags) counts.set(value, (counts.get(value) ?? 0) + 1)
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [posts])

  const visible = useMemo(
    () => (tag ? posts.filter((post) => post.tags.includes(tag)) : posts),
    [posts, tag],
  )

  if (posts.length === 0) {
    return <p className="py-16 text-center text-sm text-ink-muted">{dict.blog.empty}</p>
  }

  return (
    <>
      {tags.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTag(null)}
            aria-pressed={tag === null}
            className={cn('chip', tag === null && 'chip-active')}
          >
            {dict.common.allTags}
            <span className="tnum opacity-70">{posts.length}</span>
          </button>

          {tags.map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => setTag(name)}
              aria-pressed={tag === name}
              className={cn('chip', tag === name && 'chip-active')}
            >
              {name}
              <span className="tnum opacity-70">{count}</span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm font-semibold text-ink">{dict.common.noResults}</p>
          <p className="mt-1 text-xs text-ink-muted">{dict.common.noResultsHint}</p>
          <button type="button" onClick={() => setTag(null)} className="btn btn-ghost mt-4">
            {dict.blog.clearFilter}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </>
  )
}
