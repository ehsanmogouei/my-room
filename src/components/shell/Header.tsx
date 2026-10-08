'use client'

import { Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { PALETTE_EVENT } from '@/lib/constants'
import type { Dictionary } from '@/lib/dictionaries'
import { NAV_ITEMS, navHref } from '@/lib/nav'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

/** Site mark: a rotating diamond outline with a solid lime core. */
function Mark() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
      <path d="M16 4l10 12-10 12L6 16z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 11l4.5 5-4.5 5-4.5-5z" fill="var(--acc)" />
    </svg>
  )
}

export function Header({
  locale,
  dict,
  siteName,
  handle,
}: {
  locale: Locale
  dict: Dictionary
  siteName: string
  handle: string
}) {
  const pathname = usePathname() || `/${locale}`
  const [openFor, setOpenFor] = useState<string | null>(null)
  const open = openFor === pathname

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const [first, ...rest] = Array.from(siteName)
  const tail = rest.join('')

  const isActive = (path: string) => {
    const here = pathname.replace(/\/+$/, '') || `/${locale}`
    const target = navHref(locale, path).replace(/\/+$/, '')
    return path === '' ? here === target : here === target || here.startsWith(`${target}/`)
  }

  return (
    <>
      <header className="nav" id="nav">
        <div className="nav-inner">
          <Link href={`/${locale}`} className="brand" data-cursor="link">
            <Mark />
            <span>
              {first}
              <b>{tail.toUpperCase()}</b>
            </span>
          </Link>

          <nav className="nav-links" aria-label={siteName}>
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.key}
                href={navHref(locale, item.path)}
                aria-current={isActive(item.path) ? 'page' : undefined}
                data-cursor="link"
              >
                <em>{String(index + 1).padStart(2, '0')}</em>
                {dict.nav[item.key]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="icon-btn"
              onClick={() => window.dispatchEvent(new CustomEvent(PALETTE_EVENT))}
              aria-label={dict.palette.open}
              data-cursor="link"
            >
              <Search className="size-4" aria-hidden="true" />
            </button>

            <Link
              href={`/${locale}/about`}
              className="btn btn-primary btn-sm nav-cta hidden sm:inline-flex"
              data-magnetic
              data-cursor="link"
            >
              {dict.about.getInTouch}
            </Link>

            <button
              type="button"
              className="icon-btn lg:hidden"
              onClick={() => setOpenFor(open ? null : pathname)}
              aria-label={open ? dict.common.close : dict.common.menu}
              aria-expanded={open}
            >
              {open ? (
                <X className="size-4" aria-hidden="true" />
              ) : (
                <Menu className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto pt-20 pb-32"
          style={{ background: 'color-mix(in oklab, var(--bg) 96%, transparent)' }}
        >
          <nav className="wrap grid gap-1" aria-label={dict.common.menu}>
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.key}
                href={navHref(locale, item.path)}
                className={cn(
                  'flex items-baseline gap-4 border-b py-4 text-2xl font-semibold',
                  isActive(item.path) ? 'text-[var(--acc)]' : 'text-[var(--ink)]',
                )}
                style={{ borderColor: 'var(--line)' }}
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--dimmer)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {dict.nav[item.key]}
              </Link>
            ))}
          </nav>

          <p className="wrap mt-8 font-mono text-[10px] tracking-[0.2em] text-[var(--dimmer)] uppercase">
            {handle}
          </p>
        </div>
      )}
    </>
  )
}
