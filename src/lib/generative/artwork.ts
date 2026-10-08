import {
  createNoise1D,
  createRng,
  INK_SETS,
  mixHex,
  shiftLightness,
  withAlpha,
  type InkSet,
} from './palette'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type Blend = 'normal' | 'screen' | 'multiply' | 'overlay'

/**
 * A composition family. Without these the generator converges on one mood —
 * fog with a sun in it — no matter the seed. Five families give real variety
 * while keeping every result recognisably part of the same series.
 */
export type Archetype = 'arch' | 'horizon' | 'waves' | 'orbit' | 'shafts'

export type ArtLayer =
  | {
      kind: 'path'
      d: string
      fill?: string
      stroke?: string
      strokeWidth?: number
      opacity: number
      blend?: Blend
      /** Name of a gradient in the artwork's <defs>, e.g. `ink0-v`. */
      gradient?: string
      transform?: string
    }
  | {
      kind: 'circle'
      cx: number
      cy: number
      r: number
      fill?: string
      opacity: number
      blend?: Blend
      gradient?: string
      transform?: string
    }

export interface ArtworkSpec {
  id: string
  seed: string
  archetype: Archetype
  width: number
  height: number
  palette: InkSet
  background: { from: string; to: string; angle: number }
  layers: ArtLayer[]
  vignette: number
  grain: number
}

export interface ArtworkOptions {
  width?: number
  height?: number
  /** `rich` for hero and header artwork, `compact` for thumbnails. */
  density?: 'rich' | 'compact'
  inkSetId?: string
  archetype?: Archetype
}

/* -------------------------------------------------------------------------- */
/* Geometry                                                                   */
/* -------------------------------------------------------------------------- */

type Point = [number, number]

const r2 = (value: number) => Math.round(value * 100) / 100

/** Catmull-Rom through the points, emitted as cubic beziers. */
function smoothPath(points: Point[], close = false): string {
  if (points.length < 2) return ''

  let d = `M${r2(points[0][0])} ${r2(points[0][1])}`

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index]
    const current = points[index]
    const next = points[index + 1]
    const after = points[index + 2] ?? next

    d +=
      `C${r2(current[0] + (next[0] - previous[0]) / 6)} ${r2(current[1] + (next[1] - previous[1]) / 6)} ` +
      `${r2(next[0] - (after[0] - current[0]) / 6)} ${r2(next[1] - (after[1] - current[1]) / 6)} ` +
      `${r2(next[0])} ${r2(next[1])}`
  }

  return close ? `${d}Z` : d
}

/** A rounded arch: two straight sides and a semicircular head. */
function archPath(
  left: number,
  right: number,
  top: number,
  bottom: number,
  headScale = 1,
): string {
  const radius = ((right - left) / 2) * headScale
  const cy = top + radius

  return [
    `M${r2(left)} ${r2(bottom)}`,
    `L${r2(left)} ${r2(cy)}`,
    `A${r2(radius)} ${r2(radius)} 0 0 1 ${r2(left + radius)} ${r2(top)}`,
    `L${r2(right - radius)} ${r2(top)}`,
    `A${r2(radius)} ${r2(radius)} 0 0 1 ${r2(right)} ${r2(cy)}`,
    `L${r2(right)} ${r2(bottom)}`,
    'Z',
  ].join('')
}

/** A bold horizontal band that undulates across the full width. */
function waveBand(
  width: number,
  baseY: number,
  thickness: number,
  amplitude: number,
  noise: (t: number) => number,
): string {
  const samples = 9
  const top: Point[] = []
  const bottom: Point[] = []

  for (let index = 0; index <= samples; index += 1) {
    const t = index / samples
    const x = t * width
    const y = baseY + (noise(t) - 0.5) * amplitude
    const half = (thickness / 2) * (0.35 + 0.65 * Math.sin(Math.PI * t))

    top.push([x, y - half])
    bottom.push([x, y + half])
  }

  const topPath = smoothPath(top)
  const bottomPath = smoothPath(bottom.reverse())

  return `${topPath}${bottomPath.slice(1)}Z`
}

/** An open stroke crossing the canvas. */
function flowLine(
  fromX: number,
  toX: number,
  baseY: number,
  amplitude: number,
  noise: (t: number) => number,
): string {
  const samples = 9
  const points: Point[] = []

  for (let index = 0; index <= samples; index += 1) {
    const t = index / samples
    points.push([fromX + (toX - fromX) * t, baseY + (noise(t) - 0.5) * amplitude])
  }

  return smoothPath(points)
}

