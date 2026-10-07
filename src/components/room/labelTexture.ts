import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three'

/**
 * Hotspot labels are drawn into a canvas texture rather than rendered as HTML
 * inside the WebGL tree.
 *
 * drei's `<Html>` creates a separate React root per label. With seven markers
 * that meant seven roots being torn down during navigation, which produced
 * "attempted to synchronously unmount a root while React was already
 * rendering" and `removeChild` errors in the console. Drawing text into a
 * texture removes those roots entirely — and the browser's own canvas text
 * engine still shapes Persian correctly, which a WebGL text renderer would
 * have struggled with.
 */

const FONT_STACK = "'Vazirmatn', system-ui, 'Segoe UI', Tahoma, sans-serif"

/** Supersampling factor, so the text stays crisp when standing close. */
const SCALE = 3

const TITLE_SIZE = 30
const SUBTITLE_SIZE = 21
const LINE_GAP = 5
const PAD_X = 24
const PAD_Y = 15
const RADIUS = 14

/** World units per canvas pixel. Tuned so a label reads at ~3 metres. */
const WORLD_PER_PIXEL = 1 / 220

export interface LabelTexture {
  texture: CanvasTexture
  width: number
  height: number
}

export interface LabelOptions {
  title: string
  subtitle: string
  accent: string
  active: boolean
  rtl: boolean
}

export function createLabelTexture({
  title,
  subtitle,
  accent,
  active,
  rtl,
}: LabelOptions): LabelTexture | null {
  const measureCanvas = document.createElement('canvas')
  const measure = measureCanvas.getContext('2d')
  if (!measure) return null

  measure.font = `600 ${TITLE_SIZE}px ${FONT_STACK}`
  const titleWidth = measure.measureText(title).width

  measure.font = `400 ${SUBTITLE_SIZE}px ${FONT_STACK}`
  const subtitleWidth = measure.measureText(subtitle).width

  const contentWidth = Math.max(titleWidth, subtitleWidth)
  const width = Math.ceil(contentWidth + PAD_X * 2)
  const height = Math.ceil(TITLE_SIZE + LINE_GAP + SUBTITLE_SIZE + PAD_Y * 2)

  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width * SCALE)
  canvas.height = Math.ceil(height * SCALE)

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.scale(SCALE, SCALE)
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.direction = rtl ? 'rtl' : 'ltr'

  // Panel
  ctx.beginPath()
  ctx.roundRect(0.5, 0.5, width - 1, height - 1, RADIUS)
  ctx.fillStyle = active ? 'rgba(9, 12, 18, 0.94)' : 'rgba(9, 12, 18, 0.8)'
  ctx.fill()
  ctx.lineWidth = active ? 2.5 : 1.5
  ctx.strokeStyle = active ? accent : 'rgba(255, 255, 255, 0.22)'
  ctx.stroke()

  // Accent bar on the leading edge, so each marker keeps its own colour.
  const barWidth = active ? 6 : 4
  const barX = rtl ? width - PAD_X / 2 - barWidth : PAD_X / 2
  ctx.beginPath()
  ctx.roundRect(barX, PAD_Y + 2, barWidth, height - PAD_Y * 2 - 4, barWidth / 2)
  ctx.fillStyle = accent
  ctx.globalAlpha = active ? 1 : 0.75
  ctx.fill()
  ctx.globalAlpha = 1

  const centerX = width / 2

  ctx.font = `600 ${TITLE_SIZE}px ${FONT_STACK}`
  ctx.fillStyle = active ? '#fdfaf5' : '#e6e1d8'
  ctx.fillText(title, centerX, PAD_Y)

  ctx.font = `400 ${SUBTITLE_SIZE}px ${FONT_STACK}`
  ctx.fillStyle = active ? 'rgba(226, 220, 210, 0.78)' : 'rgba(200, 195, 186, 0.62)'
  ctx.fillText(subtitle, centerX, PAD_Y + TITLE_SIZE + LINE_GAP)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.generateMipmaps = false
  texture.needsUpdate = true

  return {
    texture,
    width: width * WORLD_PER_PIXEL,
    height: height * WORLD_PER_PIXEL,
  }
}
