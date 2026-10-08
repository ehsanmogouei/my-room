import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'

import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { SectionLabel } from '@/components/ui/PageHeader'
import { PageHero } from '@/components/ui/PageHero'
import { getGallery, getLinks } from '@/lib/content'
import { getDictionary } from '@/lib/dictionaries'
import { resolveLocale } from '@/lib/types'
import { truncate } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)

  return {
    title: dict.gallery.title,
    description: truncate(dict.gallery.subtitle, 160),
    alternates: { canonical: `/${locale}/gallery` },
  }
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)

  const items = getGallery()
  const links = getLinks()

  return (
    <>
      <PageHero
        seed={`gallery:${locale}`}
        eyebrow={dict.nav.gallery}
        title={dict.gallery.title}
        subtitle={dict.gallery.subtitle}
        size="compact"
      />

      <div className="container-page py-12">
        <GalleryGrid items={items} locale={locale} dict={dict} />

        <section id="links" className="mt-20 scroll-mt-24" aria-label={dict.corkboard.label}>
          <SectionLabel>{dict.corkboard.label}</SectionLabel>
          <p className="mt-3 max-w-2xl text-sm text-ink-muted">{dict.corkboard.description}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex h-full gap-4 p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-ink">{link.title[locale]}</span>
                      <ArrowUpRight
                        className="size-3.5 shrink-0 text-ink-faint transition-colors group-hover:text-accent rtl:-scale-x-100"
                        aria-hidden="true"
                      />
                    </div>

                    {link.note && (
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {link.note[locale]}
                      </p>
                    )}

                    <p className="mt-3 text-[0.68rem] text-ink-faint">{link.tag[locale]}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
