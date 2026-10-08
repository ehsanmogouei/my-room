import type { Locale } from './types'

/**
 * Every user-facing string that is *not* personal content lives here.
 * The shape is shared between locales, so TypeScript fails the build if a
 * translation is missing.
 */
export interface Dictionary {
  nav: {
    home: string
    projects: string
    blog: string
    gallery: string
    now: string
    about: string
  }
  common: {
    readMore: string
    readingTime: string
    minutes: string
    backHome: string
    backTo: string
    allTags: string
    tags: string
    publishedOn: string
    updatedOn: string
    noResults: string
    noResultsHint: string
    featured: string
    stack: string
    visit: string
    openLink: string
    copyLink: string
    copied: string
    skipToContent: string
    close: string
    menu: string
    search: string
    language: string
    theme: string
    themeDay: string
    themeNight: string
    scroll: string
  }
  hero: {
    /** Small line above the title. */
    eyebrow: string
    /** Scroll invitation under the fold. */
    cue: string
    stats: { posts: string; projects: string; frames: string }
  }
  sections: {
    work: { label: string; description: string }
    writing: { label: string; description: string }
    frames: { label: string; description: string }
    now: { label: string; description: string }
  }
  corkboard: { label: string; description: string }
  home: {
    orBrowse: string
    latestWriting: string
    selectedWork: string
    nowHeading: string
    viewAll: string
  }
  blog: {
    title: string
    subtitle: string
    allPosts: string
    filteredBy: string
    clearFilter: string
    empty: string
    toc: string
    relatedPosts: string
  }
  projects: {
    title: string
    subtitle: string
    empty: string
  }
  gallery: {
    title: string
    subtitle: string
    all: string
    empty: string
    openInNewTab: string
  }
  nowPage: {
    title: string
    subtitle: string
    updated: string
  }
  about: {
    title: string
    subtitle: string
    elsewhere: string
    getInTouch: string
    colophon: string
  }
  palette: {
    open: string
    placeholder: string
    pages: string
    posts: string
    projects: string
    gallery: string
    actions: string
    toggleTheme: string
    switchLanguage: string
    noMatches: string
    hintNavigate: string
    hintSelect: string
    hintClose: string
  }
  footer: {
    builtWith: string
    source: string
    rights: string
    rss: string
    /** Shown next to the generated signature mark. */
    signature: string
  }
  notFound: {
    title: string
    body: string
  }
}

const fa: Dictionary = {
  nav: {
    home: 'اتاق',
    projects: 'کارها',
    blog: 'نوشته‌ها',
    gallery: 'قاب‌ها',
    now: 'الان',
    about: 'درباره',
  },
  common: {
    readMore: 'ادامه بده',
    readingTime: 'زمان مطالعه',
    minutes: 'دقیقه',
    backHome: 'بازگشت به خانه',
    backTo: 'بازگشت به',
    allTags: 'همه',
    tags: 'برچسب‌ها',
    publishedOn: 'منتشر شده در',
    updatedOn: 'به‌روزرسانی',
    noResults: 'چیزی پیدا نشد',
    noResultsHint: 'فیلتر را بردار یا عبارت دیگری را امتحان کن.',
    featured: 'شاخص',
    stack: 'تکنولوژی‌ها',
    visit: 'دیدن',
    openLink: 'باز کردن لینک',
    copyLink: 'کپی لینک',
    copied: 'کپی شد',
    skipToContent: 'پرش به محتوا',
    close: 'بستن',
    menu: 'منو',
    search: 'جست‌وجو',
    language: 'زبان',
    theme: 'تم',
    themeDay: 'روز',
    themeNight: 'شب',
    scroll: 'اسکرول کن',
  },
  hero: {
    eyebrow: 'اتاق من',
    cue: 'کمی پایین‌تر',
    stats: { posts: 'نوشته', projects: 'کار', frames: 'قاب' },
  },
  sections: {
    work: { label: 'کارها', description: 'چیزهایی که ساخته‌ام و به‌شان افتخار می‌کنم' },
    writing: { label: 'نوشته‌ها', description: 'یادداشت‌ها، ایده‌ها و چیزهایی که یاد می‌گیرم' },
    frames: { label: 'قاب‌ها', description: 'عکس‌ها، ویدیوها و چیزهایی که جمع کرده‌ام' },
    now: { label: 'الان', description: 'روی چه چیزی کار می‌کنم و چه می‌خوانم' },
  },
  corkboard: {
    label: 'تخته‌ی سنجاقی',
    description: 'لینک‌هایی که ارزش نگه‌داشتن دارند.',
  },
  home: {
    orBrowse: 'یا مستقیم برو سراغ',
    latestWriting: 'تازه‌ترین نوشته‌ها',
    selectedWork: 'کارهای انتخابی',
    nowHeading: 'این روزها',
    viewAll: 'دیدن همه',
  },
  blog: {
    title: 'نوشته‌ها',
    subtitle: 'یادداشت‌ها، ایده‌ها و چیزهایی که یاد می‌گیرم.',
    allPosts: 'همه‌ی نوشته‌ها',
    filteredBy: 'فیلتر بر اساس',
    clearFilter: 'حذف فیلتر',
    empty: 'هنوز نوشته‌ای اینجا نیست.',
    toc: 'در همین صفحه',
    relatedPosts: 'نوشته‌های مرتبط',
  },
  projects: {
    title: 'کارها',
    subtitle: 'چیزهایی که ساخته‌ام و به‌شان افتخار می‌کنم.',
    empty: 'هنوز پروژه‌ای اضافه نشده.',
  },
  gallery: {
    title: 'قاب‌ها',
    subtitle: 'عکس‌ها، ویدیوها و چیزهایی که جمع کرده‌ام.',
    all: 'همه',
    empty: 'گالری خالی است.',
    openInNewTab: 'در تب جدید باز کن',
  },
  nowPage: {
    title: 'الان',
    subtitle: 'روی چه چیزی کار می‌کنم، چه می‌خوانم، چه گوش می‌دهم.',
    updated: 'آخرین به‌روزرسانی',
  },
  about: {
    title: 'درباره',
    subtitle: 'کمی درباره من و این سایت.',
    elsewhere: 'جای دیگر',
    getInTouch: 'تماس',
    colophon: 'درباره‌ی ساخت این سایت',
  },
  palette: {
    open: 'باز کردن فرمان‌ها',
    placeholder: 'جست‌وجو در نوشته‌ها، کارها و صفحه‌ها…',
    pages: 'صفحه‌ها',
    posts: 'نوشته‌ها',
    projects: 'کارها',
    gallery: 'قاب‌ها',
    actions: 'کارها',
    toggleTheme: 'تغییر تم',
    switchLanguage: 'تغییر زبان',
    noMatches: 'چیزی پیدا نشد',
    hintNavigate: 'جابه‌جایی',
    hintSelect: 'انتخاب',
    hintClose: 'بستن',
  },
  footer: {
    builtWith: 'ساخته‌شده با Next.js؛ هر تصویر این سایت با کد تولید می‌شود',
    source: 'کد منبع',
    rights: 'همه‌ی حقوق محفوظ است.',
    rss: 'خوراک RSS',
    signature: 'امضای این صفحه',
  },
  notFound: {
    title: 'این صفحه پیدا نشد',
    body: 'نشانی‌ای که دنبالش بودی اینجا نیست. برگرد به خانه.',
  },
}

