import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'

import { site } from '@content/site'
import { createArtwork } from '@/lib/generative/artwork'
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const locale = resolveLocale((await params).locale)
  const meta = localeMeta[locale]

  const { searchParams } = new URL(request.url)

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

  /*
   * The same seed the page uses, so the social card is built from the same
   * palette and light source as the artwork behind the article. Satori cannot
   * render the SVG (no filters, no blend modes), so the composition is
   * approximated with gradients — but the colour is exact.
   */
  const art = createArtwork(searchParams.get('seed') || title, {
    width: 1200,
    height: 630,
    density: 'rich',
  })

  const orbX = 74
  const orbY = 24

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
          backgroundColor: art.background.from,
          backgroundImage: [
            `radial-gradient(circle at ${orbX}% ${orbY}%, ${art.palette.glow}, transparent 46%)`,
            `radial-gradient(circle at 12% 92%, ${art.palette.ink[1]}, transparent 52%)`,
            `linear-gradient(140deg, ${art.background.from} 0%, ${art.background.to} 100%)`,
          ].join(', '),
          fontFamily: 'Vazirmatn',
        }}
      >
        {/* Ink ribbons, approximated with rotated gradient bars */}
        <div
          style={{
            position: 'absolute',
            top: 330,
            left: -60,
            width: 1400,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${art.palette.ink[0]}, transparent)`,
            opacity: 0.55,
            transform: 'rotate(-4deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 430,
            left: -60,
            width: 1400,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${art.palette.ink[2]}, transparent)`,
            opacity: 0.5,
            transform: 'rotate(3deg)',
          }}
        />

        {/* Header: the room mark, drawn inline so it needs no asset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              border: `2px solid ${art.palette.glow}`,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 8,
            }}
          >
            <div
              style={{ width: 16, height: 20, backgroundColor: art.palette.glow, borderRadius: 3 }}
            />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 26 }}>
            {site.name[locale]}
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems }}>
          <div
            style={{
              color: '#f7f3ec',
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
                color: 'rgba(255,255,255,0.66)',
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
            borderTop: '1px solid rgba(255,255,255,0.14)',
            paddingTop: 26,
            color: 'rgba(255,255,255,0.5)',
            fontSize: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{ width: 34, height: 4, backgroundColor: art.palette.glow, borderRadius: 2 }}
            />
            <div>{site.handle}</div>
          </div>
          <div>{isRtl ? 'هر تصویر این سایت با کد ساخته می‌شود' : 'Every image here is generated'}</div>
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
