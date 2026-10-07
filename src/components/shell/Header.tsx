'use client'

import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ThemeToggle } from '@/components/shell/ThemeToggle'
import { useTheme } from '@/components/ThemeProvider'
import type { Dictionary } from '@/lib/dictionaries'
import { PALETTE_EVENT } from '@/lib/constants'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

import { LocaleSwitcher } from './LocaleSwitcher'

const NAV_KEYS = ['home', 'projects', 'blog', 'gallery', 'now', 'about'] as const

const NAV_HREFS: Record<(typeof NAV_KEYS)[number], string> = {
  home: '',
  projects: '/projects',
  blog: '/blog',
  gallery: '/gallery',
  now: '/now',
  about: '/about',
}

export function Header({
  locale,
  dict,
  siteName,
}: {
  locale: Locale
  dict: Dictionary
  siteName: string
}) {
  const pathname = usePathname() || `/${locale}`

  // The sheet is open for one specific path, so navigating closes it without
  // an effect: the derived value simply stops matching.
  const [openFor, setOpenFor] = useState<string | null>(null)
  const open = openFor === pathname

  const toggleSheet = () => setOpenFor(open ? null : pathname)

  const { theme, ready } = useTheme()

  // Lock scroll while the sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const items = NAV_KEYS.map((key) => ({
    key,
    label: dict.nav[key],
    href: `/${locale}${NAV_HREFS[key]}`,
    // `/fa` should only be active on the home page, not on every child route.
    exact: NAV_HREFS[key] === '',
    path: NAV_HREFS[key],
  }))

  const isActive = (item: (typeof items)[number]) => {
    const here = pathname.replace(/\/+$/, '') || `/${locale}`
    const target = item.href.replace(/\/+$/, '')
    return item.exact ? here === target : here === target || here.startsWith(`${target}/`)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-subtle bg-surface/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-3">
        {/* Room mark */}
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2.5 font-bold text-ink"
          aria-label={siteName}
        >
          <span
            className="relative grid size-8 place-items-center rounded-lg border border-subtle bg-surface-sunken transition-colors group-hover:border-accent"
            aria-hidden="true"
          >
            <span className="absolute inset-y-1.5 start-1.5 w-[3px] rounded-full bg-accent transition-all group-hover:w-[5px]" />
            <span className="absolute inset-y-1.5 end-1.5 w-2 rounded-sm bg-accent/25" />
          </span>
          <span className="hidden text-[0.95rem] sm:inline">{siteName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="ms-4 hidden items-center gap-0.5 md:flex" aria-label={siteName}>
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive(item) ? 'page' : undefined}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm transition-colors',
                isActive(item)
                  ? 'bg-accent-soft font-semibold text-accent'
                  : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent(PALETTE_EVENT))}
            className="hidden items-center gap-2 rounded-full border border-subtle py-1.5 ps-3 pe-2 text-xs text-ink-faint transition-colors hover:border-strong hover:text-ink-muted sm:inline-flex"
            aria-label={dict.palette.open}
          >
            <Search className="size-3.5" aria-hidden="true" />
            <span>{dict.common.search}</span>
            <kbd className="kbd">⌘K</kbd>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent(PALETTE_EVENT))}
            className="inline-flex size-9 items-center justify-center rounded-full border border-subtle text-ink-muted transition-colors hover:border-strong hover:text-ink sm:hidden"
            aria-label={dict.palette.open}
          >
            <Search className="size-4" aria-hidden="true" />
          </button>

          <ThemeToggle labels={{ theme: dict.common.theme, day: dict.common.themeDay, night: dict.common.themeNight }} />

          <LocaleSwitcher current={locale} label={dict.common.language} className="hidden sm:inline-flex" />

          <button
            type="button"
            onClick={toggleSheet}
            className="inline-flex size-9 items-center justify-center rounded-full border border-subtle text-ink-muted transition-colors hover:border-strong hover:text-ink md:hidden"
            aria-label={open ? dict.common.close : dict.common.menu}
            aria-expanded={open}
          >
            {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="border-t border-subtle bg-surface md:hidden">
          <nav className="container-page grid gap-1 py-4" aria-label={dict.common.menu}>
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive(item) ? 'page' : undefined}
                className={cn(
                  'rounded-xl px-3 py-2.5 text-sm transition-colors',
                  isActive(item)
                    ? 'bg-accent-soft font-semibold text-accent'
                    : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="container-page flex items-center justify-between gap-3 border-t border-subtle py-4">
            <LocaleSwitcher current={locale} label={dict.common.language} />
            <span className="inline-flex items-center gap-2 text-xs text-ink-faint">
              {ready && theme === 'night' ? (
                <Moon className="size-3.5" aria-hidden="true" />
              ) : (
                <Sun className="size-3.5" aria-hidden="true" />
              )}
              {dict.common.theme}
            </span>
          </div>
        </div>
      )}
    </header>
  )
}
