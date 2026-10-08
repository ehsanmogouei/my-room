import type { ReactNode } from 'react'

import { GenerativeArt } from '@/components/art/GenerativeArt'
import { cn } from '@/lib/utils'

/**
 * The banner at the top of a section or an article.
 *
 * The artwork is seeded from the page's own identity, so `/blog` and a single
 * post never share a picture, and neither of them needed an image file.
 */
export function PageHero({
  seed,
  eyebrow,
  title,
  subtitle,
  children,
  size = 'default',
  className,
}: {
  seed: string
  eyebrow?: string
  title: string
  subtitle?: string
  children?: ReactNode
  size?: 'default' | 'compact'
  className?: string
}) {
  const tall = size === 'default'

  return (
    <header
      className={cn(
        'page-hero grain relative isolate overflow-hidden border-b border-subtle',
        tall ? 'pb-12 sm:pb-16' : 'pb-8 sm:pb-10',
        className,
      )}
    >
      <div className="page-hero__art" aria-hidden="true">
        <GenerativeArt
          seed={seed}
          density="rich"
          width={1800}
          height={tall ? 900 : 620}
        />
      </div>

      <div className="page-hero__veil" aria-hidden="true" />

      <div
        className={cn(
          'container-page relative',
          tall ? 'pt-16 sm:pt-24' : 'pt-10 sm:pt-14',
        )}
      >
        {eyebrow && (
          <p className="text-[0.7rem] font-semibold tracking-[0.28em] text-accent uppercase">
            {eyebrow}
          </p>
        )}

        <h1
          className={cn(
            'mt-3 max-w-4xl font-bold text-ink',
            tall ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl',
          )}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-7">{children}</div>}
      </div>
    </header>
  )
}
