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
  }
  home: {
    enterRoom: string
    enterHint: string
    orBrowse: string
    latestWriting: string
    selectedWork: string
    nowHeading: string
    viewAll: string
  }
  room: {
    loading: string
    title: string
    intro: string
    /** Shown before the visitor clicks "enter". */
    doorLabel: string
    doorHint: string
    /** On-screen control legend. */
    controls: string
    move: string
    look: string
    interact: string
    release: string
    clickToStart: string
    use2D: string
    use3D: string
    mode3d: string
    mode2d: string
    unsupported: string
    unsupportedHint: string
    audioOn: string
    audioOff: string
    /** Map of hotspot id → label shown on the marker. */
    hotspots: Record<
      'desk' | 'bookshelf' | 'galleryWall' | 'window' | 'corkboard' | 'door' | 'lamp',
      { label: string; description: string }
    >
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
    backHome: 'بازگشت به اتاق',
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
  },
  home: {
    enterRoom: 'وارد اتاق شو',
    enterHint: 'با کلیدهای W A S D راه برو، با ماوس نگاه کن، روی اشیا کلیک کن.',
    orBrowse: 'یا مستقیم برو سراغ',
    latestWriting: 'تازه‌ترین نوشته‌ها',
    selectedWork: 'کارهای انتخابی',
    nowHeading: 'این روزها',
    viewAll: 'دیدن همه',
  },
  room: {
    loading: 'داریم اتاق را روشن می‌کنیم…',
    title: 'اتاق',
    intro: 'در باز است. داخل شو.',
    doorLabel: 'در را باز کن',
    doorHint: 'برای ورود کلیک کن یا کلیدی بزن',
    controls: 'راهنما',
    move: 'حرکت',
    look: 'نگاه',
    interact: 'انتخاب',
    release: 'آزاد کردن ماوس',
    clickToStart: 'برای شروع کلیک کن',
    use2D: 'حالت ساده',
    use3D: 'حالت سه‌بعدی',
    mode3d: 'سه‌بعدی',
    mode2d: 'دوبعدی',
    unsupported: 'مرورگرت از حالت سه‌بعدی پشتیبانی نمی‌کند',
    unsupportedHint: 'نسخه‌ی ساده‌ی اتاق را برایت آوردیم. همه‌چیز همین‌جاست.',
    audioOn: 'صدای محیط روشن',
    audioOff: 'صدای محیط خاموش',
    hotspots: {
      desk: { label: 'میز کار', description: 'کارها و پروژه‌ها' },
      bookshelf: { label: 'قفسه‌ی کتاب', description: 'نوشته‌ها و یادداشت‌ها' },
      galleryWall: { label: 'دیوار قاب‌ها', description: 'عکس‌ها و آرشیو' },
      window: { label: 'پنجره', description: 'الان چه خبر' },
      corkboard: { label: 'تخته‌ی سنجاقی', description: 'لینک‌های ذخیره‌شده' },
      door: { label: 'در', description: 'راه‌های ارتباطی' },
      lamp: { label: 'چراغ', description: 'روز یا شب' },
    },
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
    subtitle: 'کمی درباره من و این اتاق.',
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
    builtWith: 'ساخته‌شده با Next.js و سه‌بعدی‌های کنجکاوانه',
    source: 'کد منبع',
    rights: 'همه‌ی حقوق محفوظ است.',
    rss: 'خوراک RSS',
  },
  notFound: {
    title: 'این در به جایی باز نمی‌شود',
    body: 'صفحه‌ای که دنبالش بودی اینجا نیست. برگرد داخل اتاق.',
  },
}

const en: Dictionary = {
  nav: {
    home: 'Room',
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
    backHome: 'Back to the room',
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
  },
  home: {
    enterRoom: 'Enter the room',
    enterHint: 'Walk with W A S D, look with the mouse, click the objects.',
    orBrowse: 'Or go straight to',
    latestWriting: 'Latest writing',
    selectedWork: 'Selected work',
    nowHeading: 'Right now',
    viewAll: 'View all',
  },
  room: {
    loading: 'Warming up the room…',
    title: 'The room',
    intro: 'The door is open. Come in.',
    doorLabel: 'Open the door',
    doorHint: 'Click or press any key to enter',
    controls: 'Controls',
    move: 'Move',
    look: 'Look',
    interact: 'Select',
    release: 'Release cursor',
    clickToStart: 'Click to start',
    use2D: 'Simple mode',
    use3D: '3D mode',
    mode3d: '3D',
    mode2d: '2D',
    unsupported: 'Your browser cannot run the 3D room',
    unsupportedHint: 'Here is the simple version instead. Everything is still here.',
    audioOn: 'Ambience on',
    audioOff: 'Ambience off',
    hotspots: {
      desk: { label: 'Desk', description: 'Work and projects' },
      bookshelf: { label: 'Bookshelf', description: 'Writing and notes' },
      galleryWall: { label: 'Gallery wall', description: 'Photos and archive' },
      window: { label: 'Window', description: 'What is going on' },
      corkboard: { label: 'Corkboard', description: 'Saved links' },
      door: { label: 'Door', description: 'Ways to reach me' },
      lamp: { label: 'Lamp', description: 'Day or night' },
    },
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
    subtitle: 'A little about me and this room.',
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
    builtWith: 'Built with Next.js and a curious amount of 3D',
    source: 'Source',
    rights: 'All rights reserved.',
    rss: 'RSS feed',
  },
  notFound: {
    title: 'This door leads nowhere',
    body: 'The page you were looking for is not here. Step back into the room.',
  },
}

export const dictionaries: Record<Locale, Dictionary> = { fa, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
