import Link from 'next/link'

import { SocialIcon } from '@/components/shell/SocialIcon'
import type { Dictionary } from '@/lib/dictionaries'
import { SITE_REPO } from '@/lib/constants'
import { site } from '@content/site'
import type { Locale } from '@/lib/types'

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-subtle bg-surface-sunken/60">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-bold text-ink">{site.name[locale]}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{site.tagline[locale]}</p>
          <p className="mt-4 text-xs text-ink-faint">{dict.footer.builtWith}</p>
        </div>

        <nav className="grid content-start gap-2 text-sm" aria-label={dict.footer.source}>
          <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
            {dict.common.search}
          </p>
          {(
            [
              ['projects', dict.nav.projects, '/projects'],
              ['blog', dict.nav.blog, '/blog'],
              ['gallery', dict.nav.gallery, '/gallery'],
              ['now', dict.nav.now, '/now'],
              ['about', dict.nav.about, '/about'],
            ] as const
          ).map(([key, label, href]) => (
            <Link key={key} href={`/${locale}${href}`} className="text-ink-muted hover:text-accent">
              {label}
            </Link>
          ))}
        </nav>

        <div className="grid content-start gap-3 text-sm">
          <p className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
            {dict.about.elsewhere}
          </p>
          <ul className="grid gap-2">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer me"
                  className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-accent"
                >
                  <SocialIcon name={social.icon} className="size-4 shrink-0" />
                  <span>{social.label[locale]}</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={`/${locale}/rss.xml`}
                className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-accent"
              >
                <SocialIcon name="rss" className="size-4 shrink-0" />
                <span>{dict.footer.rss}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-subtle">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-ink-faint">
          <p>
            © <span className="tnum">{year}</span> {site.name[locale]} — {dict.footer.rights}
          </p>
          <a
            href={SITE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            {dict.footer.source}
          </a>
        </div>
      </div>
    </footer>
  )
}
