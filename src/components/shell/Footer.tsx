import Link from 'next/link'

import { SocialIcon } from '@/components/shell/SocialIcon'
import { site } from '@content/site'
import { SITE_REPO } from '@/lib/constants'
import type { Dictionary } from '@/lib/dictionaries'
import { NAV_ITEMS, navHref } from '@/lib/nav'
import type { Locale } from '@/lib/types'

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear()
  const httpSocials = site.socials.filter((social) => social.href.startsWith('http'))

  return (
    <footer className="foot">
      <div className="foot-grid">
        <div>
          <span className="foot-brand">{site.name[locale]}</span>
          <p>{site.tagline[locale]}</p>
          <p>{dict.footer.builtWith}</p>
        </div>

        <nav className="foot-col" aria-label={dict.common.menu}>
          <span>Index</span>
          {NAV_ITEMS.filter((item) => item.path !== '').map((item) => (
            <Link key={item.key} href={navHref(locale, item.path)} data-cursor="link">
              {dict.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="foot-col">
          <span>{dict.about.elsewhere}</span>
          {httpSocials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer me"
              className="inline-flex items-center gap-2.5"
              data-cursor="link"
            >
              <SocialIcon name={social.icon} className="size-3.5 shrink-0 opacity-70" />
              {social.label[locale]}
            </a>
          ))}
          <a href={`/${locale}/rss.xml`} data-cursor="link">
            {dict.footer.rss}
          </a>
        </div>
      </div>

      <div className="foot-base">
        <span>
          © <span className="tnum">{year}</span> {site.name[locale]} — {dict.footer.rights}
        </span>

        <span className="inline-flex items-center gap-4">
          <a href={SITE_REPO} target="_blank" rel="noopener noreferrer" data-cursor="link">
            {dict.footer.source}
          </a>
          <span className="hidden sm:inline">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </span>
        </span>
      </div>
    </footer>
  )
}
