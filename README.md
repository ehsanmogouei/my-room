# اتاق من · My Room

> یک وب‌سایت شخصی که **هر تصویرش با کد ساخته می‌شود**.
> هیچ فایل عکسی در این مخزن وجود ندارد — نه کاور، نه تصویر جان‌گدار.
> هر نوشته، هر پروژه، هر قاب گالری و هر کارت شبکه‌های اجتماعی، یک اثر هنری یکتا و
> تکرارپذیر است که از هش نام خودش تولید می‌شود.

A bilingual personal site with no images. Covers, social cards, page banners and
the animated hero are all generated at render time from a seed derived from the
content itself — deterministic, weightless, and never the same twice.

**دوزبانه (فارسی/انگلیسی) · Next.js · Tailwind CSS v4 · MDX · بدون هیچ فایل تصویری**

---

## فهرست

- [ایده‌ی اصلی](#ایدهی-اصلی)
- [شروع سریع](#شروع-سریع)
- [شخصی‌سازی](#شخصیسازی)
- [موتور هنر مولد](#موتور-هنر-مولد)
- [ساختار پروژه](#ساختار-پروژه)
- [دستورها](#دستورها)
- [دیپلوی روی Render](#دیپلوی-روی-render)
- [تصمیم‌های فنی](#تصمیمهای-فنی)
- [English](#english)

---

## ایده‌ی اصلی

به‌جای اینکه سایت «رزومه» باشد، یک **آثارخانه‌ی مولد** است:

- **هر محتوا یک امضای بصری دارد.** نوشته‌ی `css-that-does-less` همیشه همان تصویر را
  نشان می‌دهد — در کارت صفحه‌ی اصلی، در فهرست بلاگ، در بالای خود مقاله، و در کارت
  اشتراک‌گذاری در شبکه‌های اجتماعی. یک هش، چهار نمایش، بدون یک بایت فایل.
- **کارت OG از همان دانه ساخته می‌شود**، پس پیش‌نمایش لینک با صفحه‌ای که باز می‌شود
  هم‌رنگ و هم‌حال است.
- **پنج کهن‌الگوی ترکیب‌بندی**: `arch` (طاق/دروازه)، `horizon` (افق)، `waves` (موج‌ها)،
  `orbit` (سیاره‌ی حلقه‌دار)، `shafts` (نور عمودی). دانه انتخاب می‌کند، پس هیچ دو
  صفحه‌ای شبیه هم نیست ولی همه از یک خانواده‌اند.
- **بوم زنده در هیرو**: همان موتور روی canvas و در هر فریم — با نوری که دنبال ماوس
  می‌آید و بندهای جوهری که آرام جریان دارند.

و در کنارش یک سایت کامل: پورتفولیو، بلاگ MDX با هایلایت کد، گالری با لایت‌باکس،
صفحه‌ی «الان»، RSS دوزبانه، sitemap، JSON-LD و پالت فرمان (`⌘K`).

**دسترس‌پذیری جدی گرفته شده:** همه‌ی انیمیشن‌ها با `prefers-reduced-motion` خاموش
می‌شوند، بوم‌ها برای صفحه‌خوان نامرئی‌اند و هر تصویر حامل‌معنا متن جانشین دارد.
فونت وزیرمتن داخل خود مخزن است، پس بیلد هیچ‌وقت به CDN فونت وابسته نیست.

---

## شروع سریع

نیازمندی: **Node.js 20.9 یا بالاتر**.

```bash
git clone https://github.com/ehsanmogouei/my-room.git
cd my-room
npm install
cp .env.example .env.local     # در ویندوز: copy .env.example .env.local
npm run dev
```

بعد `http://localhost:3000` را باز کن. خودش به `/fa` می‌روی
(اگر مرورگرت انگلیسی باشد، به `/en`).

> **نکته:** پروژه را داخل پوشه‌ی OneDrive/Dropbox نگذار. `node_modules` با هزاران فایل
> کوچک باعث کندی همگام‌سازی و خطاهای قفل فایل می‌شود.

---

## شخصی‌سازی

همه‌چیز فایل‌محور است. هیچ دیتابیس و پنل مدیری وجود ندارد.
هرجا محتوای نمونه مانده با `TODO:` علامت خورده — کافی است `TODO` را جست‌وجو کنی.

### ۱. هویت سایت → `content/site.ts`

اسم، تگ‌لاین، بیو، ایمیل، شهر، شبکه‌های اجتماعی. اولین فایلی که باید عوض کنی.

### ۲. نوشته‌ها → `content/posts/fa/` و `content/posts/en/`

هر نوشته یک فایل `.mdx` است. اسم فایل = آدرس صفحه و **دانه‌ی تصویر آن**.
اسم فایل در دو پوشه باید یکی باشد تا نوشته‌ها جفت شوند.

```mdx
---
title: "عنوان نوشته"
date: "2025-03-14"        # حتماً داخل کوتیشن باشد
summary: "یک یا دو جمله، ۹۰ تا ۱۶۰ کاراکتر."
tags: ["css", "frontend"]
draft: false              # اختیاری
---

متن اینجا. از `##` و `###` برای تیترها استفاده کن — فهرست صفحه خودکار ساخته می‌شود.
```

لینک‌های داخلی را **بدون** پیشوند زبان بنویس (`/projects`) — خودش به زبان جاری وصل می‌شود.

### ۳. پروژه‌ها → `content/projects/fa/` و `content/projects/en/`

```mdx
---
title: "نام پروژه"
year: "2025"                     # حتماً داخل کوتیشن
summary: "توضیح کوتاه."
stack: ["Next.js", "TypeScript"]
links:
  - label: "Live"
    href: "https://example.com"
featured: true                   # اختیاری — شاخص‌ها بالاتر می‌آیند
order: 1                         # اختیاری — عدد کمتر، بالاتر
---
```

### ۴. گالری → `content/gallery.ts`

یک بلوک کپی کن و `id` را عوض کن — تصویرش خودکار ساخته می‌شود.

```ts
{
  id: 'unique-id',                 // یکتا باشد؛ هم کلید React است هم دانه‌ی تصویر
  kind: 'image',
  title:   { fa: 'عنوان', en: 'Title' },
  caption: { fa: 'توضیح', en: 'Caption' },   // اختیاری
  group:   { fa: 'سفر', en: 'Travel' },
  date: '2025-08-30',
}
```

**عکس واقعی می‌خواهی؟** فایل را در `public/gallery/` بگذار و
`src: '/gallery/x.jpg'` اضافه کن. `src` همیشه بر هنر مولد اولویت دارد.

### ۵. تخته‌ی سنجاقی → `content/links.ts`

آرشیو لینک‌ها: ابزارها، مقاله‌ها، هر چیزی که ارزش نگه‌داشتن دارد.

### ۶. صفحه‌ی «الان» → `content/now/{fa,en}.md`

### ۷. رنگ‌ها و تم → `src/app/globals.css`

پالت رابط از توکن‌های CSS می‌آید. برای عوض کردن رنگ اصلی، `--accent` را در `:root`
(تم روز) و `.dark` (تم شب) تغییر بده.

رنگ **تصاویر مولد** جای دیگری است: `INK_SETS` در `src/lib/generative/palette.ts`.
هر مجموعه یک «مرکب» است — دو رنگ زمینه و سه جوهر هماهنگ.

---

## موتور هنر مولد

```
یک رشته (مثل نام فایل نوشته)
        │
        ▼
   FNV-1a + mulberry32  ──►  مولد اعداد شبه‌تصادفی قابل‌تکرار
        │
        ├──► انتخاب مجموعه‌ی مرکب و کهن‌الگوی ترکیب‌بندی
        ├──► نویز یک‌بعدی «نرم» برای همه‌ی خطوط جاری
        └──► چیدمان: طاق / افق / موج / سیاره / نور عمودی
        │
        ▼
   spec خالص (فقط عدد و رشته)
        │
        ├──► GenerativeArt   →  SVG سرور-ساید، صفر جاوااسکریپت سمت کلاینت
        ├──► LivingCanvas    →  همان چیدمان روی canvas، متحرک
        └──► کارت OG         →  همان پالت در satori
```

| فایل | کار |
| --- | --- |
| `src/lib/generative/palette.ts` | PRNG، هش، نویز، ترکیب رنگ، ۱۰ مجموعه‌ی مرکب |
| `src/lib/generative/artwork.ts` | ریاضیات مسیرها و پنج کهن‌الگوی ترکیب‌بندی |
| `src/components/art/GenerativeArt.tsx` | رندر SVG سرور-ساید |
| `src/components/art/LivingCanvas.tsx` | نسخه‌ی متحرک روی canvas |
| `src/components/art/PageField.tsx` | پس‌زمینه‌ی محوِ هر صفحه |
| `src/components/art/CursorLight.tsx` | نور گرمی که دنبال ماوس می‌رود |

**چرا قابل‌تکرار بودن مهم است؟** چون یعنی یک دانه می‌تواند چهار جا ظاهر شود — کارت،
بالای مقاله، کارت شبکه‌های اجتماعی و جست‌وجو — بدون ذخیره یا انتقال یک بایت تصویر.

---

## ساختار پروژه

```
my-room/
├── content/                    ← تمام محتوای تو
│   ├── site.ts                 ← اسم، بیو، شبکه‌های اجتماعی   ← از اینجا شروع کن
│   ├── gallery.ts              ← آیتم‌های گالری (بدون فایل تصویر)
│   ├── links.ts                ← آرشیو لینک‌ها
│   ├── now/{fa,en}.md          ← صفحه‌ی «الان»
│   ├── posts/{fa,en}/*.mdx
│   └── projects/{fa,en}/*.mdx
│
├── public/
│   ├── fonts/                  ← وزیرمتن (woff2 برای سایت، ttf برای OG)
│   └── avatar.svg  icon.svg  favicon.ico
│
├── src/
│   ├── proxy.ts                ← ریدایرکت به زبان پیش‌فرض (قرارداد Next 16)
│   ├── app/[locale]/           ← همه‌ی صفحات، دوزبانه
│   │   ├── layout.tsx          ← <html lang dir>، هدر، فوتر، متادیتا، لایه‌های مولد
│   │   ├── page.tsx            ← هیرو زنده + کارت‌ها
│   │   ├── projects/  blog/  gallery/  now/  about/
│   │   ├── og/route.tsx        ← کارت شبکه‌های اجتماعی با همان پالت
│   │   └── rss.xml/route.ts
│   ├── components/
│   │   ├── art/  shell/  mdx/  blog/  gallery/  ui/
│   │   └── CommandPalette.tsx
│   └── lib/generative/  content.ts  dictionaries.ts  types.ts
│
├── .github/workflows/ci.yml    ← lint → typecheck → build → deploy
├── render.yaml                 ← تعریف سرویس روی Render
└── docs/DEPLOY.md              ← راهنمای کامل دیپلوی
```

---

## دستورها

| دستور | کار |
| --- | --- |
| `npm run dev` | سرور توسعه روی `http://localhost:3000` |
| `npm run build` | بیلد پروداکشن |
| `npm start` | اجرای بیلد (پورت از `PORT` خوانده می‌شود) |
| `npm run typecheck` | بررسی تایپ‌ها بدون تولید فایل |
| `npm run lint` | ESLint |
| `npm run check` | تایپ‌چک + لینت با هم |

برای دیدن نوشته‌های `draft: true` در حالت توسعه:

```bash
# ویندوز (PowerShell)
$env:NEXT_PUBLIC_SHOW_DRAFTS='1'; npm run dev
# مک/لینوکس
NEXT_PUBLIC_SHOW_DRAFTS=1 npm run dev
```

---

## دیپلوی روی Render

1. ریپو را به گیت‌هاب پوش کن.
2. در Render → **New → Blueprint** → ریپو را انتخاب کن. `render.yaml` بقیه را می‌سازد.
3. در تنظیمات سرویس، `NEXT_PUBLIC_SITE_URL` را به دامنه‌ی واقعی‌ات ست کن.
4. در گیت‌هاب → Settings → Secrets → سکرتی به اسم `RENDER_DEPLOY_HOOK_URL` بساز.

از این به بعد هر پوش به `main`:

```
lint + typecheck  →  build  →  اگر سبز بود، تریگر دیپلوی Render
```

راهنمای کامل با عیب‌یابی: **[docs/DEPLOY.md](docs/DEPLOY.md)**

---

## تصمیم‌های فنی

- **هیچ فایل تصویری وجود ندارد.** تصاویر مولد SVG سرور-ساید هستند: صفر جاوااسکریپت
  سمت کلاینت، بی‌نهایت شارپ در هر اندازه، و صفحه‌ای سبک‌تر از تصویرهایش.
- **رنگ‌ها از لیست انتخاب می‌شوند، محاسبه نمی‌شوند.** چرخه‌ی رنگ می‌تواند گل‌آلود
  تولید کند؛ یک لیست گزینش‌شده همیشه چاپ ریزوگراف می‌دهد. تنوع از دانه می‌آید، نه از
  اختراع رنگ.
- **پنج کهن‌الگو به‌جای یک ترکیب‌بندی.** بدونشان، مولد به یک حال‌وهوا می‌رسد:
  مه با یک خورشید در آن.
- **بلوک‌های کد همیشه تیره‌اند، در هر دو تم.** یک تم Shiki به‌جای دو تا.
- **`useSyncExternalStore` به‌جای `useEffect` + `useState`.** قوانین React Compiler
  در ESLint این الگو را رد می‌کند و درست می‌گوید: تم، مدیا کوئری و `localStorage`
  همه «منبع بیرونی» هستند.
- **انیمیشن اسکرول با CSS خالص.** `animation-timeline: view()` روی کامپوزیتور اجرا
  می‌شود و در مرورگرهای قدیمی‌تر محتوا ساده نمایش داده می‌شود.
- **نیم‌فاصله در کارت OG با فاصله‌ی معمولی جایگزین می‌شود**، چون satori آن را
  به‌صورت فاصله‌ی کامل می‌کشد و کلمه را از هم می‌پاشد.
- **`turbopack.root` صریحاً ست شده** تا Turbopack تا پوشه‌ی خانه بالا نرود.

---

## English

A personal website whose imagery is entirely procedural. There is not a single
image file in this repository: post covers, project art, gallery frames and the
Open Graph cards are all drawn from a seed derived from the content's own name.
The same seed drives the card on the index, the banner above the article and the
social preview, so a link looks like the page it opens.

Five composition families — arch, horizon, waves, orbit and shafts — are picked
by the seed, so no two pages match while all of them belong to one series. A
canvas version of the same engine runs behind the hero, following the pointer.

Alongside that: a full bilingual site with an MDX blog (Shiki highlighting, RSS
per language), a gallery with a lightbox, a link archive, a sitemap with
alternates, JSON-LD, a command palette, and RTL typography set in self-hosted
Vazirmatn.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · MDX via
next-mdx-remote · TypeScript strict · deployed on Render with GitHub Actions
CI/CD.

**Quick start:** `npm install && npm run dev`, then open `http://localhost:3000`.

**Deploy:** see [docs/DEPLOY.md](docs/DEPLOY.md).

---

## مجوز

[MIT](LICENSE) — هر طور که می‌خواهی استفاده کن.
