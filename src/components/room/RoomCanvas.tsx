'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { ACESFilmicToneMapping } from 'three'

import type { Dictionary } from '@/lib/dictionaries'
import type { HotspotId } from '@/lib/types'

import { ENTER_HOTSPOT_EVENT, REQUEST_LOCK_EVENT, type PlayerState } from './Player'
import { RoomScene } from './RoomScene'
import { SPAWN, type RoomMode } from './roomConfig'

/**
 * The WebGL boundary. Everything above this file is DOM; everything below it
 * is three.js. Loaded with `ssr: false` so three.js never runs on the server.
 */
export function RoomCanvas({
  mode,
  labels,
  onPlayerState,
  onSelect,
  reducedMotion,
  shadows,
  rtl,
}: {
  mode: RoomMode
  labels: Dictionary['room']['hotspots']
  onPlayerState: (state: PlayerState) => void
  onSelect: (id: HotspotId) => void
  reducedMotion: boolean
  shadows: boolean
  rtl: boolean
}) {
  // The player dispatches this from inside the canvas when E is pressed;
  // the handler lives out here where the router is reachable.
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: HotspotId }>).detail
      if (detail?.id) onSelect(detail.id)
    }

    window.addEventListener(ENTER_HOTSPOT_EVENT, handler)
    return () => window.removeEventListener(ENTER_HOTSPOT_EVENT, handler)
  }, [onSelect])

  return (
    <Canvas
      // three.js removed PCFSoftShadowMap in r186; "percentage" is the closest
      // surviving equivalent, and R3F's default would warn on every mount.
      shadows={shadows ? 'percentage' : false}
      dpr={[1, 1.75]}
      camera={{ fov: 72, near: 0.05, far: 60, position: SPAWN.position }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      // A click that hits no object is a request to look around, not to select.
      onPointerMissed={() => window.dispatchEvent(new CustomEvent(REQUEST_LOCK_EVENT))}
    >
      <Suspense fallback={null}>
        <RoomScene
          mode={mode}
          labels={labels}
          onPlayerState={onPlayerState}
          onSelect={onSelect}
          reducedMotion={reducedMotion}
          shadows={shadows}
          rtl={rtl}
        />
      </Suspense>
    </Canvas>
  )
}
