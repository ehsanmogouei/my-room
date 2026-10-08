import type { GalleryItem } from '@/lib/types'

/* ==========================================================================
 *  🖼️  THE GALLERY WALL
 *
 *  There are no image files in this project. Every frame is generated from
 *  the item's `id`, so each one is unique, weighless, and never needs
 *  re-exporting at a new size.
 *
 *  HOW TO ADD YOUR OWN
 *  Copy a block below and change `id`, `title`, `group` and `date`.
 *  Keep `id` unique — it is both the React key and the artwork seed.
 *
 *  WANT A REAL PHOTOGRAPH?
 *  1. Drop the file in `public/gallery/`.
 *  2. Add `src: '/gallery/your-photo.jpg'` to the item.
 *  A `src` always wins over the generated artwork.
 *
 *  `kind` can be:
 *    'image' — generated art, or your photo when `src` is set
 *    'video' — an mp4/webm; `src` is required, `poster` is the still frame
 *    'link'  — an external page; `src` is the URL
 *
 *  `title`, `caption` and `group` are `{ fa, en }` pairs.
 * ========================================================================== */

export const gallery: GalleryItem[] = [
  {
    id: 'desk-at-night',
    kind: 'image',
    title: { fa: 'میز کار، نیمه‌شب', en: 'The desk, after midnight' },
    caption: {
      fa: 'بیشتر کارهای خوب از همین‌جا بیرون آمده‌اند.',
      en: 'Most of the good work has come out of this exact spot.',
    },
    group: { fa: 'اتاق', en: 'The room' },
    date: '2026-02-11',
  },
  {
    id: 'first-light',
    kind: 'image',
    title: { fa: 'اولین نور', en: 'First light' },
    caption: {
      fa: 'پنجره‌ای که هر روز صبح ساعت هفت بیدارم می‌کند.',
      en: 'The window that wakes me up at seven every morning.',
    },
    group: { fa: 'اتاق', en: 'The room' },
    date: '2026-01-28',
  },
  {
    id: 'prototype-table',
    kind: 'image',
    title: { fa: 'میز نمونه‌سازی', en: 'Prototype table' },
    caption: {
      fa: 'سه نسخه‌ی شکست‌خورده و یکی که جواب داد.',
      en: 'Three failed versions and the one that worked.',
    },
    group: { fa: 'کار', en: 'Work' },
    date: '2025-11-06',
  },
  {
    id: 'colour-study',
    kind: 'image',
    title: { fa: 'تمرین رنگ', en: 'Colour study' },
    caption: {
      fa: 'پالت‌هایی که هرگز از پروژه‌شان جان سالم به در نمی‌برند.',
      en: 'Palettes that never survive contact with the actual project.',
    },
    group: { fa: 'کار', en: 'Work' },
    date: '2025-10-19',
  },
  {
    id: 'road-north',
    kind: 'image',
    title: { fa: 'جاده‌ی شمال', en: 'The road north' },
    caption: {
      fa: 'چهار ساعت رانندگی برای رسیدن به جایی که آنتن نمی‌داد.',
      en: 'Four hours of driving to reach somewhere with no signal.',
    },
    group: { fa: 'سفر', en: 'Travel' },
    date: '2025-08-30',
  },
  {
    id: 'rain-window',
    kind: 'image',
    title: { fa: 'باران روی شیشه', en: 'Rain on glass' },
    caption: {
      fa: 'بهترین هوای ممکن برای نوشتن کد.',
      en: 'Objectively the best weather for writing code.',
    },
    group: { fa: 'سفر', en: 'Travel' },
    date: '2025-04-02',
  },
  {
    id: 'cable-drawer',
    kind: 'image',
    title: { fa: 'کشوی کابل‌ها', en: 'The cable drawer' },
    caption: {
      fa: 'هر کابلی که لازم داشته باشی، جز همان یکی که الان می‌خواهی.',
      en: 'Every cable you will ever need, except the one you need now.',
    },
    group: { fa: 'تصادفی', en: 'Odd bits' },
    date: '2025-02-14',
  },
  {
    id: 'wall-of-frames',
    kind: 'image',
    title: { fa: 'دیوار قاب‌ها', en: 'The wall of frames' },
    caption: {
      fa: 'هر قاب این دیوار با کد ساخته شده، نه با دوربین.',
      en: 'Every frame on this wall was made with code, not a camera.',
    },
    group: { fa: 'تصادفی', en: 'Odd bits' },
    date: '2025-01-09',
  },
  {
    id: 'link-mdx',
    kind: 'link',
    src: 'https://mdxjs.com/',
    title: { fa: 'MDX', en: 'MDX' },
    caption: {
      fa: 'چیزی که این سایت با آن نوشته می‌شود.',
      en: 'What this whole site is written in.',
    },
    group: { fa: 'تصادفی', en: 'Odd bits' },
    date: '2024-12-20',
  },
  {
    id: 'link-threejs',
    kind: 'link',
    src: 'https://shiki.style/',
    title: { fa: 'Shiki', en: 'Shiki' },
    caption: {
      fa: 'هایلایت کد بدون جاوااسکریپت سمت کلاینت.',
      en: 'Syntax highlighting with no client-side JavaScript.',
    },
    group: { fa: 'کار', en: 'Work' },
    date: '2024-11-15',
  },
]
