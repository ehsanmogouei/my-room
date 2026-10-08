import { Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

import { SocialIcon } from '@/components/shell/SocialIcon'
import { SectionLabel } from '@/components/ui/PageHeader'
import { PageHero } from '@/components/ui/PageHero'
import { site } from '@content/site'
import { getDictionary } from '@/lib/dictionaries'
import { SITE_REPO } from '@/lib/constants'
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
    title: dict.about.title,
    description: truncate(site.bio[locale], 160),
    alternates: { canonical: `/${locale}/about` },
  }
}

const COLOPHON = {
  fa: [
    ['فریم‌ورک', 'Next.js با App Router و رندر سمت سرور'],
    ['تصاویر', 'موتور مولد داخلی: هر تصویر از هش نام محتوای خودش ساخته می‌شود؛ هیچ فایل عکسی در مخزن نیست'],
    ['محتوا', 'فایل‌های MDX با frontmatter؛ بدون دیتابیس و بدون پنل مدیریت'],
    ['استایل', 'Tailwind CSS با توکن‌های تم که بین سایت و اتاق مشترک‌اند'],
    ['فونت', 'وزیرمتن، میزبانی‌شده روی همین دامنه'],
    ['میزبانی', 'Render، با CI/CD از گیت‌هاب'],
  ],
  en: [
    ['Framework', 'Next.js App Router with server rendering'],
    ['Imagery', 'A generative engine: every picture is drawn from a hash of its own content, and no image file exists in the repo'],
    ['Content', 'MDX files with frontmatter; no database and no admin panel'],
    ['Styling', 'Tailwind CSS with theme tokens shared between the site and the room'],
    ['Typography', 'Vazirmatn, self-hosted from this same domain'],
    ['Hosting', 'Render, deployed by CI/CD from GitHub'],
  ],
} as const

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)

  const httpSocials = site.socials.filter((social) => social.href.startsWith('http'))

  return (
    <>
      <PageHero
        seed={`about:${locale}`}
        eyebrow={dict.nav.about}
        title={dict.about.title}
        subtitle={dict.about.subtitle}
        size="compact"
      />

      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
        <div className="max-w-2xl space-y-5 text-base leading-8 text-ink-muted">
          <p className="text-lg text-ink">{site.bio[locale]}</p>

          <p>
            {locale === 'fa'
              ? 'این سایت یک پورتفولیوی معمولی نیست: یک آثارخانه‌ی مولد است. هر نوشته، هر پروژه و هر قاب، تصویر مخصوص خودش را دارد که با کد ساخته می‌شود — نه یک عکس تکراری، و نه یک فایل تصویری در مخزن.'
              : 'This site is not a portfolio with a grid of cards; it is a generative collection. Every post, project and frame carries its own picture, drawn by code rather than stored as a file.'}
          </p>

          <p>
            {locale === 'fa'
              ? 'همه‌چیز از فایل‌های ساده می‌آید. برای اضافه‌کردن یک نوشته، یک فایل MDX در پوشه‌ی محتوا می‌گذاری و پوش می‌کنی؛ بقیه‌اش خودکار است.'
              : 'Everything comes from plain files. To add a post you drop an MDX file into the content folder and push; the rest is automatic.'}
          </p>
        </div>

        <aside className="space-y-8">
          <div className="card p-5">
            <Image
              src={site.avatar}
              alt=""
              width={96}
              height={96}
              className="size-20 rounded-2xl border border-subtle"
            />

            <p className="mt-4 font-bold text-ink">{site.name[locale]}</p>
            <p className="text-xs text-ink-faint">@{site.handle}</p>

            {site.location && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <MapPin className="size-3.5" aria-hidden="true" />
                {site.location[locale]}
              </p>
            )}

            <a
              href={`mailto:${site.email}`}
              className="btn btn-primary mt-4 w-full"
              dir="ltr"
            >
              <Mail className="size-4" aria-hidden="true" />
              {site.email}
            </a>
          </div>

          <div>
            <SectionLabel>{dict.about.elsewhere}</SectionLabel>
            <ul className="mt-4 grid gap-2">
              {httpSocials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="flex items-center gap-2.5 rounded-xl border border-subtle px-3.5 py-2.5 text-sm text-ink-muted transition-colors hover:border-strong hover:text-ink"
                  >
                    <SocialIcon name={social.icon} className="size-4 shrink-0" />
                    {social.label[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* ------------------------------------------------------- colophon */}
      <section className="mt-16" aria-label={dict.about.colophon}>
        <SectionLabel>{dict.about.colophon}</SectionLabel>
        <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {COLOPHON[locale].map(([term, description]) => (
            <div key={term} className="border-s-2 border-accent/40 ps-4">
              <dt className="text-sm font-semibold text-ink">{term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{description}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-sm text-ink-muted">
          <a href={SITE_REPO} target="_blank" rel="noopener noreferrer" className="link-underline">
            {dict.footer.source}
          </a>
        </p>
        </section>
      </div>
    </>
  )
}
