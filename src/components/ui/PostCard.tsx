import { Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { PostSummary } from '@/lib/content'
import type { Dictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/types'
import { formatDate } from '@/lib/utils'

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
  const { title, date, summary, tags, cover } = post

  return (
    <article
      className={
        featured
          ? 'card grid gap-0 overflow-hidden sm:grid-cols-[1.1fr_1fr]'
          : 'card group relative flex flex-col overflow-hidden'
      }
    >
      {cover && (
        <Link
          href={`/${locale}/blog/${post.slug}`}
          className={
            featured
              ? 'relative min-h-44 bg-surface-sunken'
              : 'relative aspect-[16/9] bg-surface-sunken'
          }
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      )}

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

        <h3 className={featured ? 'text-xl font-bold' : 'text-lg font-bold'}>
          <Link href={`/${locale}/blog/${post.slug}`} className="link-underline text-ink">
            {title}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-ink-muted">{summary}</p>

        {tags && tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {tags.map((tag) => (
              <li key={tag}>
                <Link href={`/${locale}/blog?tag=${encodeURIComponent(tag)}`} className="chip">
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