/** A closed ellipse, so it can be tilted with a transform like any other path. */
function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return (
    `M${r2(cx - rx)} ${r2(cy)}` +
    `A${r2(rx)} ${r2(ry)} 0 1 0 ${r2(cx + rx)} ${r2(cy)}` +
    `A${r2(rx)} ${r2(ry)} 0 1 0 ${r2(cx - rx)} ${r2(cy)}Z`
  )
}


/* -------------------------------------------------------------------------- */
/* Composition                                                                */
/* -------------------------------------------------------------------------- */

const ARCHETYPES: Archetype[] = ['arch', 'horizon', 'waves', 'orbit', 'shafts']

/**
 * Turns any string into a complete, deterministic artwork.
 *
 * The same seed always produces the same picture, which is what lets a post's
 * cover, its social card and its in-page header be one piece of art without an
 * image file existing anywhere.
 */
export function createArtwork(seed: string, options: ArtworkOptions = {}): ArtworkSpec {
  const { width = 1200, height = 900, density = 'compact', inkSetId, archetype } = options

  const rng = createRng(seed)
  const inkSet =
    (inkSetId ? INK_SETS.find((set) => set.id === inkSetId) : undefined) ?? rng.pick(INK_SETS)

  const family = archetype ?? rng.pick(ARCHETYPES)
  const rich = density === 'rich'
  const short = Math.min(width, height)
  const id = `art-${hash36(seed)}`

  const [inkA, inkB, inkC] = inkSet.ink

  /* ---------------------------------------------------------- background */
  // Mixing more of the ink into the ground than before: the earlier version
  // was so dark that every picture read as the same brown fog.
  const background = {
    from: mixHex(inkSet.ground[0], inkB, rng.range(0.02, 0.1)),
    to: mixHex(inkSet.ground[1], inkA, rng.range(0.08, 0.22)),
    angle: rng.range(0, 360),
  }

  const layers: ArtLayer[] = []
  const horizon = height * rng.range(0.52, 0.72)

  /* ------------------------------------------------------------ archetype */
  switch (family) {
    case 'arch': {
      // Light coming through a doorway. The site's whole metaphor, drawn.
      const archWidth = width * rng.range(0.36, 0.58)
      const left = width * rng.range(0.2, 0.6) - archWidth / 2
      const right = left + archWidth
      const top = height * rng.range(0.08, 0.2)

      const rings = rich ? rng.int(3, 5) : rng.int(1, 2)
      for (let index = rings; index >= 0; index -= 1) {
        const inset = index * short * rng.range(0.05, 0.085)
        layers.push({
          kind: 'path',
          d: archPath(left - inset, right + inset, Math.max(0, top - inset * 0.7), height + 2),
          stroke: index % 2 === 0 ? inkA : inkC,
          strokeWidth: Math.max(0.8, short * 0.0022),
          opacity: 0.3 - index * 0.045,
        })
      }

      // The doorway itself, filled with light from the bottom.
      layers.push({
        kind: 'path',
        d: archPath(left, right, top, height),
        gradient: 'inkLight-v',
        opacity: rng.range(0.55, 0.85),
        blend: 'screen',
      })

      layers.push({
        kind: 'circle',
        cx: (left + right) / 2,
        cy: horizon,
        r: archWidth * rng.range(0.42, 0.62),
        gradient: 'glow',
        opacity: rng.range(0.7, 1),
        blend: 'screen',
      })

      // Ground plane in front of the arch.
      layers.push({
        kind: 'path',
        d: waveBand(width, horizon + height * 0.08, short * 0.22, height * 0.1, createNoise1D(rng, 6)),
        fill: inkC,
        opacity: rng.range(0.16, 0.3),
      })
      break
    }

    case 'horizon': {
      // A bright band of light on the horizon, land below, sky above.
      const bandHeight = short * rng.range(0.035, 0.075)

      layers.push({
        kind: 'path',
        d: waveBand(width, horizon, bandHeight, height * 0.03, createNoise1D(rng, 5)),
        gradient: 'inkLight-h',
        opacity: 0.85,
        blend: 'screen',
      })

      layers.push({
        kind: 'circle',
        cx: width * rng.range(0.2, 0.8),
        cy: horizon - height * rng.range(0.06, 0.2),
        r: short * rng.range(0.09, 0.17),
        gradient: 'glow',
        opacity: rng.range(0.5, 0.72),
        blend: 'screen',
      })

      const bands = rich ? rng.int(4, 7) : rng.int(2, 4)
      for (let index = 0; index < bands; index += 1) {
        const t = index / bands
        const isBelow = index % 2 === 0
        layers.push({
          kind: 'path',
          d: waveBand(
            width,
            horizon + (isBelow ? 1 : -1) * height * (0.06 + t * 0.34),
            short * rng.range(0.03, 0.1),
            height * rng.range(0.05, 0.16),
            createNoise1D(rng, 7),
          ),
          fill: rng.pick([inkA, inkB, inkC]),
          opacity: rng.range(0.16, 0.38),
        })
      }
      break
    }

    case 'waves': {
      // Bold overlapping swells. The most graphic of the five.
      const bands = rich ? rng.int(5, 8) : rng.int(3, 5)
      const inks = [inkA, inkB, inkC]

      for (let index = 0; index < bands; index += 1) {
        const t = index / Math.max(1, bands - 1)
        const ink = inks[index % 3]

        layers.push({
          kind: 'path',
          d: waveBand(
            width,
            height * (0.3 + t * 0.85),
            short * rng.range(0.07, 0.18),
            height * rng.range(0.08, 0.22),
            createNoise1D(rng, rng.int(5, 8)),
          ),
          fill: rng.chance(0.3) ? shiftLightness(ink, 0.15) : ink,
          opacity: rng.range(0.2, 0.46),
        })
      }

      layers.push({
        kind: 'circle',
        cx: width * rng.range(0.15, 0.85),
        cy: height * rng.range(0.12, 0.34),
        r: short * rng.range(0.08, 0.15),
        gradient: 'glow',
        opacity: rng.range(0.5, 0.72),
        blend: 'screen',
      })
      break
    }

    case 'orbit': {
      // A ringed planet rather than concentric circles. The earlier version
      // was a bullseye; a lit disc with rings and a crescent shadow has an
      // actual subject.
      const cx = width * rng.range(0.3, 0.7)
      const cy = height * rng.range(0.32, 0.58)
      const core = short * rng.range(0.11, 0.17)
      const tilt = rng.range(-32, -12)

      // Halo behind the disc.
      layers.push({
        kind: 'circle',
        cx,
        cy,
        r: core * 3.1,
        gradient: 'glow',
        opacity: rng.range(0.45, 0.68),
        blend: 'screen',
      })

      // Rings, drawn behind and in front so the disc sits inside them.
      const ringCount = rich ? rng.int(2, 4) : rng.int(1, 2)
      for (let index = 0; index < ringCount; index += 1) {
        const spread = 1.5 + index * rng.range(0.32, 0.5)

        layers.push({
          kind: 'path',
          d: ellipsePath(cx, cy, core * spread * 1.9, core * spread * 0.52),
          stroke: index % 2 === 0 ? inkA : inkC,
          strokeWidth: Math.max(0.8, short * rng.range(0.0018, 0.004)),
          opacity: rng.range(0.3, 0.6),
          transform: `rotate(${tilt} ${r2(cx)} ${r2(cy)})`,
        })
      }

      // The disc, lit from one side.
      layers.push({
        kind: 'circle',
        cx,
        cy,
        r: core,
        fill: mixHex(inkA, inkSet.glow, 0.4),
        opacity: 0.95,
      })

      // An offset ground-coloured disc carves the crescent.
      layers.push({
        kind: 'circle',
        cx: cx - core * rng.range(0.24, 0.4),
        cy: cy - core * rng.range(0.14, 0.3),
        r: core * 0.97,
        fill: background.from,
        opacity: 0.94,
      })

      // A diagonal light band across the whole frame.
      layers.push({
        kind: 'path',
        d: flowLine(
          -width * 0.05,
          width * 1.05,
          height * rng.range(0.3, 0.8),
          height * rng.range(0.14, 0.28),
          createNoise1D(rng, 5),
        ),
        stroke: inkSet.glow,
        strokeWidth: Math.max(1, short * rng.range(0.002, 0.005)),
        opacity: rng.range(0.3, 0.55),
        blend: 'screen',
      })
      break
    }

    case 'shafts': {
      // Vertical light through a gap. Reads as a window, which suits /now.
      const shafts = rich ? rng.int(5, 8) : rng.int(3, 5)
      const vanish = width * rng.range(0.35, 0.65)

      for (let index = 0; index < shafts; index += 1) {
        const t = index / Math.max(1, shafts - 1)
        const topX = width * (-0.15 + t * 1.25) + rng.range(-30, 30)
        const w = width * rng.range(0.035, 0.11)
        const skew = (vanish - topX) * rng.range(0.16, 0.4)

        layers.push({
          kind: 'path',
          d: `M${r2(topX)} 0L${r2(topX + w)} 0L${r2(topX + w + skew)} ${height}L${r2(topX + skew)} ${height}Z`,
          gradient: 'inkLight-v',
          opacity: rng.range(0.18, 0.42),
          blend: 'screen',
        })
      }

      layers.push({
        kind: 'circle',
        cx: vanish,
        cy: height * rng.range(0.05, 0.2),
        r: short * rng.range(0.12, 0.22),
        gradient: 'glow',
        opacity: rng.range(0.44, 0.66),
        blend: 'screen',
      })

      layers.push({
        kind: 'path',
        d: waveBand(width, horizon + height * 0.12, short * 0.3, height * 0.09, createNoise1D(rng, 6)),
        fill: inkB,
        opacity: rng.range(0.18, 0.34),
      })
      break
    }
  }

  /* --------------------------------------------------- shared foreground */
  // One or two bright accent strokes tie the families together.
  const accents = rich ? rng.int(2, 4) : rng.int(1, 2)
  for (let index = 0; index < accents; index += 1) {
    const leftToRight = rng.chance(0.5)
    layers.push({
      kind: 'path',
      d: flowLine(
        leftToRight ? -width * 0.05 : width * 1.05,
        leftToRight ? width * 1.05 : -width * 0.05,
        height * rng.range(0.12, 0.92),
        height * rng.range(0.12, 0.3),
        createNoise1D(rng, rng.int(5, 9)),
      ),
      stroke: index === 0 ? inkSet.glow : rng.pick([inkA, inkB, inkC]),
      strokeWidth: Math.max(0.8, short * rng.range(0.0015, 0.0042)),
      opacity: rng.range(0.35, 0.75),
      blend: index === 0 ? 'screen' : 'normal',
    })
  }

  // Motes, denser near the light.
  const motes = rich ? rng.int(20, 34) : rng.int(8, 14)
  for (let index = 0; index < motes; index += 1) {
    layers.push({
      kind: 'circle',
      cx: rng.range(0, width),
      cy: rng.range(0, height),
      r: short * rng.range(0.0018, 0.006),
      fill: rng.chance(0.4) ? inkSet.glow : rng.pick([inkA, inkB, inkC]),
      opacity: rng.range(0.25, 0.8),
    })
  }

  return {
    id,
    seed,
    archetype: family,
    width,
    height,
    palette: inkSet,
    background,
    layers,
    vignette: rng.range(0.3, 0.5),
    grain: rng.range(0.45, 0.8),
  }
}

