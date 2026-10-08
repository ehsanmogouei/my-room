/**
 * Ink sets for the generative artwork engine.
 *
 * Each set is a pair of ground colours (the "paper") plus three inks that were
 * chosen to sit together. Picking from a curated list rather than computing
 * hues from scratch is deliberate: arbitrary hues produce mud, curated ones
 * produce risograph prints. Variety comes from the seed choosing the set and
 * then jittering it, not from inventing colour.
 */

export interface InkSet {
  id: string
  /** Two-stop background gradient, dark to slightly lighter. */
  ground: [string, string]
  /** Primary, secondary and accent ink. */
  ink: [string, string, string]
  /** Colour of the light source (orb + halos). */
  glow: string
}

export const INK_SETS: InkSet[] = [
  {
    id: 'ember',
    ground: ['#0b0f1a', '#1d2130'],
    ink: ['#e0a35c', '#4a5a8a', '#c2703f'],
    glow: '#ffd9a0',
  },
  {
    id: 'tide',
    ground: ['#0a1218', '#17262e'],
    ink: ['#7fa8d0', '#e8b06a', '#3f6b6b'],
    glow: '#9ed2ea',
  },
  {
    id: 'clay',
    ground: ['#120e14', '#2a1f2e'],
    ink: ['#c98a6b', '#8a6fb0', '#f0c07a'],
    glow: '#ffcfa0',
  },
  {
    id: 'moss',
    ground: ['#0d1210', '#1e2a22'],
    ink: ['#8fb0a0', '#d98b5f', '#5a6a8a'],
    glow: '#a6dcb6',
  },
  {
    id: 'ochre',
    ground: ['#131009', '#2c2416'],
    ink: ['#d0b070', '#4a7a6a', '#b05a5a'],
    glow: '#ffd685',
  },
  {
    id: 'rosewater',
    ground: ['#130f12', '#2e1e26'],
    ink: ['#e08a7a', '#6f8fae', '#e8c86a'],
    glow: '#ffb894',
  },
  {
    id: 'mist',
    ground: ['#0c0f16', '#1f2533'],
    ink: ['#a0b0d0', '#c2703f', '#7a6a9a'],
    glow: '#b6c8f2',
  },
  {
    id: 'pine',
    ground: ['#080f10', '#152523'],
    ink: ['#9fc2a8', '#f0b973', '#3f5c7a'],
    glow: '#b0e2c0',
  },
  {
    id: 'plum',
    ground: ['#100b18', '#241a33'],
    ink: ['#b08fd0', '#e0a35c', '#5f7fa8'],
    glow: '#ceb0f4',
  },
  {
    id: 'rust',
    ground: ['#140d0a', '#2e1a12'],
    ink: ['#d98b5f', '#5a7a8a', '#e8c86a'],
    glow: '#ffc090',
  },
]

/**
 * Small deterministic PRNG (mulberry32) seeded from a string.
 * `Math.random` is intentionally avoided: the same slug must always produce
 * the same artwork, on the server, on the client, and in an OG image.
 */
export function createRng(seed: string) {
  let state = hashString(seed)

  const next = () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  return {
    /** Float in [0, 1). */
    next,
    /** Float in [min, max). */
    range: (min: number, max: number) => min + next() * (max - min),
    /** Integer in [min, max]. */
    int: (min: number, max: number) => Math.floor(min + next() * (max - min + 1)),
    /** Random element. */
    pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)],
    /** True with the given probability. */
    chance: (probability: number) => next() < probability,
  }
}

export type Rng = ReturnType<typeof createRng>

/** FNV-1a: stable across platforms, unlike a naive char-code sum. */
function hashString(value: string): number {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/**
 * Smooth one-dimensional value noise.
 * Used for every flowing line in the artwork, which is what stops the output
 * from looking like straight random noise.
 */
export function createNoise1D(rng: Rng, points = 7) {
  const values = Array.from({ length: points }, () => rng.next())

  return (t: number): number => {
    const scaled = Math.max(0, Math.min(1, t)) * (points - 1)
    const index = Math.floor(scaled)
    const fraction = scaled - index
    const a = values[index] ?? values[points - 1]
    const b = values[Math.min(index + 1, points - 1)]
    // Smoothstep, so the curve has no visible corners at the sample points.
    const eased = fraction * fraction * (3 - 2 * fraction)
    return a + (b - a) * eased
  }
}

/** Two-dimensional value noise, built from the 1D version. */
export function createNoise2D(rng: Rng, size = 6) {
  const grid = Array.from({ length: size * size }, () => rng.next())

  const at = (x: number, y: number) =>
    grid[Math.min(size - 1, Math.max(0, y)) * size + Math.min(size - 1, Math.max(0, x))]

  return (u: number, v: number): number => {
    const x = Math.max(0, Math.min(0.999, u)) * (size - 1)
    const y = Math.max(0, Math.min(0.999, v)) * (size - 1)
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const fx = x - x0
    const fy = y - y0
    const sx = fx * fx * (3 - 2 * fx)
    const sy = fy * fy * (3 - 2 * fy)

    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx
    const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx
    return top + (bottom - top) * sy
  }
}

/* -------------------------------------------------------------------------- */
/* Colour helpers                                                             */
/* -------------------------------------------------------------------------- */

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value

  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

export function rgbToHex(rgb: [number, number, number]): string {
  return `#${rgb.map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, '0')).join('')}`
}

/**
 * Blend two hex colours in linear-ish space and return a hex string.
 * Mixing in sRGB directly produces grey mud in the midtones; a gamma-aware
 * blend keeps the hue alive.
 */
export function mixHex(a: string, b: string, amount: number): string {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  const t = clamp(amount)

  const blend = (x: number, y: number) => {
    const linear = (channel: number) => (channel / 255) ** 2.2
    const back = (channel: number) => channel ** (1 / 2.2) * 255
    return back(linear(x) * (1 - t) + linear(y) * t)
  }

  return rgbToHex([blend(r1, r2), blend(g1, g2), blend(b1, b2)])
}

/** Nudge a colour's brightness without washing out its saturation. */
export function shiftLightness(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  const target = amount > 0 ? 255 : 0
  const strength = Math.abs(amount)
  return rgbToHex([
    r + (target - r) * strength,
    g + (target - g) * strength,
    b + (target - b) * strength,
  ])
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${Number(clamp(alpha).toFixed(3))})`
}
