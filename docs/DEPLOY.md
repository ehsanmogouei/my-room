# راهنمای دیپلوی — گیت‌هاب به Render

این سند کل مسیر را از یک پوشه‌ی لوکال تا یک سایت زنده روی Render توضیح می‌دهد.

---

## نگاه کلی

```
        git push origin main
                 │
                 ▼
┌──────────────────────────────────────┐
│  GitHub Actions  (.github/workflows) │
│  1. کیفیت:  typecheck + lint         │
│  2. بیلد:   next build               │
│  3. دیپلوی: فراخوانی Deploy Hook     │
└──────────────────────────────────────┘
                 │  فقط اگر هر سه سبز باشند
                 ▼
┌──────────────────────────────────────┐
│  Render  →  npm ci && npm run build  │
│           →  npm start               │
└──────────────────────────────────────┘
```

دیپلوی خودکار خود Render **خاموش** است (`autoDeployTrigger: 'off'` در `render.yaml`)
تا هیچ کدی بدون عبور از تست‌ها منتشر نشود. اگر ترجیح می‌دهی ساده‌تر باشد،
[راه‌حل جایگزین](#جایگزین-دیپلوی-خودکار-روی-هر-پوش) را ببین.

---

## ۱. آماده‌سازی لوکال

```bash
npm install
npm run check     # typecheck + lint
npm run build     # مطمئن شو بیلد لوکال سبز است
```

اگر این‌ها سبز نبودند، روی Render هم سبز نخواهند بود. اول اینجا حلش کن.

---

## ۲. پوش به گیت‌هاب

اگر ریپو را همین حالا ساخته‌ای:

```bash
git init
git add .
git commit -m "feat: the room"
git branch -M main
git remote add origin https://github.com/<username>/my-room.git
git push -u origin main
```

---

## ۳. ساخت سرویس روی Render (با Blueprint)

1. وارد [dashboard.render.com](https://dashboard.render.com) شو.
2. **New → Blueprint**.
3. ریپوی `my-room` را انتخاب کن. Render فایل `render.yaml` را می‌خواند و
   یک Web Service با این تنظیمات می‌سازد:

   | تنظیم | مقدار |
   | --- | --- |
   | Runtime | Node |
   | Plan | Free |
   | Build Command | `npm ci && npm run build` |
   | Start Command | `npm start` |
   | Health Check Path | `/fa` |

4. Render یک متغیر `NEXT_PUBLIC_SITE_URL` با `sync: false` می‌سازد و از تو مقدار می‌خواهد.
   **همین حالا خالی بگذار** — بعد از اولین دیپلوی، آدرس سرویس را می‌گیری و پرش می‌کنی.
5. **Apply**.

اولین بیلد چند دقیقه طول می‌کشد (نصب وابستگی‌ها + بیلد Next).
بعد از تمام شدن، آدرسی مثل `https://my-room-xxxx.onrender.com` می‌گیری.

> اگر `NEXT_PUBLIC_SITE_URL` را خالی بگذاری، سایت از `RENDER_EXTERNAL_URL`
> که خود Render ست می‌کند استفاده می‌کند. پس هیچ‌چیز نمی‌شکند — فقط بهتر است
> بعداً مقدار صریح بدهی تا canonical و sitemap دقیق باشند.

---

## ۴. وصل کردن Deploy Hook به گیت‌هاب

1. در Render → سرویس `my-room` → **Settings** → بخش **Deploy Hook** →
   آدرس را کپی کن. شکلش این است:
   `https://api.render.com/deploy/srv-xxxxxxxx?key=yyyyyyyy`
2. در گیت‌هاب → ریپو → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Secret: همان آدرسی که کپی کردی
3. تمام. از این به بعد هر پوش به `main` بعد از سبز شدن تست‌ها، دیپلوی را تریگر می‌کند.

> اگر این سکرت را نسازی، ورک‌فلو **خطا نمی‌دهد**؛ فقط یک warning می‌دهد و
> مرحله‌ی دیپلوی را رد می‌کند. پس اگر دیدی سایت آپدیت نمی‌شود، اول این را چک کن.

---

## ۵. دامنه‌ی اختصاصی (اختیاری)

1. Render → سرویس → **Settings → Custom Domains → Add Custom Domain**.
2. در پنل DNS دامنه‌ات، رکوردی که Render می‌گوید را اضافه کن:
   - برای دامنه‌ی اصلی: `A` به IP که Render می‌دهد
   - برای `www`: `CNAME` به `<service>.onrender.com`
3. صبر کن تا گواهی SSL خودکار صادر شود (چند دقیقه تا چند ساعت).
4. **مهم:** بعد از وصل شدن دامنه، برو در Render → Environment و
   `NEXT_PUBLIC_SITE_URL` را به `https://your-domain.com` تغییر بده و دوباره دیپلوی کن.
   بدون این کار، لینک‌های canonical و `sitemap.xml` به آدرس `onrender.com` اشاره می‌کنند.

---

## جایگزین: دیپلوی خودکار روی هر پوش

اگر GitHub Actions را نمی‌خواهی:

1. در `render.yaml` مقدار `autoDeployTrigger` را از `'off'` به `'commit'` عوض کن.
2. در `.github/workflows/ci.yml` کل job با نام `deploy` را حذف کن.

از این به بعد Render خودش روی هر پوش به شاخه‌ی اصلی بیلد و منتشر می‌کند.
تست‌ها همچنان در گیت‌هاب اجرا می‌شوند، ولی دیگر جلوی دیپلوی را نمی‌گیرند.

---

## نکته‌های پلن رایگان Render

- **خواب رفتن:** سرویس رایگان بعد از ۱۵ دقیقه بی‌استفادگی خواب می‌رود.
  اولین درخواست بعدی ۳۰ تا ۶۰ ثانیه طول می‌کشد تا بیدار شود. برای یک سایت شخصی
  طبیعی است؛ اگر آزاردهنده بود، پلن Starter این مشکل را حل می‌کند.
- **حافظه:** سرویس رایگان ۵۱۲ مگابایت رم دارد. این پروژه راحت داخلش جا می‌شود،
  ولی اگر بعداً چیز سنگینی اضافه کردی حواست باشد.
- **بیلد:** بیلد روی Render انجام می‌شود، نه روی کامپیوتر تو. پس هر چیزی که
  در زمان بیلد لازم است باید در ریپو باشد — به همین دلیل فونت‌ها داخل `public/fonts`
  کامیت شده‌اند و پروژه به هیچ CDN فونتی وابسته نیست.
- **متغیرهای محیطی** بعد از تغییر نیاز به دیپلوی مجدد دارند (Render خودش پیشنهاد می‌دهد).

---

## عیب‌یابی

| نشانه | علت احتمالی | راه‌حل |
| --- | --- | --- |
| بیلد روی Render خطای «module not found» می‌دهد | `package-lock.json` کامیت نشده | `git add package-lock.json` و پوش کن؛ Render از `npm ci` استفاده می‌کند که به lockfile نیاز دارد |
| سایت آپدیت نمی‌شود ولی Actions سبز است | سکرت `RENDER_DEPLOY_HOOK_URL` ست نشده | مرحله‌ی `deploy` را در Actions ببین؛ warning می‌دهد. سکرت را اضافه کن |
| مرحله‌ی `deploy` با HTTP 401 یا 404 می‌افتد | Deploy Hook باطل شده | در Render یک Hook جدید بساز و سکرت گیت‌هاب را به‌روز کن |
| صفحه سفید است ولی HTML می‌آید | WebGL در مرورگر کاربر نیست | باید خودکار حالت دوبعدی بیاید؛ کنسول مرورگر را ببین |
| متن فارسی مربع‌مربع است | فونت لود نشده | مطمئن شو `public/fonts/vazirmatn-arabic.woff2` در ریپو هست (ممکن است `.gitignore` بلوکش کرده باشد) |
| `/en/rss.xml` محتوای فارسی می‌دهد | `generateStaticParams` در route handler جا افتاده | در `src/app/[locale]/rss.xml/route.ts` باید هر دو زبان برگردد |
| تصویر OG ساخته نمی‌شود | فونت TTF پیدا نمی‌شود | `public/fonts/Vazirmatn-Regular.ttf` و `Vazirmatn-Bold.ttf` باید موجود باشند |
| تایپ‌چک روی CI می‌افتد ولی لوکال سبز است | نسخه‌ی Node متفاوت | `NODE_VERSION=22` در `render.yaml` و `node-version: 22` در ورک‌فلو؛ لوکال هم همان باشد |

---

## چک‌لیست بعد از اولین دیپلوی

- [ ] `https://<domain>/` به `/fa` ریدایرکت می‌شود
- [ ] `https://<domain>/en` هم کار می‌کند
- [ ] اتاق سه‌بعدی بالا می‌آید و با کلیک، ماوس قفل می‌شود
- [ ] دکمه‌ی «حالت ساده» اتاق دوبعدی را نشان می‌دهد
- [ ] `/fa/blog/why-i-built-a-room` باز می‌شود و بلوک کد رنگ‌آمیزی دارد
- [ ] `/fa/gallery` لایت‌باکس را باز می‌کند
- [ ] `/fa/rss.xml` خوراک معتبر می‌دهد و `/en/rss.xml` انگلیسی است
- [ ] `/sitemap.xml` و `/robots.txt` جواب می‌دهند
- [ ] `/fa/og?title=تست` یک تصویر PNG برمی‌گرداند و متن فارسی درست شکل گرفته
- [ ] در Actions، job دیپلوی سبز شده است
