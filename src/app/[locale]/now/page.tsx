import type { Metadata } from 'next'

import { MdxContent } from '@/components/mdx/MdxContent'
import { PageHero } from '@/components/ui/PageHero'
import { getNow } from '@/lib/content'
import { getDictionary } from '@/lib/dictionaries'
import { resolveLocale } from '@/lib/types'
import { formatDate, truncate } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)

  return {
    title: dict.nowPage.title,
    description: truncate(dict.nowPage.subtitle, 160),
    alternates: { canonical: `/${locale}/now` },
  }
}

export default async function NowPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)
  const now = getNow(locale)

  return (
    <>
      <PageHero
        seed={`now:${locale}`}
        eyebrow={dict.nav.now}
        title={dict.nowPage.title}
        subtitle={dict.nowPage.subtitle}
        size="compact"
      >
        {now?.updated && (
          <p className="inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-raised/70 px-3 py-1 text-xs text-ink-muted backdrop-blur">
            {dict.nowPage.updated}:
            <time dateTime={now.updated} className="font-semibold text-ink">
              {formatDate(now.updated, locale)}
            </time>
          </p>
        )}
      </PageHero>

      <div className="container-page py-12">
        <div className="max-w-3xl">
          {now ? (
            <MdxContent source={now.body} locale={locale} />
          ) : (
            <p className="text-sm text-ink-muted">
              Create <code className="font-mono text-xs">content/now/{locale}.md</code> to fill this
              page.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
