'use client'

import { ChevronLeft, ChevronRight, ExternalLink, Play, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { Dictionary } from '@/lib/dictionaries'
import type { GalleryItem, Locale } from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'

/**
 * The gallery wall as a grid, with a lightbox.
 *
 * Items are handed down from the server already sorted and localised, so this
 * component only owns the two pieces of state a visitor can change: which
 * group is filtered, and which frame is open.
 */
export function GalleryGrid({
  items,
  locale,
  dict,
}: {
  items: GalleryItem[]
  locale: Locale
  dict: Dictionary
}) {
  const [group, setGroup] = useState<string | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const groups = useMemo(() => {
    const seen = new Set<string>()
    for (const item of items) seen.add(item.group[locale])
    return Array.from(seen)
  }, [items, locale])

  const visible = useMemo(
    () => (group ? items.filter((item) => item.group[locale] === group) : items),
    [items, group, locale],
  )

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current
        const next = (current + direction + visible.length) % visible.length
        return next
      })
    },
    [visible.length],
  )

  useEffect(() => {
    if (openIndex === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      // In RTL the arrow keys should follow reading order, not screen order.
      if (event.key === 'ArrowRight') step(locale === 'fa' ? -1 : 1)
      if (event.key === 'ArrowLeft') step(locale === 'fa' ? 1 : -1)
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [openIndex, close, step, locale])

  const active = openIndex === null ? null : visible[openIndex]

  return (
    <>
      {groups.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setGroup(null)}
            className={cn('chip', group === null && 'chip-active')}
            aria-pressed={group === null}
          >
            {dict.gallery.all}
          </button>
          {groups.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setGroup(name)}
              className={cn('chip', group === name && 'chip-active')}
              aria-pressed={group === name}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-muted">{dict.gallery.empty}</p>
      ) : (
        <ul className="mt-6 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {visible.map((item, index) => {
            // Link items point `src` at an external URL, so their preview has
            // to come from `poster` — feeding the URL to next/image would fail
            // the build-time hostname check.
            const preview = item.kind === 'image' ? item.src : item.poster

            const card = (
              <>
                <span className="relative block aspect-[4/3] overflow-hidden bg-surface-sunken">
                  {preview ? (
                    <Image
                      src={preview}
                      alt={item.title[locale]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-ink-faint">
                      <ExternalLink className="size-6" aria-hidden="true" />
                    </span>
                  )}

                  {item.kind === 'video' && (
                    <span className="absolute inset-0 grid place-items-center bg-black/25">
                      <span className="grid size-11 place-items-center rounded-full bg-white/90 text-black">
                        <Play className="size-4 fill-current" aria-hidden="true" />
                      </span>
                    </span>
                  )}

                  {item.kind === 'link' && (
                    <span className="absolute end-2 top-2 grid size-7 place-items-center rounded-full bg-black/55 text-white">
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </span>
                  )}
                </span>

                <span className="block p-4">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold text-ink">{item.title[locale]}</span>
                    {item.date && (
                      <span className="shrink-0 text-[0.68rem] text-ink-faint">
                        {formatDate(item.date, locale, { year: '2-digit', month: 'short' })}
                      </span>
                    )}
                  </span>
                  {item.caption && (
                    <span className="mt-1.5 block text-xs leading-relaxed text-ink-muted">
                      {item.caption[locale]}
                    </span>
                  )}
                  <span className="mt-2 inline-block text-[0.68rem] text-ink-faint">
                    {item.group[locale]}
                  </span>
                </span>
              </>
            )

            return (
              <li key={item.id} id={item.id} className="mb-4 break-inside-avoid">
                {item.kind === 'link' ? (
                  <a
                    href={item.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card group block overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    {card}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    className="card group block w-full overflow-hidden text-start transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                    aria-label={`${item.title[locale]} — ${dict.common.openLink}`}
                  >
                    {card}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {/* ------------------------------------------------------- lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title[locale]}
          className="fixed inset-0 z-[80] grid grid-rows-[auto_1fr_auto] bg-black/88 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4 p-4 text-white/85">
            <p className="text-sm font-semibold">{active.title[locale]}</p>
            <button
              type="button"
              onClick={close}
              aria-label={dict.common.close}
              className="grid size-9 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex min-h-0 items-center justify-center px-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={dict.palette.hintNavigate}
              className="absolute start-3 z-10 grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="size-5 rtl:-scale-x-100" aria-hidden="true" />
            </button>

            {active.kind === 'video' ? (
              <video
                src={active.src}
                poster={active.poster}
                controls
                autoPlay
                className="max-h-full max-w-full rounded-xl"
              />
            ) : (
              <div className="relative h-full w-full max-w-4xl">
                <Image
                  src={active.src}
                  alt={active.title[locale]}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => step(1)}
              aria-label={dict.palette.hintNavigate}
              className="absolute end-3 z-10 grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <ChevronRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
            </button>
          </div>

          <div className="p-5 text-center text-xs text-white/70">
            {active.caption && <p className="mx-auto max-w-2xl">{active.caption[locale]}</p>}
            <p className="mt-2 tnum">
              {(openIndex ?? 0) + 1} / {visible.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
