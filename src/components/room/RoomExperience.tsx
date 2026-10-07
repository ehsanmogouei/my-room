'use client'

import { Keyboard, Loader2, MousePointer2, Move, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import { useTheme } from '@/components/ThemeProvider'
import { ROOM_MODE_STORAGE_KEY } from '@/lib/constants'
import type { Dictionary } from '@/lib/dictionaries'
import {
  useLowPowerDevice,
  useMounted,
  usePrefersReducedMotion,
  useWebGLSupport,
} from '@/lib/hooks'
import type { HotspotId, Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

import { StaticRoom } from './StaticRoom'
import { HOTSPOTS, type RoomMode } from './roomConfig'
import type { PlayerState } from './Player'

/**
 * three.js is heavy and touches `window` at import time, so the canvas is
 * loaded only on the client and only once the visitor is actually inside.
 */
const RoomCanvas = dynamic(() => import('./RoomCanvas').then((mod) => mod.RoomCanvas), {
  ssr: false,
  loading: () => <CanvasPlaceholder />,
})

const ENTERED_KEY = 'my-room:entered'
const ENTERED_EVENT = 'my-room:entered-changed'
const ROOM_MODE_EVENT = 'my-room:room-mode-changed'

/*
 * Both preferences live in browser storage, which is exactly what
 * `useSyncExternalStore` is for: read on the client, a stable server snapshot,
 * and no `setState` inside an effect.
 */
function subscribeStorage(event: string) {
  return (onChange: () => void) => {
    window.addEventListener(event, onChange)
    return () => window.removeEventListener(event, onChange)
  }
}

const subscribeEntered = subscribeStorage(ENTERED_EVENT)
const subscribeRoomMode = subscribeStorage(ROOM_MODE_EVENT)

function getEntered(): boolean {
  try {
    return sessionStorage.getItem(ENTERED_KEY) === '1'
  } catch {
    return false
  }
}

function getRoomMode(): '3d' | '2d' {
  try {
    return localStorage.getItem(ROOM_MODE_STORAGE_KEY) === '2d' ? '2d' : '3d'
  } catch {
    return '3d'
  }
}

export function RoomExperience({
  locale,
  dict,
  siteName,
  tagline,
}: {
  locale: Locale
  dict: Dictionary
  siteName: string
  tagline: string
}) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const reducedMotion = usePrefersReducedMotion()
  const { supported: webglSupported, checked: webglChecked } = useWebGLSupport()

  const [player, setPlayer] = useState<PlayerState>({ locked: false, nearest: null })
  const [legendOpen, setLegendOpen] = useState(true)

  const mounted = useMounted()
  const entered = useSyncExternalStore(subscribeEntered, getEntered, () => false)
  const prefer2D = useSyncExternalStore(subscribeRoomMode, getRoomMode, () => '3d') === '2d'
  const lowPower = useLowPowerDevice()

  const enterRoom = useCallback(() => {
    try {
      sessionStorage.setItem(ENTERED_KEY, '1')
    } catch {
      // Not fatal — the visitor simply sees the door again next time.
    }
    window.dispatchEvent(new Event(ENTERED_EVENT))
  }, [])

  const chooseMode = useCallback((mode: '3d' | '2d') => {
    try {
      localStorage.setItem(ROOM_MODE_STORAGE_KEY, mode)
    } catch {
      // Preference will not persist.
    }
    window.dispatchEvent(new Event(ROOM_MODE_EVENT))
  }, [])

  /* ------------------------------------------------------------ selection */

  const select = useCallback(
    (id: HotspotId) => {
      const hotspot = HOTSPOTS.find((entry) => entry.id === id)
      if (!hotspot) return

      if (hotspot.action === 'theme') {
        toggleTheme()
        return
      }

      if (hotspot.href) router.push(`/${locale}${hotspot.href}`)
    },
    [locale, router, toggleTheme],
  )

  /* -------------------------------------------------- which mode to render */

  // `webglSupported` is only trustworthy after the probe has run, so nothing
  // is shown until then. Otherwise the 2D fallback would flash for a frame.
  const wants3D = !prefer2D && !reducedMotion && webglSupported
  const ready = mounted && entered && webglChecked
  const show3D = ready && wants3D
  const showFallback = ready && !wants3D
  const showLoading = mounted && entered && !webglChecked

  const roomMode: RoomMode = theme === 'night' ? 'night' : 'day'

  const legendItems = useMemo(
    () => [
      { icon: Move, keys: 'W A S D', label: dict.room.move },
      { icon: MousePointer2, keys: '—', label: dict.room.look },
      { icon: Keyboard, keys: 'E', label: dict.room.interact },
    ],
    [dict],
  )

  return (
    <div className="relative">
      {/* ------------------------------------------------------- the room */}
      <div
        className={cn(
          'relative isolate overflow-hidden rounded-3xl border border-subtle bg-surface-sunken',
          'h-[clamp(26rem,72vh,44rem)]',
        )}
      >
        {show3D && entered && (
          <RoomCanvas
            mode={roomMode}
            labels={dict.room.hotspots}
            onPlayerState={setPlayer}
            onSelect={select}
            reducedMotion={reducedMotion}
            shadows={!lowPower}
            rtl={locale === 'fa'}
          />
        )}

        {showFallback && (
          <StaticRoom
            locale={locale}
            dict={dict}
            mode={roomMode}
            onToggleTheme={toggleTheme}
            onUse3D={() => chooseMode('3d')}
            canUse3D={webglSupported && !reducedMotion}
            className="h-full overflow-y-auto p-4 sm:p-6"
          />
        )}

        {!entered && <DoorOverlay siteName={siteName} tagline={tagline} dict={dict} onEnter={enterRoom} />}

        {/* --------------------------------------------------------- HUD */}
        {show3D && (
          <>
            {player.locked && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 z-20 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 ring-2 ring-black/25"
              />
            )}

            {player.nearest && (
              <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-4">
                <p className="flex items-center gap-2 rounded-full border border-subtle bg-surface-raised/95 px-3.5 py-2 text-xs font-semibold text-ink shadow-lift backdrop-blur">
                  <kbd className="kbd">E</kbd>
                  {dict.room.hotspots[player.nearest.id].label}
                  <span className="font-normal text-ink-muted">
                    — {dict.room.hotspots[player.nearest.id].description}
                  </span>
                </p>
              </div>
            )}

            {legendOpen && (
              <div className="absolute bottom-4 z-20 hidden max-w-[15rem] rounded-2xl border border-subtle bg-surface-raised/92 p-3 shadow-soft backdrop-blur md:block ltr:left-4 rtl:right-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-[0.7rem] font-semibold tracking-wide text-ink-faint uppercase">
                    {dict.room.controls}
                  </p>
                  <button
                    type="button"
                    onClick={() => setLegendOpen(false)}
                    aria-label={dict.common.close}
                    className="text-ink-faint transition-colors hover:text-ink"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
                <ul className="grid gap-1.5 text-xs text-ink-muted">
                  {legendItems.map((item) => (
                    <li key={item.label} className="flex items-center gap-2">
                      <item.icon className="size-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                      <span>{item.label}</span>
                      <span className="ms-auto font-mono text-[0.66rem] text-ink-faint">
                        {item.keys}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!player.locked && (
              <p className="pointer-events-none absolute inset-x-0 top-4 z-20 text-center text-xs text-ink-muted">
                <span className="rounded-full border border-subtle bg-surface-raised/90 px-3 py-1.5 backdrop-blur">
                  {dict.room.clickToStart}
                </span>
              </p>
            )}
          </>
        )}

        {/* Mode + lamp controls, available in both modes once inside. */}
        {entered && (
          <div className="absolute top-3 z-30 flex items-center gap-1.5 ltr:right-3 rtl:left-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-subtle bg-surface-raised/90 px-3 py-1.5 text-[0.7rem] font-semibold text-ink-muted backdrop-blur transition-colors hover:text-ink"
            >
              {roomMode === 'night' ? dict.common.themeNight : dict.common.themeDay}
            </button>

            {webglSupported && !reducedMotion && (
              <button
                type="button"
                onClick={() => chooseMode(prefer2D ? '3d' : '2d')}
                className="rounded-full border border-subtle bg-surface-raised/90 px-3 py-1.5 text-[0.7rem] font-semibold text-ink-muted backdrop-blur transition-colors hover:text-ink"
              >
                {prefer2D ? dict.room.mode3d : dict.room.mode2d}
              </button>
            )}
          </div>
        )}

        {showLoading && <CanvasPlaceholder label={dict.room.loading} />}
      </div>

      <p className="mt-3 text-center text-xs text-ink-faint">{dict.home.enterHint}</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Door overlay                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The one moment of theatre in the whole site: two door leaves that swing open
 * on the first visit of a session. Returning visitors skip straight inside.
 */
function DoorOverlay({
  siteName,
  tagline,
  dict,
  onEnter,
}: {
  siteName: string
  tagline: string
  dict: Dictionary
  onEnter: () => void
}) {
  const [opening, setOpening] = useState(false)

  const open = useCallback(() => {
    if (opening) return
    setOpening(true)
    window.setTimeout(onEnter, 780)
  }, [onEnter, opening])

  useEffect(() => {
    // Any key opens the door, except keys that belong to keyboard navigation
    // (Tab, and the modifier keys a screen-reader user holds down).
    const IGNORED = new Set(['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape'])

    const onKey = (event: KeyboardEvent) => {
      if (IGNORED.has(event.key)) return
      open()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div
      className={cn(
        'absolute inset-0 z-40 overflow-hidden rounded-3xl',
        opening && 'pointer-events-none',
      )}
      role="region"
      aria-label={dict.room.title}
    >
      {/* Left leaf */}
      <div
        className={cn(
          'absolute inset-y-0 left-0 w-1/2 border-e border-black/30 bg-[linear-gradient(180deg,#241a13_0%,#3a2a1c_100%)] transition-transform duration-[760ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          opening && '-translate-x-full',
        )}
      >
        <div className="absolute inset-y-8 end-4 w-16 rounded-sm border border-white/5 bg-black/15" />
      </div>

      {/* Right leaf */}
      <div
        className={cn(
          'absolute inset-y-0 right-0 w-1/2 border-s border-black/30 bg-[linear-gradient(180deg,#241a13_0%,#3a2a1c_100%)] transition-transform duration-[760ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          opening && 'translate-x-full',
        )}
      >
        <div className="absolute inset-y-8 start-4 w-16 rounded-sm border border-white/5 bg-black/15" />
      </div>

      {/* Light behind the opening doors */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,214,150,0.5),transparent_60%)] transition-opacity duration-700',
          opening ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Invitation */}
      <div
        className={cn(
          'absolute inset-0 grid place-items-center px-6 transition-opacity duration-300',
          opening && 'opacity-0',
        )}
      >
        <div className="max-w-md text-center">
          <p className="text-xs tracking-[0.3em] text-amber-200/60 uppercase">{siteName}</p>
          <h1 className="mt-4 text-2xl font-bold text-amber-50 sm:text-3xl">{tagline}</h1>

          <button
            type="button"
            onClick={open}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-200 px-6 py-3 text-sm font-bold text-amber-950 transition-transform hover:scale-[1.03] active:scale-100"
          >
            {dict.room.doorLabel}
          </button>

          <p className="mt-4 text-xs text-amber-100/45">{dict.room.doorHint}</p>
        </div>
      </div>
    </div>
  )
}

function CanvasPlaceholder({ label = '' }: { label?: string }) {
  return (
    <div className="grid h-full w-full place-items-center">
      <p className="flex items-center gap-2 text-sm text-ink-muted">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        {label}
      </p>
    </div>
  )
}
