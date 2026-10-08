import Link from 'next/link'

import { getDictionary } from '@/lib/dictionaries'
import { resolveLocale } from '@/lib/types'

/**
 * 404 inside a locale. Renders with the normal header and footer, so the
 * visitor can walk back into the room rather than hitting a dead end.
 */
export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale: string }>
}) {
  const locale = resolveLocale(params ? (await params).locale : undefined)
  const dict = getDictionary(locale)

  return (
    <div className="wrap grid min-h-[60vh] place-items-center py-20">
      <div className="max-w-md text-center">
        <p className="font-mono text-5xl font-bold text-accent">404</p>
        <h1 className="mt-5 text-2xl font-bold text-ink">{dict.notFound.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{dict.notFound.body}</p>

        <Link href={`/${locale}`} className="btn btn-primary mt-8">
          {dict.common.backHome}
        </Link>

        <nav className="mt-8 flex flex-wrap justify-center gap-2 text-xs">
          {(
            [
              ['projects', dict.nav.projects],
              ['blog', dict.nav.blog],
              ['gallery', dict.nav.gallery],
              ['now', dict.nav.now],
              ['about', dict.nav.about],
            ] as const
          ).map(([path, label]) => (
            <Link
              key={path}
              href={`/${locale}/${path}`}
              className="rounded-full border border-subtle px-3 py-1.5 text-ink-muted transition-colors hover:border-accent hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
