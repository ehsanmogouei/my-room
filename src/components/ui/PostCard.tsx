import Link from 'next/link'

import { GenerativeArt } from '@/components/art/GenerativeArt'
import type { PostSummary } from '@/lib/content'
import type { Dictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/types'
import { formatDate } from '@/lib/utils'

/**
 * A post card.
 *
 * The cover is generated from the post's slug, so the same article shows the
 * same picture on the index, above the article, in search results and in the
 * command palette — without an image file existing anywhere.
 */
export function PostCard({
  post,
  locale,
  dict,
  index = 0,
}: {
  post: PostSummary
  locale: Locale
  dict: Dictionary
  index?: number
}) {
  return (
    <article className="card group" data-tilt data-reveal data-cursor="card">
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="card-art aspect-[16/10]"
        tabIndex={-1}
        aria-hidden="true"
      >
        <GenerativeArt
          seed={`post:${post.slug}:${locale}`}
          width={1000}
          height={625}
          density="compact"
        />
      </Link>

      <div className="card-body">
        <div className="flex items-center justify-between gap-3">
          <span className="card-idx">
            {post.date.slice(0, 7)} · {post.readingMinutes}
            {dict.common.minutes}
          </span>
          {index > 0 && (
            <span className="card-idx opacity-60">{String(index).padStart(2, '0')}</span>
          )}
        </div>

        <h3>
          <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p>{post.summary}</p>

        {post.tags.length > 0 && (
          <ul className="chip-strip mt-auto pt-5">
            {post.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

/** A compact one-line variant used in date-sorted lists. */
export function PostRow({
  post,
  locale,
  index,
}: {
  post: PostSummary
  locale: Locale
  index: number
}) {
  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="row" data-cursor="link">
      <span className="row-idx">{String(index + 1).padStart(2, '0')}</span>
      <span>
        <span className="row-title">{post.title}</span>
        <span className="row-sub">{post.summary}</span>
      </span>
      <span className="row-side">
        {formatDate(post.date, locale, { year: 'numeric', month: 'short' })}
      </span>
    </Link>
  )
}
