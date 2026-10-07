import type { Dictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/types'

/** The six rooms of the site. `home` is the room itself. */
export const NAV_ITEMS = [
  { key: 'home', path: '' },
  { key: 'projects', path: '/projects' },
  { key: 'blog', path: '/blog' },
  { key: 'gallery', path: '/gallery' },
  { key: 'now', path: '/now' },
  { key: 'about', path: '/about' },
] as const

export type NavKey = (typeof NAV_ITEMS)[number]['key']

export function navHref(locale: Locale, path: string): string {
  return `/${locale}${path}`
}

export function navLabel(dict: Dictionary, key: NavKey): string {
  return dict.nav[key]
}

/** True when `pathname` sits inside the nav item's section. */
export function isNavActive(pathname: string, locale: Locale, path: string): boolean {
  const here = pathname.replace(/\/+$/, '') || `/${locale}`
  const target = navHref(locale, path).replace(/\/+$/, '')

  if (path === '') return here === target
  return here === target || here.startsWith(`${target}/`)
}
