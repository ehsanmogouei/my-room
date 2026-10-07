import { Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

import { SocialIcon } from '@/components/shell/SocialIcon'
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader'
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
    ['اتاق سه‌بعدی', 'three.js از طریق React Three Fiber، بدون هیچ مدل آماده‌ای — همه‌چیز با کد ساخته شده'],
    ['محتوا', 'فایل‌های MDX با frontmatter؛ بدون دیتابیس و بدون پنل مدیریت'],
    ['استایل', 'Tailwind CSS با توکن‌های تم که بین سایت و اتاق مشترک‌اند'],
    ['فونت', 'وزیرمتن، میزبانی‌شده روی همین دامنه'],
    ['میزبانی', 'Render، با CI/CD از گیت‌هاب'],
  ],
  en: [
    ['Framework', 'Next.js App Router with server rendering'],
    ['The 3D room', 'three.js through React Three Fiber, with no imported models — every object is code'],
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
    <div className="container-page py-12">
      <PageHeader
        eyebrow={dict.nav.about}
        title={dict.about.title}
        subtitle={dict.about.subtitle}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_18rem]">
        <div className="max-w-2xl space-y-5 text-base leading-8 text-ink-muted">
          <p className="text-lg text-ink">{site.bio[locale]}</p>

          <p>
            {locale === 'fa'
              ? 'این سایت یک پورتفولیوی معمولی نیست؛ یک مکان است. هر بخشش یک شیء در اتاق دارد و اگر مرورگرت سه‌بعدی را پشتیبانی نکند، همان محتوا با یک نقشه‌ی ساده در دسترست است. هیچ‌چیز پشت WebGL قفل نشده.'
              : 'This site is not a portfolio with a grid of cards; it is a place. Every section has an object in the room, and if your browser cannot do three dimensions, the same content is available as a flat map. Nothing is locked behind WebGL.'}
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
  )
}