function hash36(value: string): string {
  let hash = 5381
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(index)) >>> 0
  }
  return hash.toString(36)
}

/* -------------------------------------------------------------------------- */
/* Animated backdrop                                                          */
/* -------------------------------------------------------------------------- */

export interface DriftOptions {
  inkSetId?: string
}

/**
 * A cheaper composition for the animated canvas backdrops: numbers rather than
 * SVG paths, because the canvas renderer evaluates them every frame.
 */
export function createDrift(seed: string, { inkSetId }: DriftOptions = {}) {
  const rng = createRng(`drift:${seed}`)
  const inkSet =
    (inkSetId ? INK_SETS.find((set) => set.id === inkSetId) : undefined) ?? rng.pick(INK_SETS)

  return {
    inkSet,
    background: {
      from: mixHex(inkSet.ground[0], inkSet.ink[1], rng.range(0.02, 0.09)),
      to: mixHex(inkSet.ground[1], inkSet.ink[0], rng.range(0.06, 0.18)),
    },
    orb: {
      x: rng.range(0.22, 0.78),
      y: rng.range(0.16, 0.4),
      r: rng.range(0.09, 0.17),
      color: inkSet.glow,
    },
    ribbons: Array.from({ length: rng.int(4, 7) }, () => ({
      y: rng.range(0.08, 0.92),
      amplitude: rng.range(0.06, 0.2),
      frequency: rng.range(0.7, 1.9),
      speed: rng.range(0.03, 0.1) * (rng.chance(0.5) ? 1 : -1),
      phase: rng.range(0, Math.PI * 2),
      width: rng.range(0.7, 2.6),
      color: rng.pick(inkSet.ink),
      opacity: rng.range(0.2, 0.55),
    })),
    motes: Array.from({ length: rng.int(30, 60) }, () => ({
      x: rng.next(),
      y: rng.next(),
      r: rng.range(0.4, 1.8),
      speed: rng.range(0.004, 0.02),
      drift: rng.range(-0.006, 0.006),
      opacity: rng.range(0.15, 0.6),
      color: rng.chance(0.45) ? inkSet.glow : rng.pick(inkSet.ink),
    })),
  }
}

export type Drift = ReturnType<typeof createDrift>

export { withAlpha }
