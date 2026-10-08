'use client'

import { useEffect, useRef } from 'react'

/**
 * A warm light that follows the pointer across the whole site.
 *
 * One DOM element moved with `translate3d` from inside a rAF loop — no React
 * state, no re-render, and it interpolates toward the cursor instead of
 * snapping, so it reads as light rather than as a cursor replacement.
 *
 * Disabled for touch pointers and for `prefers-reduced-motion`.
 */
export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches
    if (reduceMotion || coarse) return

    let targetX = window.innerWidth * 0.5
    let targetY = window.innerHeight * 0.35
    let currentX = targetX
    let currentY = targetY
    let frame = 0
    let settled = false

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      settled = false
      element.style.opacity = '1'
    }

    const onLeave = () => {
      element.style.opacity = '0'
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.075
      currentY += (targetY - currentY) * 0.075

      element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`

      // Idle out once the light has essentially caught up, so a still page
      // costs nothing.
      if (Math.abs(targetX - currentX) < 0.4 && Math.abs(targetY - currentY) < 0.4) {
        if (settled) return
        settled = true
      }

      frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div ref={ref} className="cursor-light" aria-hidden="true" />
}
