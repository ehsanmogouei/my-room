import type { ReactNode } from 'react'

import { GenerativeArt } from '@/components/art/GenerativeArt'

/**
 * The banner at the top of a section or an article.
 *
 * The artwork is seeded from the page's own identity, so `/blog` and a single
 * post never share a picture — and neither of them needed an image file.
 */
export function PageHero({
  seed,
  index,
  eyebrow,
  title,
  subtitle,
  children,
  size = 'default',
}: {
  seed: string
  index?: string
  eyebrow?: string
  title: string
  subtitle?: string
  children?: ReactNode
  size?: 'default' | 'compact'
}) {
  const tall = size === 'default'

  return (
    <header className="page-hero">
      <div className="page-hero__art" aria-hidden="true">
        <GenerativeArt seed={seed} density="rich" width={1800} height={tall ? 900 : 620} />
      </div>
      <div className="page-hero__veil" aria-hidden="true" />

      <div
        className="page-hero__inner wrap"
        style={{
          paddingTop: tall ? '9rem' : '7rem',
          paddingBottom: tall ? '4rem' : '2.75rem',
        }}
      >
        {(index || eyebrow) && (
          <div className="sec-head">
            {index && <span className="sec-num">{index}</span>}
            {eyebrow && <span>{eyebrow}</span>}
          </div>
        )}

        <h1 className="sec-title mt-6 max-w-4xl">{title}</h1>

        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--dim)] sm:text-lg">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-7">{children}</div>}
      </div>
    </header>
  )
}

/** Section label in the same chrome language: number, label, then a rule. */
export function SectionLabel({ children, index }: { children: ReactNode; index?: string }) {
  return (
    <div className="sec-head">
      {index && <span className="sec-num">{index}</span>}
      <span>{children}</span>
    </div>
  )
}
