import { Clock } from 'lucide-react'
import Link from 'next/link'

import { GenerativeArt } from '@/components/art/GenerativeArt'
import type { PostSummary } from '@/lib/content'
import type { Dictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'

/**
 * A post card.
 *
 * The cover is generated from the post's slug, so the same article shows the
 * same picture on the home page, on the blog index, in search results and in
 * the command palette — without an image file existing anywhere.
 */
export function PostCard({
  post,
  locale,
  dict,
  featured = false,
}: {
  post: PostSummary
  locale: Locale
  dict: Dictionary
  featured?: boolean
}) {
  const { title, date, summary, tags } = post

  return (
    <article className={cn('card group relative flex overflow-hidden', featured && 'sm:flex-row')}>
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className={cn('art-frame', featured ? 'sm:w-2/5' : 'aspect-[16/10]')}
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

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
          <time dateTime={date}>{formatDate(date, locale)}</time>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            <span className="tnum">{post.readingMinutes}</span>
            {dict.common.minutes}
          </span>
        </div>

        <h3 className={cn('font-bold', featured ? 'text-xl' : 'text-lg')}>
          <Link href={`/${locale}/blog/${post.slug}`} className="link-underline text-ink">
            {title}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-ink-muted">{summary}</p>

        {tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {tags.map((tag) => (
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
