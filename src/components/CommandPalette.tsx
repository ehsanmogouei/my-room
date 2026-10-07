'use client'

import { ArrowRight, CornerDownLeft, Languages, Moon, Search, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useTheme } from '@/components/ThemeProvider'
import { PALETTE_EVENT } from '@/lib/constants'
import type { Dictionary } from '@/lib/dictionaries'
import { searchItems, type SearchItem } from '@/lib/search'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/types'

const KIND_ORDER: SearchItem['kind'][] = ['action', 'page', 'project', 'post', 'gallery']

/**
 * Ctrl/⌘+K palette. Receives a pre-built index from the server layout and
 * filters it in memory — there is no search endpoint to keep alive.
 */
export function CommandPalette({
  items,
  dict,
  locale,
  otherLocale,
}: {
  items: SearchItem[]
  dict: Dictionary
  locale: Locale
  otherLocale: Locale
}) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  // The cursor is stored together with the query it belongs to, so a new
  // search starts at the top without needing an effect to reset it.
  const [cursorState, setCursorState] = useState({ key: '', index: 0 })
  const cursorKey = `${open ? 'open' : 'closed'}:${query}`
  const cursor = cursorState.key === cursorKey ? cursorState.index : 0

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  // The list depends on the current theme, so it is rebuilt when that flips.
  const allItems = useMemo<SearchItem[]>(() => {
    const actions: SearchItem[] = [
      {
        id: 'action-theme',
        kind: 'action',
        title: dict.palette.toggleTheme,
        subtitle: theme === 'night' ? dict.common.themeNight : dict.common.themeDay,
        href: '#',
        action: 'toggle-theme',
        keywords: 'theme dark light night day lamp',
      },
      {
        id: 'action-locale',
        kind: 'action',
        title: dict.palette.switchLanguage,
        subtitle: otherLocale === 'fa' ? 'فارسی' : 'English',
        href: '#',
        action: 'switch-locale',
        keywords: 'language locale translate',
      },
    ]

    return [...actions, ...items]
  }, [dict, items, otherLocale, theme])

  const results = useMemo(() => {
    const found = searchItems(allItems, query, 40)

    // Without a query, keep a sensible order: actions, pages, then content.
    if (!query.trim()) {
      return [...found].sort(
        (a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind),
      )
    }

    return found
  }, [allItems, query])

  const grouped = useMemo(() => {
    const groups = new Map<SearchItem['kind'], SearchItem[]>()
    for (const item of results) {
      const bucket = groups.get(item.kind)
      if (bucket) bucket.push(item)
      else groups.set(item.kind, [item])
    }
    return groups
  }, [results])

  /**
   * The grouped rows plus the flat index each row starts at. Precomputing the
   * offsets keeps the cursor maths out of the render body, where mutating a
   * counter would be a side effect during render.
   */
  const sections = useMemo(() => {
    const present = KIND_ORDER.map((kind) => ({ kind, items: grouped.get(kind) ?? [] })).filter(
      (section) => section.items.length > 0,
    )

    const offsets = present.reduce<number[]>(
      (accumulator, section) => [
        ...accumulator,
        (accumulator.at(-1) ?? 0) + section.items.length,
      ],
      [0],
    )

    return present.map((section, index) => ({ ...section, start: offsets[index] }))
  }, [grouped])

  const setCursor = useCallback(
    (index: number) => setCursorState({ key: cursorKey, index }),
    [cursorKey],
  )

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(PALETTE_EVENT, onOpen)
    return () => window.removeEventListener(PALETTE_EVENT, onOpen)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isPaletteCombo =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'

      if (isPaletteCombo) {
        event.preventDefault()
        setOpen((value) => !value)
        return
      }

      if (event.key === 'Escape' && open) {
        event.preventDefault()
        close()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  useEffect(() => {
    if (open) {
      // Focus after the browser has painted the panel.
      const id = window.requestAnimationFrame(() => inputRef.current?.focus())
      document.body.style.overflow = 'hidden'
      return () => {
        window.cancelAnimationFrame(id)
        document.body.style.overflow = ''
      }
    }
  }, [open])

  // Keep the highlighted row inside the scroll viewport.
  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
    node?.scrollIntoView({ block: 'nearest' })
  }, [cursor, results])

  const runItem = useCallback(
    (item: SearchItem) => {
      close()

      if (item.action === 'toggle-theme') {
        toggleTheme()
        return
      }

      if (item.action === 'switch-locale') {
        const path = window.location.pathname.replace(
          new RegExp(`^/${locale}(?=/|$)`),
          '',
        )
        router.push(`/${otherLocale}${path}`)
        return
      }

      router.push(item.href)
    },
    [close, locale, otherLocale, router, toggleTheme],
  )

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setCursor(results.length ? (cursor + 1) % results.length : 0)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setCursor(results.length ? (cursor - 1 + results.length) % results.length : 0)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = results[cursor]
      if (item) runItem(item)
    } else if (event.key === 'Tab') {
      event.preventDefault()
    }
  }

  if (!open) return null

  const kindLabels: Record<SearchItem['kind'], string> = {
    action: dict.palette.actions,
    page: dict.palette.pages,
    post: dict.palette.posts,
    project: dict.palette.projects,
    gallery: dict.palette.gallery,
  }

  // Flat index for the cursor lives in `sections` above; nothing to track here.

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label={dict.palette.open}
    >
      <button
        type="button"
        aria-label={dict.common.close}
        onClick={close}
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-subtle bg-surface-raised shadow-lift">
        <div className="flex items-center gap-2.5 border-b border-subtle px-4 py-3">
          <Search className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={dict.palette.placeholder}
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            autoComplete="off"
            spellCheck={false}
            aria-label={dict.palette.placeholder}
          />
          <kbd className="kbd">esc</kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-ink-muted">
              {dict.palette.noMatches}
            </p>
          )}

          {sections.map(({ kind, items, start }) => (
            <div key={kind} className="mb-1">
              <p className="px-3 pt-2 pb-1 text-[0.68rem] font-semibold tracking-wide text-ink-faint uppercase">
                {kindLabels[kind]}
              </p>

              {items.map((item, offset) => {
                const index = start + offset
                const active = index === cursor

                return (
                  <button
                    key={item.id}
                    type="button"
                    data-active={active}
                    onMouseMove={() => setCursor(index)}
                    onClick={() => runItem(item)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors',
                      active ? 'bg-accent-soft text-ink' : 'text-ink-muted hover:bg-surface-sunken',
                    )}
                  >
                    <span className="shrink-0 text-ink-faint" aria-hidden="true">
                      {item.action === 'toggle-theme' ? (
                        theme === 'night' ? (
                          <Moon className="size-4" />
                        ) : (
                          <Sun className="size-4" />
                        )
                      ) : item.action === 'switch-locale' ? (
                        <Languages className="size-4" />
                      ) : (
                        <ArrowRight className="size-4 rtl:rotate-180" />
                      )}
                    </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{item.title}</span>
                        {item.subtitle && (
                          <span className="block truncate text-xs text-ink-faint">
                            {item.subtitle}
                          </span>
                        )}
                      </span>

                      {active && (
                        <CornerDownLeft className="size-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                      )}
                    </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-subtle bg-surface-sunken px-4 py-2.5 text-[0.7rem] text-ink-faint">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd>
            {dict.palette.hintNavigate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="kbd">↵</kbd>
            {dict.palette.hintSelect}
          </span>
        </div>
      </div>
    </div>
  )
}