const en: Dictionary = {
  nav: {
    home: 'Home',
    projects: 'Work',
    blog: 'Writing',
    gallery: 'Frames',
    now: 'Now',
    about: 'About',
  },
  common: {
    readMore: 'Read more',
    readingTime: 'Reading time',
    minutes: 'min',
    backHome: 'Back home',
    backTo: 'Back to',
    allTags: 'All',
    tags: 'Tags',
    publishedOn: 'Published',
    updatedOn: 'Updated',
    noResults: 'Nothing found',
    noResultsHint: 'Try removing the filter or a different search term.',
    featured: 'Featured',
    stack: 'Stack',
    visit: 'Visit',
    openLink: 'Open link',
    copyLink: 'Copy link',
    copied: 'Copied',
    skipToContent: 'Skip to content',
    close: 'Close',
    menu: 'Menu',
    search: 'Search',
    language: 'Language',
    theme: 'Theme',
    themeDay: 'Day',
    themeNight: 'Night',
    scroll: 'Scroll',
  },
  hero: {
    eyebrow: 'A personal site',
    cue: 'Keep going',
    stats: { posts: 'posts', projects: 'projects', frames: 'frames' },
  },
  sections: {
    work: { label: 'Work', description: 'Things I have built and am proud of' },
    writing: { label: 'Writing', description: 'Notes, ideas and things I am learning' },
    frames: { label: 'Frames', description: 'Photos, videos and things I have collected' },
    now: { label: 'Now', description: 'What I am working on and reading' },
  },
  corkboard: {
    label: 'The corkboard',
    description: 'Links worth keeping.',
  },
  home: {
    orBrowse: 'Or go straight to',
    latestWriting: 'Latest writing',
    selectedWork: 'Selected work',
    nowHeading: 'Right now',
    viewAll: 'View all',
  },
  blog: {
    title: 'Writing',
    subtitle: 'Notes, ideas and things I am learning.',
    allPosts: 'All posts',
    filteredBy: 'Filtered by',
    clearFilter: 'Clear filter',
    empty: 'No posts here yet.',
    toc: 'On this page',
    relatedPosts: 'Related posts',
  },
  projects: {
    title: 'Work',
    subtitle: 'Things I have built and am proud of.',
    empty: 'No projects added yet.',
  },
  gallery: {
    title: 'Frames',
    subtitle: 'Photos, videos and things I have collected.',
    all: 'All',
    empty: 'The gallery is empty.',
    openInNewTab: 'Open in a new tab',
  },
  nowPage: {
    title: 'Now',
    subtitle: 'What I am working on, reading and listening to.',
    updated: 'Last updated',
  },
  about: {
    title: 'About',
    subtitle: 'A little about me and this site.',
    elsewhere: 'Elsewhere',
    getInTouch: 'Get in touch',
    colophon: 'Colophon',
  },
  palette: {
    open: 'Open command palette',
    placeholder: 'Search posts, projects and pages…',
    pages: 'Pages',
    posts: 'Posts',
    projects: 'Projects',
    gallery: 'Gallery',
    actions: 'Actions',
    toggleTheme: 'Toggle theme',
    switchLanguage: 'Switch language',
    noMatches: 'No matches',
    hintNavigate: 'navigate',
    hintSelect: 'select',
    hintClose: 'close',
  },
  footer: {
    builtWith: 'Built with Next.js; every image on this site is generated by code',
    source: 'Source',
    rights: 'All rights reserved.',
    rss: 'RSS feed',
    signature: "This page's signature",
  },
  notFound: {
    title: 'This page does not exist',
    body: 'The address you were looking for is not here. Head back home.',
  },
}

export const dictionaries: Record<Locale, Dictionary> = { fa, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
