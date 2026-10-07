'use client'

import { Billboard } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Group, Mesh } from 'three'

import { createLabelTexture, type LabelTexture } from './labelTexture'
import type { RoomHotspot } from './roomConfig'

/**
 * A single interactive marker: a billboarded ring plus a canvas-texture label.
 *
 * The label is a texture rather than DOM (see `labelTexture.ts` for why), so
 * the whole marker lives inside the WebGL tree and unmounts cleanly.
 * It is clickable through React Three Fiber's raycasting whenever the pointer
 * is not locked; when locked, the player interacts with `E` instead.
 */
export function HotspotMarker({
  hotspot,
  label,
  description,
  active,
  interactive,
  rtl,
  onSelect,
}: {
  hotspot: RoomHotspot
  label: string
  description: string
  active: boolean
  interactive: boolean
  rtl: boolean
  onSelect: () => void
}) {
  const group = useRef<Group>(null)
  const ring = useRef<Mesh>(null)

  const [hovered, setHovered] = useState(false)
  const [current, setCurrent] = useState<LabelTexture | null>(null)

  const emphasis = active || hovered

  /* ------------------------------------------------------- label texture */
  useEffect(() => {
    let alive = true

    const build = () => {
      if (!alive) return

      setCurrent(
        createLabelTexture({
          title: label,
          subtitle: description,
          accent: hotspot.color,
          active: emphasis,
          rtl,
        }),
      )
    }

    // Wait for Vazirmatn, otherwise the first frame renders in a fallback face.
    document.fonts.ready.then(build, build)

    return () => {
      alive = false
    }
  }, [label, description, hotspot.color, emphasis, rtl])

  // The cleanup captures the *previous* texture, so it is released exactly when
  // it is replaced — and once more when the marker unmounts.
  useEffect(() => () => current?.texture.dispose(), [current])

  /* --------------------------------------------------------------- motion */
  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (ring.current) {
      const pulse = 1 + Math.sin(time * 2 + hotspot.position[0]) * 0.09
      ring.current.scale.setScalar(emphasis ? pulse * 1.16 : pulse)
    }

    if (group.current) {
      group.current.position.y =
        hotspot.position[1] + Math.sin(time * 1.3 + hotspot.position[2]) * 0.035
    }
  })

  return (
    <group ref={group} position={hotspot.position}>
      <Billboard>
        {/* Hit area. Invisible but still raycast, and generous enough that the
            ring and the label are both easy to click. */}
        <mesh
          position={[0, 0.34, -0.02]}
          onPointerOver={(event) => {
            if (!interactive) return
            event.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = ''
          }}
          onPointerDown={(event) => {
            if (!interactive) return
            event.stopPropagation()
            onSelect()
          }}
        >
          <planeGeometry args={[Math.max(current?.width ?? 0.9, 0.9) + 0.3, (current?.height ?? 0.3) + 0.62]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Soft halo */}
        <mesh>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial
            color={hotspot.color}
            transparent
            opacity={emphasis ? 0.3 : 0.14}
            depthWrite={false}
          />
        </mesh>

        {/* Ring */}
        <mesh ref={ring}>
          <ringGeometry args={[0.11, 0.142, 40]} />
          <meshBasicMaterial
            color={hotspot.color}
            transparent
            opacity={emphasis ? 1 : 0.62}
            depthWrite={false}
          />
        </mesh>

        {/* Core dot */}
        <mesh>
          <circleGeometry args={[0.045, 20]} />
          <meshBasicMaterial
            color="#fffaf0"
            transparent
            opacity={emphasis ? 0.95 : 0.5}
            depthWrite={false}
          />
        </mesh>

        {/* Label. `depthTest: false` keeps it readable through furniture, the
            same way a heads-up marker would behave. */}
        {current && (
          <mesh key={current ? 'ready' : 'pending'} position={[0, 0.34 + (current?.height ?? 0) / 2, 0]} renderOrder={30}>
            <planeGeometry args={[current.width, current.height]} />
            <meshBasicMaterial
              map={current.texture}
              transparent
              depthTest={false}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        )}
      </Billboard>
    </group>
  )
}
