'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { LOCALE_STORAGE_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { localeMeta, locales, type Locale } from '@/lib/types'

/**
 * Swaps the locale segment of the current path, so a visitor reading
 * `/fa/blog/some-post` lands on `/en/blog/some-post` — not on the home page.
 */
export function LocaleSwitcher({
  current,
  label,
  className,
}: {
  current: Locale
  label: string
  className?: string
}) {
  const pathname = usePathname() || `/${current}`

  const rest = pathname.replace(new RegExp(`^/${current}(?=/|$)`), '')

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-subtle bg-surface-sunken p-0.5',
        className,
      )}
      role="group"
      aria-label={label}
    >
      {locales.map((locale) => {
        const active = locale === current

        return (
          <Link
            key={locale}
            href={`/${locale}${rest}`}
            hrefLang={localeMeta[locale].htmlLang}
            aria-current={active ? 'true' : undefined}
            title={localeMeta[locale].label}
            onClick={() => {
              try {
                localStorage.setItem(LOCALE_STORAGE_KEY, locale)
              } catch {
                // Non-critical.
              }
            }}
            className={cn(
              'rounded-full px-2.5 py-1 text-[0.72rem] font-semibold transition-colors',
              active
                ? 'bg-accent text-accent-contrast'
                : 'text-ink-muted hover:text-ink',
            )}
          >
            {localeMeta[locale].short}
          </Link>
        )
      })}
    </div>
  )
}
