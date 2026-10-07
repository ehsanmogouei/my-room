import type { HotspotId } from '@/lib/types'

export type RoomMode = 'day' | 'night'

/** Interior dimensions in metres. Walls sit at ±half. */
export const ROOM = {
  width: 9.6,
  depth: 9.6,
  height: 3.4,
  wallThickness: 0.12,
} as const

export const SPAWN = {
  position: [0, 1.62, 2.2] as [number, number, number],
  lookAt: [0, 1.5, -4] as [number, number, number],
}

export interface RoomHotspot {
  id: HotspotId
  /** Route inside the locale, or `null` when `action` handles the click. */
  href: string | null
  /** Marker position in world space. */
  position: [number, number, number]
  /** Point the player must reach to interact, [x, z]. */
  focus: [number, number]
  color: string
  /** Non-navigating behaviours. */
  action?: 'theme'
}

/**
 * Markers double as the room's navigation. Positions are hand-placed to sit
 * just in front of the object they belong to, at roughly eye level.
 */
export const HOTSPOTS: RoomHotspot[] = [
  {
    id: 'desk',
    href: '/projects',
    position: [0.35, 2.0, -3.75],
    focus: [0.35, -3.75],
    color: '#e0a35c',
  },
  {
    id: 'lamp',
    href: null,
    action: 'theme',
    position: [-1.45, 1.62, -4.2],
    focus: [-1.45, -4.2],
    color: '#ffd9a0',
  },
  {
    id: 'window',
    href: '/now',
    position: [-3.45, 2.32, -4.5],
    focus: [-3.45, -4.5],
    color: '#7fa8d0',
  },
  {
    id: 'galleryWall',
    href: '/gallery',
    position: [3.15, 2.5, -4.45],
    focus: [3.15, -4.45],
    color: '#c98a6b',
  },
  {
    id: 'bookshelf',
    href: '/blog',
    position: [4.25, 2.42, -0.8],
    focus: [4.25, -0.8],
    color: '#8fb0a0',
  },
  {
    id: 'corkboard',
    href: '/gallery#links',
    position: [-4.25, 2.38, -0.5],
    focus: [-4.25, -0.5],
    color: '#d0b070',
  },
  {
    id: 'door',
    href: '/about',
    position: [0, 2.42, 4.5],
    focus: [0, 4.5],
    color: '#b08fd0',
  },
]

/** How close the player must be, in metres, before a marker lights up. */
export const MARKER_NEAR = 3.6
/** How close before pressing E enters it. */
export const MARKER_ENTER = 2.6

/**
 * Axis-aligned rectangles the player cannot walk into, in world XZ.
 * Blocking is resolved per axis, which gives natural wall-sliding.
 */
export const BLOCKERS: Array<{ x: [number, number]; z: [number, number] }> = [
  { x: [-1.4, 1.4], z: [-4.9, -3.85] }, // desk
  { x: [4.15, 4.9], z: [-2.75, 1.15] }, // bookshelf
  { x: [-4.9, -4.45], z: [-1.95, 0.95] }, // corkboard
  { x: [-1.35, 1.35], z: [-3.65, -2.75] }, // chair
]

/** The walkable area, a little inside the walls. */
export const BOUNDS = { min: -4.25, max: 4.25 } as const

export const WALK_SPEED = 2.5
export const RUN_SPEED = 4.4
export const EYE_HEIGHT = 1.62

export interface RoomTheme {
  background: string
  fog: string
  fogNear: number
  fogFar: number
  wall: string
  floor: string
  ceiling: string
  /** Hemisphere light: sky colour, ground colour, intensity. */
  hemi: { sky: string; ground: string; intensity: number }
  ambient: { color: string; intensity: number }
  /** Main directional light. */
  key: { color: string; intensity: number; position: [number, number, number] }
  /** Fill light from the window side. */
  fill: { color: string; intensity: number }
  /** The desk lamp. Off during the day, warm at night. */
  lamp: { color: string; intensity: number }
  window: { top: string; bottom: string; glow: number }
  dust: number
}

export const ROOM_THEMES: Record<RoomMode, RoomTheme> = {
  day: {
    background: '#e8dcc8',
    fog: '#e8dcc8',
    fogNear: 9,
    fogFar: 24,
    wall: '#dcc9ae',
    floor: '#a37c54',
    ceiling: '#efe6d6',
    hemi: { sky: '#fff3dd', ground: '#a37c54', intensity: 1.05 },
    ambient: { color: '#ffffff', intensity: 0.55 },
    key: { color: '#fff2d8', intensity: 1.15, position: [-3.2, 3.6, -3.4] },
    fill: { color: '#cfe0ef', intensity: 0.5 },
    lamp: { color: '#ffd9a0', intensity: 0 },
    window: { top: '#bcd8ef', bottom: '#e9dcc4', glow: 0.55 },
    dust: 0.32,
  },
  night: {
    background: '#0b0f1a',
    fog: '#0b0f1a',
    fogNear: 6,
    fogFar: 18,
    wall: '#2b2a33',
    floor: '#38291c',
    ceiling: '#1a1c24',
    hemi: { sky: '#41527f', ground: '#1a1410', intensity: 0.32 },
    ambient: { color: '#6f7fb8', intensity: 0.22 },
    key: { color: '#8fa6d8', intensity: 0.3, position: [-3.2, 3.4, -3.4] },
    fill: { color: '#4a6ea8', intensity: 0.34 },
    lamp: { color: '#ffc98a', intensity: 9 },
    window: { top: '#101a33', bottom: '#2a2340', glow: 0.4 },
    dust: 0.55,
  },
}

/** Furniture colours are shared between modes; only the light changes. */
export const MATERIALS = {
  deskTop: '#6b4a2f',
  deskLeg: '#3a2a1c',
  metal: '#2f333b',
  screenFrame: '#1b1d22',
  screen: '#0e1420',
  mug: '#c2703f',
  paper: '#efe7d8',
  shelfWood: '#5a4030',
  cork: '#b88a52',
  frame: '#2a2f3a',
  frameGold: '#b08a4a',
  door: '#4e3623',
  doorFrame: '#34241a',
  chair: '#3b3f47',
  rug: '#7a3f3a',
} as const

/** Deterministic book spine colours, so the shelf looks the same every render. */
export const BOOK_COLORS = [
  '#b4632a',
  '#3f6b6b',
  '#8a4a5a',
  '#4a5a8a',
  '#7a6a3a',
  '#5a7a4a',
  '#8a5a3a',
  '#41607a',
] as const
