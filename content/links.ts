import type { LinkItem } from '@/lib/types'

/* ==========================================================================
 *  📌  THE CORKBOARD
 *
 *  Things worth keeping: tools, essays, references, rabbit holes.
 *  They appear as pinned notes on the corkboard inside the room, and as a
 *  list on /gallery#links.
 *
 *  `title`, `note` and `tag` are `{ fa, en }` pairs. `note` is optional.
 * ========================================================================== */

export const links: LinkItem[] = [
  {
    id: 'mdn',
    url: 'https://developer.mozilla.org/',
    title: { fa: 'MDN Web Docs', en: 'MDN Web Docs' },
    note: {
      fa: 'هر بار که مطمئنم چیزی را بلدم، اینجا چک می‌کنم و می‌فهمم نمی‌دانم.',
      en: 'Every time I am sure I know something, I check here and find out I do not.',
    },
    tag: { fa: 'مرجع', en: 'Reference' },
  },
  {
    id: 'web-dev',
    url: 'https://web.dev/',
    title: { fa: 'web.dev', en: 'web.dev' },
    note: {
      fa: 'بهترین جای شروع برای پرفورمنس و دسترس‌پذیری.',
      en: 'The best place to start on performance and accessibility.',
    },
    tag: { fa: 'مرجع', en: 'Reference' },
  },
  {
    id: 'generative-art',
    url: 'https://en.wikipedia.org/wiki/Generative_art',
    title: { fa: 'هنر مولد', en: 'Generative art' },
    note: {
      fa: 'ایده‌ای که کل تصویرهای این سایت رویش سوار است.',
      en: 'The idea every picture on this site rides on.',
    },
    tag: { fa: 'خواندنی', en: 'Reading' },
  },
  {
    id: 'tailwind',
    url: 'https://tailwindcss.com/docs',
    title: { fa: 'Tailwind CSS', en: 'Tailwind CSS' },
    note: {
      fa: 'وقتی حوصله‌ی اسم‌گذاری کلاس ندارم.',
      en: 'For when I cannot face naming another class.',
    },
    tag: { fa: 'ابزار', en: 'Tool' },
  },
  {
    id: 'vazirmatn',
    url: 'https://github.com/rastikerdar/vazirmatn',
    title: { fa: 'فونت وزیرمتن', en: 'Vazirmatn' },
    note: {
      fa: 'فونت فارسی‌ای که خواندنش واقعاً راحت است.',
      en: 'A Persian typeface that is genuinely comfortable to read.',
    },
    tag: { fa: 'تایپوگرافی', en: 'Typography' },
  },
  {
    id: 'every-layout',
    url: 'https://every-layout.dev/',
    title: { fa: 'Every Layout', en: 'Every Layout' },
    note: {
      fa: 'اگر فقط یک چیز درباره‌ی CSS بخوانی، همین باشد.',
      en: 'If you read exactly one thing about CSS, make it this.',
    },
    tag: { fa: 'خواندنی', en: 'Reading' },
  },
  {
    id: 'inclusive-components',
    url: 'https://inclusive-components.design/',
    title: { fa: 'Inclusive Components', en: 'Inclusive Components' },
    note: {
      fa: 'الگوهای واقعی برای ساختن رابط‌هایی که همه بتوانند استفاده کنند.',
      en: 'Real patterns for building interfaces everybody can actually use.',
    },
    tag: { fa: 'خواندنی', en: 'Reading' },
  },
  {
    id: 'shiki',
    url: 'https://shiki.style/',
    title: { fa: 'Shiki', en: 'Shiki' },
    note: {
      fa: 'هایلایت کد بدون جاوااسکریپت سمت کلاینت.',
      en: 'Syntax highlighting with no client-side JavaScript.',
    },
    tag: { fa: 'ابزار', en: 'Tool' },
  },
  {
    id: 'coolors',
    url: 'https://coolors.co/',
    title: { fa: 'Coolors', en: 'Coolors' },
    note: {
      fa: 'جایی که نصف روزم را صرف انتخاب یک رنگ می‌کنم.',
      en: 'Where I lose half a day choosing a single colour.',
    },
    tag: { fa: 'طراحی', en: 'Design' },
  },
  {
    id: 'excalidraw',
    url: 'https://excalidraw.com/',
    title: { fa: 'Excalidraw', en: 'Excalidraw' },
    note: {
      fa: 'قبل از نوشتن کد، با دست می‌کشمش.',
      en: 'I draw it by hand before I write any code.',
    },
    tag: { fa: 'طراحی', en: 'Design' },
  },
]
