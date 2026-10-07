# اتاق من · My Room

> یک وب‌سایت شخصی که «یک مکان» است، نه یک صفحه.
> در را باز می‌کنی، وارد اتاق می‌شوی، و هر شیء داخل اتاق یک بخش از کار و زندگی توست:
> میز کار، قفسه‌ی کتاب، دیوار قاب‌ها، پنجره، تخته‌ی سنجاقی و در.

A personal website that behaves like a place: a walkable 3D room where the desk
is the portfolio, the bookshelf is the blog, and the wall of frames is the
gallery — with an equally complete 2D version for phones and slow machines.

**دوزبانه (فارسی/انگلیسی) · Next.js · three.js · MDX · Tailwind CSS · دیپلوی روی Render**

---

## فهرست

- [چه چیزی داخلش هست](#چه-چیزی-داخلش-هست)
- [شروع سریع](#شروع-سریع)
- [شخصی‌سازی (مهم‌ترین بخش)](#شخصی‌سازی-مهم‌ترین-بخش)
- [ساختار پروژه](#ساختار-پروژه)
- [دستورها](#دستورها)
- [دیپلوی روی Render](#دیپلوی-روی-render)
- [تصمیم‌های فنی](#تصمیم‌های-فنی)
- [English](#english)

---

## چه چیزی داخلش هست

### اتاق

یک اتاق سه‌بعدی که با `W A S D` داخلش راه می‌روی و با ماوس نگاه می‌کنی.
هفت شیء تعاملی، هرکدام با یک نشانگر شناور:

| شیء | مقصد |
| --- | --- |
| 🖥️ میز کار | `/projects` |
| 📚 قفسه‌ی کتاب | `/blog` |
| 🖼️ دیوار قاب‌ها | `/gallery` |
| 🪟 پنجره | `/now` |
| 📌 تخته‌ی سنجاقی | `/gallery#links` |
| 🚪 در | `/about` |
| 💡 چراغ | تغییر تم روز/شب |

### دو حالت، بدون قفل‌شدن محتوا

- **حالت سه‌بعدی** — روی دسکتاپ با WebGL.
- **حالت دوبعدی** — همان اتاق به‌صورت نقشه‌ی تخت، با همان مقصدها.

حالت دوبعدی خودکار انتخاب می‌شود وقتی: مرورگر WebGL نداشته باشد،
`prefers-reduced-motion` روشن باشد، یا کاربر خودش دکمه‌ی «حالت ساده» را بزند.
**هیچ محتوایی پشت WebGL قفل نشده.** همه‌ی صفحات نسخه‌ی متنی، سریع و سئو-فرندلی جدا دارند.

### سایت

- **پورتفولیو** — پروژه‌ها با تکنولوژی‌ها، لینک‌ها و صفحه‌ی اختصاصی
- **بلاگ** — نوشته‌های MDX با تاریخ، برچسب، زمان مطالعه و فهرست درون‌صفحه
- **گالری** — عکس/ویدیو/لینک با لایت‌باکس و فیلتر گروه
- **الان** — یک فایل ساده که هر وقت خواستی عوضش می‌کنی
- **درباره** — بیو، شبکه‌های اجتماعی و colophon
- **پالت فرمان** (`Ctrl/⌘ + K`) — جست‌وجو در همه‌ی محتوا
- **RSS**، **sitemap**، **robots**، **تصویر OG خودکار** برای هر نوشته و پروژه
- **دوزبانه** با مسیرهای `/fa/...` و `/en/...` و پشتیبانی کامل RTL

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

بعد `http://localhost:3000` را باز کن. به‌طور خودکار به `/fa` می‌روی
(اگر مرورگرت انگلیسی باشد، به `/en`).

> **نکته:** پروژه را داخل پوشه‌ی OneDrive/Dropbox نگذار. `node_modules` با هزاران فایل
> کوچک باعث کندی همگام‌سازی و خطاهای قفل فایل می‌شود.

---

## شخصی‌سازی (مهم‌ترین بخش)

همه‌چیز فایل‌محور است. هیچ دیتابیس و پنل مدیری وجود ندارد.
هرجا محتوای نمونه مانده، با `TODO:` علامت خورده — کافی است در پروژه `TODO` را جست‌وجو کنی.

### ۱. هویت سایت → `content/site.ts`

اولین و مهم‌ترین فایلی که باید عوض کنی: اسم، تگ‌لاین، بیو، ایمیل، شهر،
شبکه‌های اجتماعی، آواتار و پالت رنگ اتاق.

```ts
name:   { fa: 'اتاق من', en: 'My Room' },
handle: 'ehsanmogouei',
email:  'ehsanmg13@gmail.com',
socials: [ /* ... */ ],
```

### ۲. نوشته‌ها → `content/posts/fa/` و `content/posts/en/`

هر نوشته یک فایل `.mdx` است. اسم فایل = آدرس صفحه.
برای اینکه یک نوشته در هر دو زبان جفت شود، **اسم فایل در دو پوشه باید یکی باشد**.

```mdx
---
title: "عنوان نوشته"
date: "2025-03-14"        # حتماً داخل کوتیشن باشد
summary: "یک یا دو جمله، ۹۰ تا ۱۶۰ کاراکتر."
tags: ["css", "frontend"]
cover: "/gallery/placeholder-01.jpg"   # اختیاری
draft: false                            # اختیاری
---

متن اینجا. از `##` و `###` برای تیترها استفاده کن — فهرست صفحه خودکار ساخته می‌شود.
```

داخل متن می‌توانی از جدول، نقل‌قول، لیست، بلوک کد با زبان و لینک استفاده کنی.
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
cover: "/gallery/placeholder-02.jpg"   # اختیاری
featured: true                          # اختیاری — شاخص‌ها بالاتر می‌آیند
order: 1                                # اختیاری — عدد کمتر، بالاتر
---
```

### ۴. گالری → `content/gallery.ts`

فایل تصویر را در `public/gallery/` بگذار، بعد یک بلوک در `content/gallery.ts` کپی کن:

```ts
{
  id: 'unique-id',                 // یکتا باشد
  kind: 'image',                   // 'image' | 'video' | 'link'
  src: '/gallery/my-photo.jpg',
  poster: '/gallery/poster.jpg',   // فقط برای video و link
  title:   { fa: 'عنوان', en: 'Title' },
  caption: { fa: 'توضیح', en: 'Caption' },   // اختیاری
  group:   { fa: 'سفر', en: 'Travel' },
  date: '2025-08-30',
}
```

تصاویر جان‌گدار (`placeholder-01.jpg` تا `placeholder-08.jpg`) را با عکس‌های خودت عوض کن
و فایل‌های اضافی را پاک کن.

### ۵. تخته‌ی سنجاقی → `content/links.ts`

آرشیو لینک‌ها: ابزارها، مقاله‌ها، هر چیزی که ارزش نگه‌داشتن دارد.

### ۶. صفحه‌ی «الان» → `content/now/fa.md` و `content/now/en.md`

هر وقت خواستی عوضش کن و تاریخ `updated` بالای فایل را جلو ببر.

### ۷. رنگ‌ها و تم → `src/app/globals.css`

پالت سایت و اتاق از توکن‌های CSS می‌آید. برای عوض کردن رنگ اصلی،
کافی است `--accent` را در `:root` (تم روز) و `.dark` (تم شب) تغییر بدهی.
رنگ نور اتاق در `src/components/room/roomConfig.ts` است.

---

## ساختار پروژه

```
my-room/
├── content/                    ← تمام محتوای تو
│   ├── site.ts                 ← اسم، بیو، شبکه‌های اجتماعی   ← از اینجا شروع کن
│   ├── gallery.ts              ← آیتم‌های گالری
│   ├── links.ts                ← آرشیو لینک‌ها
│   ├── now/{fa,en}.md          ← صفحه‌ی «الان»
│   ├── posts/{fa,en}/*.mdx
│   └── projects/{fa,en}/*.mdx
│
├── public/
│   ├── fonts/                  ← وزیرمتن (woff2 برای سایت، ttf برای OG)
│   ├── gallery/                ← عکس‌ها
│   ├── avatar.svg
│   └── icon.svg
│
├── src/
│   ├── proxy.ts                ← ریدایرکت به زبان پیش‌فرض (Next 16 middleware)
│   ├── app/
│   │   ├── [locale]/           ← همه‌ی صفحات، دوزبانه
│   │   │   ├── layout.tsx      ← <html lang dir>، هدر، فوتر، متادیتا
│   │   │   ├── page.tsx        ← اتاق + بخش‌های صفحه‌ی اصلی
│   │   │   ├── projects/  blog/  gallery/  now/  about/
│   │   │   ├── og/route.tsx    ← ساخت تصویر OG
│   │   │   └── rss.xml/route.ts
│   │   ├── sitemap.ts  robots.ts  globals.css
│   ├── components/
│   │   ├── room/               ← اتاق سه‌بعدی و حالت دوبعدی
│   │   ├── shell/              ← هدر، فوتر، سوییچ زبان و تم
│   │   ├── mdx/                ← رندر MDX
│   │   ├── blog/  gallery/  ui/
│   │   └── CommandPalette.tsx
│   └── lib/                    ← محتوا، i18n، تم، هوک‌ها، ابزارها
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

پیش‌نویس‌ها در بیلد پروداکشن همیشه پنهان می‌شوند.

---

## دیپلوی روی Render

خلاصه:

1. ریپو را به گیت‌هاب پوش کن.
2. در Render → **New → Blueprint** → ریپو را انتخاب کن. `render.yaml` بقیه را می‌سازد.
3. در تنظیمات سرویس، `NEXT_PUBLIC_SITE_URL` را به دامنه‌ی واقعی‌ات ست کن.
4. در گیت‌هاب → Settings → Secrets → یک سکرت به اسم `RENDER_DEPLOY_HOOK_URL` بساز
   (مقدارش را از Render → Settings → Deploy Hook می‌گیری).

از این به بعد هر پوش به `main`:

```
lint + typecheck  →  build  →  اگر سبز بود، تریگر دیپلوی Render
```

راهنمای کامل با عیب‌یابی: **[docs/DEPLOY.md](docs/DEPLOY.md)**

---

## تصمیم‌های فنی

چند انتخاب که ممکن است سؤال‌برانگیز باشند و دلیلشان:

- **اتاق سه‌بعدی دکور است، نه محصول.** همه‌ی محتوا بدون WebGL هم کاملاً در دسترس است.
  این تنها تصمیم مهم معماری این پروژه است.
- **هیچ مدل سه‌بعدی آماده‌ای وجود ندارد.** کل اتاق با کد ساخته شده
  (جعبه، استوانه، صفحه). به همین دلیل صفحه‌ی اصلی هیچ فایل سنگینی دانلود نمی‌کند.
- **بلوک‌های کد همیشه تیره‌اند، در هر دو تم.** یک تم Shiki به‌جای دو تا،
  و یک پنل تیره که در هر دو حالت عمدی به نظر می‌رسد.
- **فیلتر برچسب بلاگ سمت کلاینت است.** با `?tag=` کل ایندکس بلاگ باید در هر درخواست
  روی سرور رندر می‌شد؛ با این حجم محتوا، فیلتر در مرورگر آنی است و مسیر استاتیک می‌ماند.
- **فونت‌ها self-host هستند (وزیرمتن).** بیلد هیچ‌وقت به Google Fonts وابسته نیست،
  و متن فارسی با همان فونتی رندر می‌شود که تصویر OG با آن ساخته می‌شود.
- **کنترل بازیکن دستی نوشته شده.** `PointerLockControls` آماده روی هر کلیک قفل می‌کند
  و با کلیک روی نشانگرها تعارض پیدا می‌کرد؛ اینجا قفل فقط با کلیک روی فضای خالی فعال می‌شود.
- **`turbopack.root` صریحاً ست شده** تا Turbopack تا پوشه‌ی خانه بالا نرود.

---

## English

A bilingual personal site built as a walkable 3D room. The desk opens the
portfolio, the bookshelf the blog, the gallery wall the photos, and the door
leads to the contact page. A flat 2D version of the same room is used on phones,
when `prefers-reduced-motion` is set, or when WebGL is unavailable — no content
is ever locked behind the canvas.

Everything is file-based: `content/site.ts` for identity, MDX files for posts and
projects, typed arrays for the gallery and link archive. There is no database and
no admin panel.

**Stack:** Next.js 16 (App Router) · React 19 · three.js via React Three Fiber ·
Tailwind CSS v4 · MDX via next-mdx-remote · Shiki · deployed on Render with
GitHub Actions CI/CD.

**Quick start:** `npm install && npm run dev`, then open `http://localhost:3000`
and follow the redirect to `/fa` or `/en`.

**Deploy:** see [docs/DEPLOY.md](docs/DEPLOY.md).

---

## مجوز

[MIT](LICENSE) — هر طور که می‌خواهی استفاده کن.
