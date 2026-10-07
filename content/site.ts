import type { Localized } from '@/lib/types'

/* ==========================================================================
 *  ✏️  THIS IS THE FILE YOU EDIT FIRST.
 *
 *  Everything personal about the site lives here: your name, your bio,
 *  your links, your colours. Search for `TODO:` to find every placeholder.
 * ========================================================================== */

export interface SocialLink {
  /** Shown as the accessible label and tooltip. */
  label: Localized
  href: string
  /** One of the icon keys supported in `src/components/shell/SocialIcon.tsx`. */
  icon: 'github' | 'x' | 'linkedin' | 'instagram' | 'telegram' | 'youtube' | 'mail' | 'rss'
}

export const site = {
  /* ------------------------------------------------------------------ */
  /* Identity                                                            */
  /* ------------------------------------------------------------------ */

  // TODO: replace with your real name / brand.
  name: {
    fa: 'اتاق من',
    en: 'My Room',
  },

  // TODO: your handle, without the @.
  handle: 'ehsanmogouei',

  // TODO: one line that says what you do.
  tagline: {
    fa: 'جایی که کارها، نوشته‌ها و چیزهایی که جمع کرده‌ام زندگی می‌کنند.',
    en: 'A quiet corner of the internet where my work, notes and collected things live.',
  },

  // TODO: 2–3 sentences, used on the home page and in meta descriptions.
  bio: {
    fa: 'من یک توسعه‌دهنده‌ام که عاشق ساختن چیزهای ساده و تمیز است. اینجا اتاق مجازی من است: میز کارم، قفسه‌ی کتابم و دیوار قاب‌هایم. در باز است — قدم بزن.',
    en: 'I am a developer who likes building small, tidy things. This is my virtual room: a desk, a bookshelf and a wall of framed memories. The door is open — come in.',
  },

  // TODO: your city, or delete the line.
  location: {
    fa: 'تهران، ایران',
    en: 'Tehran, Iran',
  },

  // TODO: drop a square photo at `public/avatar.jpg` and keep this path.
  avatar: '/avatar.svg',

  // TODO: the address people should write to.
  email: 'ehsanmg13@gmail.com',

  /* ------------------------------------------------------------------ */
  /* Links                                                               */
  /* ------------------------------------------------------------------ */

  socials: [
    // TODO: point these at your real profiles.
    {
      label: { fa: 'گیت‌هاب', en: 'GitHub' },
      href: 'https://github.com/ehsanmogouei',
      icon: 'github',
    },
    {
      label: { fa: 'لینکدین', en: 'LinkedIn' },
      href: 'https://www.linkedin.com/in/ehsanmogouei',
      icon: 'linkedin',
    },
    {
      label: { fa: 'تلگرام', en: 'Telegram' },
      href: 'https://t.me/ehsanmogouei',
      icon: 'telegram',
    },
    {
      label: { fa: 'ایمیل', en: 'Email' },
      href: 'mailto:ehsanmg13@gmail.com',
      icon: 'mail',
    },
  ] satisfies SocialLink[],

  /* ------------------------------------------------------------------ */
  /* The room                                                            */
  /* ------------------------------------------------------------------ */

  room: {
    /**
     * Palette for the 3D room and the 2D fallback map.
     * Warm, dusk-lit, a little lo-fi.
     */
    palette: {
      /** Ambient light, "day" mode. */
      day: { background: '#e8dcc8', wall: '#d9c7ad', floor: '#8a6a4b', ambient: '#ffffff' },
      /** Ambient light, "night" mode. */
      night: { background: '#0b0f1a', wall: '#2b2a33', floor: '#2a2018', ambient: '#6f7fb8' },
    },
    /** Which mode visitors land in. Visitors can flip it with the lamp. */
    defaultMode: 'night' as 'day' | 'night',
    /**
     * Optional ambient loop. Drop an mp3 at `public/ambience.mp3`
     * and set this to `/ambience.mp3`. Leave `null` for silence.
     * It is always muted until the visitor presses play.
     */
    ambience: null as string | null,
  },

  /* ------------------------------------------------------------------ */
  /* SEO                                                                 */
  /* ------------------------------------------------------------------ */

  seo: {
    // TODO: keywords you would want to be found by.
    keywords: {
      fa: ['توسعه‌دهنده', 'پورتفولیو', 'وب', 'برنامه‌نویسی', 'اتاق مجازی'],
      en: ['developer', 'portfolio', 'web', 'software', 'virtual room'],
    },
    // TODO: your X/Twitter handle, or remove.
    twitter: '@ehsanmogouei',
  },
} as const

export type Site = typeof site

/** Convenience: read a localized field for one locale. */
export function t(value: Localized, locale: keyof Localized): string {
  return value[locale]
}
