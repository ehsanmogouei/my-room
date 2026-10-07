/**
 * Shared types for the whole site.
 * Content files in `content/` are typed against these, so a typo in a
 * frontmatter block becomes a build error instead of a silent bug.
 */

export const locales = ['fa', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fa'

/** A value that exists in every supported language. */
export type Localized<T = string> = Record<Locale, T>

export type Direction = 'rtl' | 'ltr'

export interface LocaleMeta {
  /** Two letter code, also the URL segment. */
  code: Locale
  /** Name of the language, written in that language. */
  label: string
  /** Short badge shown in the language switcher. */
  short: string
  dir: Direction
  /** BCP-47 tag used for `lang` attributes and `Intl` formatters. */
  htmlLang: string
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  fa: {
    code: 'fa',
    label: 'فارسی',
    short: 'FA',
    dir: 'rtl',
    htmlLang: 'fa-IR',
  },
  en: {
    code: 'en',
    label: 'English',
    short: 'EN',
    dir: 'ltr',
    htmlLang: 'en',
  },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

/** Narrows an unknown route segment to a locale, falling back to the default. */
export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale
}

export function dirOf(locale: Locale): Direction {
  return localeMeta[locale].dir
}

/* -------------------------------------------------------------------------- */
/* Content frontmatter                                                        */
/* -------------------------------------------------------------------------- */

export interface PostFrontmatter {
  title: string
  /** ISO date, `YYYY-MM-DD`. */
  date: string
  summary: string
  tags?: string[]
  /** Path under /public, e.g. `/gallery/desk.jpg`. */
  cover?: string
  draft?: boolean
}

export interface ProjectFrontmatter {
  title: string
  /** Free-form, e.g. `2025` or `2024 — 2025`. */
  year: string
  summary: string
  stack: string[]
  links?: Array<{ label: string; href: string }>
  cover?: string
  /** Featured projects float to the top of the list. */
  featured?: boolean
  /** Lower numbers sort first. Defaults to 100. */
  order?: number
  draft?: boolean
}

export interface Entry<TFrontmatter> {
  slug: string
  locale: Locale
  frontmatter: TFrontmatter
  /** Raw MDX body, without frontmatter. */
  body: string
  readingMinutes: number
}

export type Post = Entry<PostFrontmatter>
export type Project = Entry<ProjectFrontmatter>

/* -------------------------------------------------------------------------- */
/* Gallery + links                                                            */
/* -------------------------------------------------------------------------- */

export type GalleryKind = 'image' | 'video' | 'link'

export interface GalleryItem {
  id: string
  kind: GalleryKind
  /** For `image`/`video`: path under /public. For `link`: the URL. */
  src: string
  /** Poster image for videos, or preview for links. */
  poster?: string
  title: Localized
  caption?: Localized
  /** Free-form grouping label shown as a filter chip. */
  group: Localized
  date?: string
}

export interface LinkItem {
  id: string
  url: string
  title: Localized
  note?: Localized
  /** Short category, shown as a chip. */
  tag: Localized
}

/* -------------------------------------------------------------------------- */
/* Room                                                                       */
/* -------------------------------------------------------------------------- */

/** Every interactive object in the room maps to one of these. */
export type HotspotId =
  | 'desk'
  | 'bookshelf'
  | 'galleryWall'
  | 'window'
  | 'corkboard'
  | 'door'
  | 'lamp'

export interface Hotspot {
  id: HotspotId
  /** Route inside the current locale, e.g. `/projects`. */
  href: string
  /** World position of the floating marker. */
  position: [number, number, number]
  /** Accent colour used for the marker glow. */
  color: string
}
