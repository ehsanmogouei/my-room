import type { GalleryItem } from '@/lib/types'

/* ==========================================================================
 *  🖼️  THE GALLERY WALL
 *
 *  Every item here becomes a frame on the wall — and a card on /gallery.
 *
 *  HOW TO ADD YOUR OWN
 *  1. Drop the file in `public/gallery/` (jpg, png, webp, avif, mp4, webm).
 *  2. Copy one block below and change `id`, `src`, `title`, `group`.
 *  3. Keep `id` unique — it is the React key and the lightbox anchor.
 *
 *  `kind` can be:
 *    'image' — a photo, shown in the lightbox
 *    'video' — an mp4/webm; `poster` is the still frame shown first
 *    'link'  — an external page; `src` is the URL and `poster` is a preview
 *
 *  `title`, `caption` and `group` are `{ fa, en }` pairs.
 *  Leave `caption` out if you have nothing to say.
 * ========================================================================== */

export const gallery: GalleryItem[] = [
  {
    id: 'desk-at-night',
    kind: 'image',
    src: '/gallery/placeholder-01.jpg',
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
    src: '/gallery/placeholder-02.jpg',
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
    src: '/gallery/placeholder-03.jpg',
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
    src: '/gallery/placeholder-04.jpg',
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
    src: '/gallery/placeholder-05.jpg',
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
    src: '/gallery/placeholder-06.jpg',
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
    src: '/gallery/placeholder-07.jpg',
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
    src: '/gallery/placeholder-08.jpg',
    title: { fa: 'دیوار قاب‌ها', en: 'The wall of frames' },
    caption: {
      fa: 'همان دیواری که توی اتاق سه‌بعدی می‌بینی.',
      en: 'The very wall you can walk up to inside the 3D room.',
    },
    group: { fa: 'تصادفی', en: 'Odd bits' },
    date: '2025-01-09',
  },
  {
    id: 'link-mdx',
    kind: 'link',
    src: 'https://mdxjs.com/',
    poster: '/gallery/placeholder-02.jpg',
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
    src: 'https://threejs.org/',
    poster: '/gallery/placeholder-04.jpg',
    title: { fa: 'three.js', en: 'three.js' },
    caption: {
      fa: 'موتوری که اتاق سه‌بعدی رویش سوار است.',
      en: 'The engine the 3D room rides on.',
    },
    group: { fa: 'کار', en: 'Work' },
    date: '2024-11-15',
  },
]
