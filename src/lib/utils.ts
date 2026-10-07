import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

import { localeMeta, type Locale } from './types'

/**
 * tailwind-merge cannot know about the design tokens declared in
 * `globals.css`, so they are registered here. Without this, `cn('p-4', 'p-6')`
 * still works but `cn('text-ink', 'text-accent')` would keep both classes.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        'surface',
        'surface-raised',
        'surface-sunken',
        'surface-inverse',
        'subtle',
        'strong',
        'ink',
        'ink-muted',
        'ink-faint',
        'accent',
        'accent-hover',
        'accent-contrast',
        'accent-soft',
      ],
    },
  },
})

/** Tailwind-aware class combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** `2025-03-04` → `۴ اسفند ۱۴۰۳` / `March 4, 2025`. */
export function formatDate(iso: string, locale: Locale, opts?: Intl.DateTimeFormatOptions) {
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso

  return new Intl.DateTimeFormat(localeMeta[locale].htmlLang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
    ...opts,
  }).format(date)
}

/** Machine-readable form for `<time dateTime>` and feeds. */
export function toIsoDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? iso : date.toISOString()
}

/**
 * Rough reading time. Persian script is denser per word, so it gets a
 * slightly lower words-per-minute budget than Latin text.
 */
export function estimateReadingMinutes(body: string, locale: Locale): number {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`~[\]()!-]/g, ' ')

  const words = text.split(/\s+/).filter(Boolean).length
  const wpm = locale === 'fa' ? 190 : 220

  return Math.max(1, Math.round(words / wpm))
}

/**
 * Build an absolute URL from the configured site origin.
 * Falls back to Render's own URL, then to localhost during development.
 */
export function absoluteUrl(path = '/'): string {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    'http://localhost:3000'

  return `${origin.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

/** Trim a string to a maximum length without cutting a word in half. */
export function truncate(value: string, max = 160): string {
  if (value.length <= max) return value
  const cut = value.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max).trimEnd()}…`
}

/** Turn a title into a URL-safe slug (handles Persian by keeping letters). */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Unique, stable list of strings. */
export function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values))
}
