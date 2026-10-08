'use client'

import { useEffect, useMemo, useRef } from 'react'

import { createDrift } from '@/lib/generative/artwork'
import { withAlpha } from '@/lib/generative/palette'
import { cn } from '@/lib/utils'

/**
 * The living half of the artwork engine.
 *
 * The static `<GenerativeArt>` covers, cards and social images are SVG because
 * they never change. This is the opposite case: one canvas that redraws a
 * flowing ink field every frame, follows the pointer, and sits behind the
 * hero. Same seed, same palette, so the animated version and the still version
 * read as the same piece of work.
 */
export function LivingCanvas({
  seed,
  className,
  /** 0–1. Lower values keep the motion and the light subdued. */
  intensity = 1,
  /** Extra light that tracks the pointer, in pixels. */
  pointerLight = true,
  /** Pin the ink set, e.g. the site's signature palette for the hero. */
  inkSetId,
}: {
  seed: string
  className?: string
  intensity?: number
  pointerLight?: boolean
  inkSetId?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: 0.5, y: 0.42, active: 0 })

  const drift = useMemo(() => createDrift(seed, { inkSetId }), [seed, inkSetId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let frame = 0
    let width = 0
    let height = 0
    let visible = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      // Capped at 2 so a 4K display does not quadruple the fill cost.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (milliseconds: number) => {
      if (!visible || width === 0) return

      const time = reduceMotion ? 0 : milliseconds / 1000
      const short = Math.min(width, height)
      const px = pointer.current.x
      const py = pointer.current.y
      const active = pointer.current.active

      /* ------------------------------------------------------- ground */
      const ground = context.createLinearGradient(0, 0, width * 0.35, height)
      ground.addColorStop(0, drift.background.from)
      ground.addColorStop(1, drift.background.to)
      context.fillStyle = ground
      context.fillRect(0, 0, width, height)

      context.globalCompositeOperation = 'screen'

      /* --------------------------------------------------------- light */
      // Parallax is deliberately small: enough to feel alive, not enough to
      // make the text sitting on top of it feel unstable.
      const orbX = drift.orb.x * width + (px - 0.5) * width * 0.045
      const orbY = drift.orb.y * height + (py - 0.5) * height * 0.045
      const orbRadius = drift.orb.r * short

      const glow = context.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius * 4.4)
      glow.addColorStop(0, withAlpha(drift.orb.color, 0.92 * intensity))
      glow.addColorStop(0.18, withAlpha(drift.orb.color, 0.42 * intensity))
      glow.addColorStop(0.55, withAlpha(drift.orb.color, 0.12 * intensity))
      glow.addColorStop(1, withAlpha(drift.orb.color, 0))
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      /* ------------------------------------------------------ ribbons */
      for (const ribbon of drift.ribbons) {
        const baseY = ribbon.y * height
        const amplitude = ribbon.amplitude * height
        const phase = ribbon.phase + time * ribbon.speed

        context.beginPath()

        for (let x = -24; x <= width + 24; x += 12) {
          const u = x / width
          const y =
            baseY +
            Math.sin(u * Math.PI * 2 * ribbon.frequency + phase) * amplitude +
            Math.sin(u * Math.PI * 2 * ribbon.frequency * 0.37 + phase * 1.7) * amplitude * 0.42

          if (x <= -24) context.moveTo(x, y)
          else context.lineTo(x, y)
        }

        context.strokeStyle = withAlpha(ribbon.color, ribbon.opacity * intensity)
        context.lineWidth = ribbon.width
        context.lineCap = 'round'
        context.stroke()
      }

      /* -------------------------------------------------------- motes */
      for (const mote of drift.motes) {
        if (time === 0) {
          // Reduced motion: draw the field once, statically.
        }

        const x = (mote.x * width + time * mote.drift * width * 12) % (width + 40) - 0
        const y =
          ((mote.y * height - time * mote.speed * height * 6) % (height + 40) + height + 40) %
            (height + 40) -
          20

        context.beginPath()
        context.arc(x, y, mote.r, 0, Math.PI * 2)
        context.fillStyle = withAlpha(mote.color, mote.opacity * intensity)
        context.fill()
      }

      /* ----------------------------------------------- pointer light */
      if (pointerLight && active > 0.01) {
        const lift = context.createRadialGradient(
          px * width,
          py * height,
          0,
          px * width,
          py * height,
          short * 0.55,
        )
        lift.addColorStop(0, withAlpha(drift.inkSet.glow, 0.14 * active * intensity))
        lift.addColorStop(1, withAlpha(drift.inkSet.glow, 0))
        context.fillStyle = lift
        context.fillRect(0, 0, width, height)
      }

      context.globalCompositeOperation = 'source-over'
    }

    const loop = (milliseconds: number) => {
      draw(milliseconds)
      frame = window.requestAnimationFrame(loop)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.current.x = (event.clientX - rect.left) / rect.width
      pointer.current.y = (event.clientY - rect.top) / rect.height
      pointer.current.active = 1
    }

    const onPointerLeave = () => {
      pointer.current.active = 0
    }

    // Stop drawing when the hero is scrolled past or the tab is hidden.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0 },
    )

    const onVisibility = () => {
      visible = !document.hidden
    }

    resize()
    observer.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    if (reduceMotion) draw(0)
    else frame = window.requestAnimationFrame(loop)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [drift, intensity, pointerLight])

  return <canvas ref={canvasRef} className={cn('block h-full w-full', className)} aria-hidden="true" />
}
