import { createArtwork, type ArtworkOptions, type Blend } from '@/lib/generative/artwork'
import { cn } from '@/lib/utils'

/** The shared film-grain filter, defined once for the whole document. */
export const GRAIN_FILTER_ID = 'site-grain'

/**
 * Mounted once in the layout. Every artwork references this filter by id, so
 * the turbulence is defined a single time instead of once per picture.
 *
 * Uses `width: 0; height: 0` rather than `display: none`, because a filter
 * inside a `display: none` SVG is not resolvable in every browser.
 */
export function GrainDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <filter id={GRAIN_FILTER_ID} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
    </svg>
  )
}

const blendStyle = (blend?: Blend) =>
  blend && blend !== 'normal' ? { mixBlendMode: blend } : undefined

export interface GenerativeArtProps {
  /** Any string. The same seed always yields the same picture. */
  seed: string
  className?: string
  width?: number
  height?: number
  density?: ArtworkOptions['density']
  inkSetId?: string
  archetype?: ArtworkOptions['archetype']
  /** Screen-reader description. Omit for purely decorative artwork. */
  label?: string
}

/**
 * A deterministic, seed-generated illustration in the manner of a risograph
 * print, rendered as inline SVG on the server.
 *
 * No image file, no client JavaScript, and no two pieces of content look alike.
 * The same seed drives the Open Graph card, so a link preview matches the page
 * it points at.
 */
export function GenerativeArt({
  seed,
  className,
  width = 1200,
  height = 900,
  density = 'compact',
  inkSetId,
  archetype,
  label,
}: GenerativeArtProps) {
  const art = createArtwork(seed, { width, height, density, inkSetId, archetype })

  const id = (name: string) => `${art.id}-${name}`
  const [inkA, inkB, inkC] = art.palette.ink
  const grain = density === 'rich'

  return (
    <svg
      viewBox={`0 0 ${art.width} ${art.height}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn('block h-full w-full', className)}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={id('bg')} gradientTransform={`rotate(${art.background.angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={art.background.from} />
          <stop offset="100%" stopColor={art.background.to} />
        </linearGradient>

        {/* Tighter falloff than a plain radial: a wide glow washed every
            composition out into the same haze. */}
        <radialGradient id={id('glow')}>
          <stop offset="0%" stopColor={art.palette.glow} stopOpacity="1" />
          <stop offset="22%" stopColor={art.palette.glow} stopOpacity="0.55" />
          <stop offset="55%" stopColor={art.palette.glow} stopOpacity="0.16" />
          <stop offset="100%" stopColor={art.palette.glow} stopOpacity="0" />
        </radialGradient>

        <radialGradient id={id('vignette')}>
          <stop offset="42%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity={art.vignette} />
        </radialGradient>

        {/* Light-filled gradients used by the arch, shaft and horizon families. */}
        <linearGradient id={id('inkLight-v')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={art.palette.glow} stopOpacity="1" />
          <stop offset="55%" stopColor={art.palette.glow} stopOpacity="0.45" />
          <stop offset="100%" stopColor={art.palette.glow} stopOpacity="0" />
        </linearGradient>

        <linearGradient id={id('inkLight-h')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={art.palette.glow} stopOpacity="0" />
          <stop offset="50%" stopColor={art.palette.glow} stopOpacity="1" />
          <stop offset="100%" stopColor={art.palette.glow} stopOpacity="0" />
        </linearGradient>

        <linearGradient id={id('ink0-v')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={inkA} stopOpacity="0.9" />
          <stop offset="100%" stopColor={inkA} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('ink1-v')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={inkB} stopOpacity="0.9" />
          <stop offset="100%" stopColor={inkB} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('ink2-v')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={inkC} stopOpacity="0.9" />
          <stop offset="100%" stopColor={inkC} stopOpacity="0" />
        </linearGradient>

        <clipPath id={id('clip')}>
          <rect width={art.width} height={art.height} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id('clip')})`}>
        <rect width={art.width} height={art.height} fill={`url(#${id('bg')})`} />

        {art.layers.map((layer, index) => {
          const paint = layer.gradient ? `url(#${id(layer.gradient)})` : undefined

          if (layer.kind === 'circle') {
            return (
              <circle
                key={index}
                cx={layer.cx}
                cy={layer.cy}
                r={layer.r}
                fill={paint ?? layer.fill}
                opacity={layer.opacity}
                transform={layer.transform}
                style={blendStyle(layer.blend)}
              />
            )
          }

          return (
            <path
              key={index}
              d={layer.d}
              fill={paint ?? layer.fill ?? 'none'}
              stroke={layer.stroke}
              strokeWidth={layer.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={layer.opacity}
              transform={layer.transform}
              style={blendStyle(layer.blend)}
            />
          )
        })}

        <rect
          width={art.width}
          height={art.height}
          fill={`url(#${id('vignette')})`}
          style={{ mixBlendMode: 'multiply' }}
        />

        {grain && (
          <rect
            width={art.width}
            height={art.height}
            filter={`url(#${GRAIN_FILTER_ID})`}
            opacity={art.grain * 0.14}
            style={{ mixBlendMode: 'overlay' }}
          />
        )}
      </g>
    </svg>
  )
}
