import type { TocEntry } from '@/lib/toc'

/** Static list of in-page links. No scroll-spy, so it ships zero JavaScript. */
export function TableOfContents({ entries, label }: { entries: TocEntry[]; label: string }) {
  if (entries.length < 2) return null

  return (
    <nav aria-label={label} className="rounded-2xl border border-subtle bg-surface-sunken/60 p-4">
      <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-ink-faint uppercase">
        {label}
      </p>
      <ul className="mt-3 grid gap-1.5 text-sm">
        {entries.map((entry) => (
          <li key={entry.id} className={entry.depth === 3 ? 'ps-4' : undefined}>
            <a
              href={`#${entry.id}`}
              className="block rounded-md py-0.5 text-ink-muted transition-colors hover:text-accent"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
