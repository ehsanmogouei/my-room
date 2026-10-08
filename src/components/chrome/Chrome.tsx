'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { useTheme } from '@/components/ThemeProvider'
import { localeMeta, locales, type Locale } from '@/lib/types'

/**
 * The chrome layer: everything that surrounds the content rather than being it.
 *
 * Cursor, grain, scanlines, the designer frame, the scroll bar, the readout and
 * the dock all live here, mounted once in the layout. They are all fixed and
 * all pointer-transparent except the dock, so no page has to know about them.
 */
export function Chrome({ locale, section }: { locale: Locale; section: string }) {
  return (
    <>
      <div className="bgfallback" aria-hidden="true" />
      <Grain />
      <Scan />
      <Frame />
      <Cursor />
      <Progress />
      <Readout locale={locale} section={section} />
      <Dock locale={locale} />
      {/* Toast host: effects write into it through a window event. */}
      <div className="toast" id="chrome-toast" role="status" aria-live="polite" />
    </>
  )
}

function Grain() {
  return <div className="grain" aria-hidden="true" />
}

function Scan() {
  return <div className="scan" aria-hidden="true" />
}

function Frame() {
  return (
    <div className="frame-chrome" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Cursor                                                                     */
/* -------------------------------------------------------------------------- */

/** A ring that lags behind a precise dot, and swells over anything clickable. */
function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const ringEl = ring.current
    const dotEl = dot.current
    if (!ringEl || !dotEl) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY
    let frame = 0

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      dotEl.style.transform = `translate(${targetX}px, ${targetY}px)`

      const hit = (event.target as Element | null)?.closest?.(
        'a, button, input, label, [data-cursor]',
      )
      ringEl.classList.toggle('hot', Boolean(hit))
    }

    const onDown = () => ringEl.classList.add('hot')
    const onUp = () => ringEl.classList.remove('hot')
    const onLeave = () => ringEl.classList.add('hide')
    const onEnter = () => ringEl.classList.remove('hide')

    const follow = () => {
      currentX += (targetX - currentX) * 0.19
      currentY += (targetY - currentY) * 0.19
      ringEl.style.transform = `translate(${currentX}px, ${currentY}px)`
      frame = window.requestAnimationFrame(follow)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    frame = window.requestAnimationFrame(follow)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
    }
  }, [])

  return (
    <>
      <div className="cursor" ref={ring} aria-hidden="true" />
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Progress                                                                   */
/* -------------------------------------------------------------------------- */

function Progress() {
  const bar = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = bar.current
    if (!element) return

    let ticking = false

    const update = () => {
      ticking = false
      const total = document.documentElement.scrollHeight - window.innerHeight
      const ratio = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0
      element.style.width = `${(ratio * 100).toFixed(2)}%`
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="progress" aria-hidden="true">
      <i ref={bar} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Readout                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A small system readout. It reports the three things that actually change as
 * you move around: the language, the theme and the section you are in.
 */
function Readout({ locale, section }: { locale: Locale; section: string }) {
  const { theme, ready } = useTheme()

  return (
    <aside className="hud" aria-hidden="true">
      <span className="hud-k">lang</span>
      <span className="hud-v">{localeMeta[locale].short}</span>

      <span className="hud-k">theme</span>
      <span className="hud-v">{!ready ? '—' : theme === 'night' ? 'dark' : 'light'}</span>

      <span className="hud-k">view</span>
      <span className="hud-v">{section}</span>
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/* Dock                                                                       */
/* -------------------------------------------------------------------------- */

/** Theme and language, always within reach, in a floating glass pill. */
function Dock({ locale }: { locale: Locale }) {
  const { theme, ready, setTheme } = useTheme()
  const pathname = usePathname() || `/${locale}`
  const isNight = theme === 'night'

  // Swap only the locale segment, so the dock never throws you back home.
  const swapTo = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '')

  return (
    <div className="dock">
      <div className="seg" role="group" aria-label="Theme">
        <button
          type="button"
          className={ready && !isNight ? 'on' : undefined}
          onClick={() => setTheme('day')}
          aria-pressed={ready && !isNight}
        >
          Light
        </button>
        <button
          type="button"
          className={ready && isNight ? 'on' : undefined}
          onClick={() => setTheme('night')}
          aria-pressed={ready && isNight}
        >
          Dark
        </button>
      </div>

      <span className="dock-sep" />

      <span className="dock-label">lang</span>

      <div className="seg" role="group" aria-label="Language">
        {locales.map((code) => (
          <Link
            key={code}
            href={`/${code}${swapTo}`}
            hrefLang={localeMeta[code].htmlLang}
            className={code === locale ? 'on' : undefined}
            aria-current={code === locale ? 'true' : undefined}
          >
            {localeMeta[code].short}
          </Link>
        ))}
      </div>

      <span className="dock-sep" />

      <a href={`/${locale}/rss.xml`} className="dock-label" aria-label="RSS" data-cursor="link">
        <RssMark />
      </a>
    </div>
  )
}

function RssMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-1-5.2A6.2 6.2 0 0 1 8.2 14M2 3.2A10.8 10.8 0 0 1 12.8 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
