'use client'

import { useFrame } from '@react-three/fiber'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Points } from 'three'

import type { Dictionary } from '@/lib/dictionaries'
import type { HotspotId } from '@/lib/types'

import { HotspotMarker } from './HotspotMarker'
import { Player, type PlayerState } from './Player'
import { RoomShell } from './RoomShell'
import { Bookshelf } from './objects/Bookshelf'
import { Chair, Desk, Lamp } from './objects/Desk'
import { Door } from './objects/Door'
import { Corkboard, GalleryWall, Window } from './objects/WallDecor'
import { HOTSPOTS, ROOM_THEMES, type RoomMode } from './roomConfig'

type HotspotLabels = Dictionary['room']['hotspots']

/** Slow-drifting motes, visible only where the lamp and window light fall. */
function Dust({ count, opacity, color }: { count: number; opacity: number; color: string }) {
  const ref = useRef<Points>(null)

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    let seed = 90210
    const random = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return seed / 0x7fffffff
    }

    for (let index = 0; index < count; index += 1) {
      array[index * 3] = (random() - 0.5) * 9
      array[index * 3 + 1] = random() * 3.2 + 0.05
      array[index * 3 + 2] = (random() - 0.5) * 9
    }

    return array
  }, [count])

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.013
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export interface RoomSceneProps {
  mode: RoomMode
  labels: HotspotLabels
  onPlayerState: (state: PlayerState) => void
  onSelect: (id: HotspotId) => void
  reducedMotion: boolean
  shadows: boolean
  /** Right-to-left locales get their labels drawn in reading order. */
  rtl: boolean
}

/**
 * The room itself: geometry, light and markers.
 * Kept inside the `<Canvas>` boundary, so nothing here may touch the DOM
 * except through drei's `<Html>`.
 */
export function RoomScene({
  mode,
  labels,
  onPlayerState,
  onSelect,
  reducedMotion,
  shadows,
  rtl,
}: RoomSceneProps) {
  const theme = ROOM_THEMES[mode]

  const [nearestId, setNearestId] = useState<HotspotId | null>(null)
  const [locked, setLocked] = useState(false)

  const handlePlayerState = useCallback(
    (state: PlayerState) => {
      setNearestId(state.nearest?.id ?? null)
      setLocked(state.locked)
      onPlayerState(state)
    },
    [onPlayerState],
  )

  const lampOn = mode === 'night'

  return (
    <>
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.fog, theme.fogNear, theme.fogFar]} />

      {/* ---------------------------------------------------------- light */}
      <hemisphereLight
        args={[theme.hemi.sky, theme.hemi.ground, theme.hemi.intensity]}
      />
      <ambientLight color={theme.ambient.color} intensity={theme.ambient.intensity} />
      <directionalLight
        position={theme.key.position}
        color={theme.key.color}
        intensity={theme.key.intensity}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
        shadow-bias={-0.0009}
      />

      {/* -------------------------------------------------------- geometry */}
      <RoomShell theme={theme} />
      <Desk theme={theme} />
      <Chair />
      <Lamp theme={theme} on={lampOn} />
      <Bookshelf />
      <Window theme={theme} />
      <GalleryWall theme={theme} />
      <Corkboard />
      <Door theme={theme} />

      <Dust count={reducedMotion ? 90 : 240} opacity={theme.dust} color="#ffe9c4" />

      {/* --------------------------------------------------------- markers */}
      {HOTSPOTS.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          label={labels[hotspot.id].label}
          description={labels[hotspot.id].description}
          active={nearestId === hotspot.id}
          interactive={!locked}
          rtl={rtl}
          onSelect={() => onSelect(hotspot.id)}
        />
      ))}

      {/* ---------------------------------------------------------- player */}
      <Player onState={handlePlayerState} reducedMotion={reducedMotion} enabled />
    </>
  )
}
