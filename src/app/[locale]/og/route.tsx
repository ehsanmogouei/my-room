import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'

import { site } from '@content/site'
import { localeMeta, resolveLocale } from '@/lib/types'

export const runtime = 'nodejs'

const SIZE = { width: 1200, height: 630 }

/**
 * Fonts are read once per process, not once per image.
 * They live in `public/fonts` so the same files that the site serves are the
 * ones satori shapes with — the Persian title in the card matches the page.
 */
let fontCache: Promise<{ regular: Buffer; bold: Buffer }> | null = null

function loadFonts() {
  fontCache ??= (async () => {
    const dir = path.join(process.cwd(), 'public', 'fonts')

    const [regular, bold] = await Promise.all([
      readFile(path.join(dir, 'Vazirmatn-Regular.ttf')),
      readFile(path.join(dir, 'Vazirmatn-Bold.ttf')),
    ])

    return { regular, bold }
  })()

  return fontCache
}

const TONES = {
  post: { accent: '#e0a35c', glow: 'rgba(224,163,92,0.22)' },
  project: { accent: '#8fb0a0', glow: 'rgba(143,176,160,0.2)' },
  page: { accent: '#c98a6b', glow: 'rgba(201,138,107,0.2)' },
} as const

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const locale = resolveLocale((await params).locale)
  const meta = localeMeta[locale]

  const { searchParams } = new URL(request.url)
  const kind = (searchParams.get('kind') ?? 'page') as keyof typeof TONES
  const tone = TONES[kind] ?? TONES.page

  const isRtl = meta.dir === 'rtl'

  /**
   * Satori renders the zero-width non-joiner as a full space, which stretches
   * Persian words apart. A normal space keeps the word boundary — which is all
   * the ZWNJ was there to mark — and lays out cleanly.
   */
  const normalize = (value: string) =>
    (isRtl ? value.replace(/\u200c/g, ' ') : value).slice(0, 160)

  const title = normalize(searchParams.get('title') || site.name[locale])
  const subtitle = normalize(searchParams.get('subtitle') || site.tagline[locale])

  const { regular, bold } = await loadFonts()

  // Direction goes on the text blocks rather than the container: a container
  // level `direction: rtl` made satori pad every word apart.
  const textAlign = isRtl ? 'right' : 'left'
  const alignItems = isRtl ? 'flex-end' : 'flex-start'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems,
          padding: 72,
          backgroundColor: '#0d1017',
          backgroundImage: `radial-gradient(circle at 78% 22%, ${tone.glow}, transparent 58%), radial-gradient(circle at 12% 88%, rgba(65,82,127,0.28), transparent 55%)`,
          fontFamily: 'Vazirmatn',
        }}
      >
        {/* Header: the room mark, drawn inline so it needs no asset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              border: `2px solid ${tone.accent}`,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 8,
            }}
          >
            <div style={{ width: 16, height: 20, backgroundColor: tone.accent, borderRadius: 3 }} />
          </div>
          <div style={{ color: '#9aa4b6', fontSize: 26 }}>
            {site.name[locale]}
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems }}>
          <div
            style={{
              color: '#f2ede4',
              fontSize: title.length > 60 ? 56 : 68,
              fontWeight: 700,
              lineHeight: 1.4,
              maxWidth: 980,
              textAlign,
              direction: meta.dir,
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                color: '#9aa4b6',
                fontSize: 30,
                lineHeight: 1.65,
                maxWidth: 900,
                textAlign,
                direction: meta.dir,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
            borderTop: '1px solid rgba(255,255,255,0.09)',
            paddingTop: 26,
            color: '#6a748a',
            fontSize: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 4, backgroundColor: tone.accent, borderRadius: 2 }} />
            <div>{site.handle}</div>
          </div>
          <div>{isRtl ? 'این اتاق باز است' : 'The door is open'}</div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: 'Vazirmatn', data: regular, weight: 400, style: 'normal' },
        { name: 'Vazirmatn', data: bold, weight: 700, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  )
}
