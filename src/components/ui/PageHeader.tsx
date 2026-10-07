import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Consistent page heading used by every section except the room itself. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('border-b border-subtle pb-8', className)}>
      {eyebrow && (
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-accent uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">{subtitle}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </header>
  )
}

/** Small horizontal rule with a label, used to break long lists into groups. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-ink-faint uppercase">
      {children}
      <span className="h-px flex-1 bg-subtle" aria-hidden="true" />
    </h2>
  )
}
