'use client'

import { DoubleSide } from 'three'

import { MATERIALS, type RoomTheme } from '../roomConfig'

/* -------------------------------------------------------------------------- */
/* Window                                                                     */
/* -------------------------------------------------------------------------- */

const WINDOW = {
  position: [-3.45, 1.78, -4.74] as [number, number, number],
  width: 1.9,
  height: 1.65,
}

/**
 * The window is where the room gets its outside from, and it is also the
 * `/now` marker. The pane is emissive rather than transparent: there is no
 * world outside to render, so it is painted instead.
 */
export function Window({ theme }: { theme: RoomTheme }) {
  const { width, height, position } = WINDOW
  const bar = 0.06

  return (
    <group position={position}>
      {/* Recess */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[width + 0.2, height + 0.2]} />
        <meshStandardMaterial color="#1d1a16" roughness={1} />
      </mesh>

      {/* Sky, split into two bands so it reads as depth rather than a swatch */}
      <mesh position={[0, height / 4, -0.02]}>
        <planeGeometry args={[width, height / 2]} />
        <meshBasicMaterial color={theme.window.top} toneMapped={false} />
      </mesh>
      <mesh position={[0, -height / 4, -0.02]}>
        <planeGeometry args={[width, height / 2]} />
        <meshBasicMaterial color={theme.window.bottom} toneMapped={false} />
      </mesh>

      {/* Frame */}
      {(
        [
          [0, height / 2, width + 0.18, 0.1],
          [0, -height / 2, width + 0.18, 0.1],
        ] as const
      ).map(([x, y, w, h], index) => (
        <mesh key={`h${index}`} position={[x, y, 0]}>
          <boxGeometry args={[w, h, 0.12]} />
          <meshStandardMaterial color={MATERIALS.frame} roughness={0.7} />
        </mesh>
      ))}
      {(
        [
          [-width / 2, 0, 0.1, height + 0.18],
          [width / 2, 0, 0.1, height + 0.18],
        ] as const
      ).map(([x, y, w, h], index) => (
        <mesh key={`v${index}`} position={[x, y, 0]}>
          <boxGeometry args={[w, h, 0.12]} />
          <meshStandardMaterial color={MATERIALS.frame} roughness={0.7} />
        </mesh>
      ))}

      {/* Mullions */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[bar, height, 0.06]} />
        <meshStandardMaterial color={MATERIALS.frame} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.12, 0.02]}>
        <boxGeometry args={[width, bar, 0.06]} />
        <meshStandardMaterial color={MATERIALS.frame} roughness={0.7} />
      </mesh>

      {/* Sill */}
      <mesh position={[0, -height / 2 - 0.06, 0.08]}>
        <boxGeometry args={[width + 0.3, 0.06, 0.24]} />
        <meshStandardMaterial color={MATERIALS.frame} roughness={0.75} />
      </mesh>

      {/* Daylight or city glow spilling into the room */}
      <pointLight
        position={[0, 0.2, 0.6]}
        color={theme.window.bottom}
        intensity={theme.window.glow > 0.5 ? 6 : 3.2}
        distance={6}
        decay={2}
      />
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/* Gallery wall                                                               */
/* -------------------------------------------------------------------------- */

const FRAMES = [
  { x: -0.9, y: 0.34, w: 0.55, h: 0.42, tint: '#b4632a' },
  { x: -0.26, y: 0.44, w: 0.42, h: 0.56, tint: '#3f6b6b' },
  { x: 0.34, y: 0.3, w: 0.62, h: 0.44, tint: '#8a4a5a' },
  { x: -0.86, y: -0.42, w: 0.5, h: 0.38, tint: '#4a5a8a' },
  { x: -0.14, y: -0.44, w: 0.66, h: 0.4, tint: '#7a6a3a' },
  { x: 0.6, y: -0.4, w: 0.42, h: 0.5, tint: '#5a7a4a' },
]

/** The gallery wall: what the pictures live behind. */
export function GalleryWall({ theme }: { theme: RoomTheme }) {
  const glow = theme.window.glow > 0.5 ? 0.12 : 0.35

  return (
    <group position={[3.15, 1.85, -4.75]}>
      {FRAMES.map((frame, index) => (
        <group key={index} position={[frame.x, frame.y, 0]} rotation={[0, 0, (index % 3) * 0.01]}>
          {/* Frame */}
          <mesh castShadow>
            <boxGeometry args={[frame.w + 0.06, frame.h + 0.06, 0.035]} />
            <meshStandardMaterial
              color={index % 3 === 0 ? MATERIALS.frameGold : MATERIALS.frame}
              roughness={0.62}
              metalness={index % 3 === 0 ? 0.45 : 0.15}
            />
          </mesh>
          {/* Picture */}
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[frame.w, frame.h]} />
            <meshStandardMaterial
              color={frame.tint}
              emissive={frame.tint}
              emissiveIntensity={glow}
              roughness={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* A length of picture wire, because the frames are hung, not glued. */}
      <mesh position={[0, 0.78, -0.02]}>
        <boxGeometry args={[2.1, 0.012, 0.012]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/* Corkboard                                                                  */
/* -------------------------------------------------------------------------- */

const NOTES = [
  { x: -0.82, y: 0.32, w: 0.2, h: 0.2, tint: '#e8c86a', tilt: -0.06 },
  { x: -0.3, y: 0.36, w: 0.24, h: 0.16, tint: '#d98b5f', tilt: 0.04 },
  { x: 0.34, y: 0.3, w: 0.2, h: 0.22, tint: '#9fc2a8', tilt: -0.03 },
  { x: 0.85, y: 0.34, w: 0.18, h: 0.18, tint: '#c9a0d0', tilt: 0.07 },
  { x: -0.66, y: -0.28, w: 0.3, h: 0.22, tint: '#efe7d8', tilt: 0.02 },
  { x: 0.06, y: -0.32, w: 0.26, h: 0.2, tint: '#efe7d8', tilt: -0.05 },
  { x: 0.72, y: -0.26, w: 0.22, h: 0.2, tint: '#8fb0d0', tilt: 0.03 },
]

/** The corkboard: what the saved links live behind. */
export function Corkboard() {
  return (
    <group position={[-4.76, 1.72, -0.5]} rotation={[0, Math.PI / 2, 0]}>
      {/* Cork */}
      <mesh receiveShadow>
        <boxGeometry args={[2.5, 1.35, 0.04]} />
        <meshStandardMaterial color={MATERIALS.cork} roughness={1} />
      </mesh>

      {/* Frame */}
      {(
        [
          [0, 0.7, 2.6, 0.06],
          [0, -0.7, 2.6, 0.06],
        ] as const
      ).map(([x, y, w, h], index) => (
        <mesh key={`h${index}`} position={[x, y, 0]}>
          <boxGeometry args={[w, h, 0.07]} />
          <meshStandardMaterial color="#4a3324" roughness={0.8} />
        </mesh>
      ))}
      {(
        [
          [-1.27, 0, 0.06, 1.46],
          [1.27, 0, 0.06, 1.46],
        ] as const
      ).map(([x, y, w, h], index) => (
        <mesh key={`v${index}`} position={[x, y, 0]}>
          <boxGeometry args={[w, h, 0.07]} />
          <meshStandardMaterial color="#4a3324" roughness={0.8} />
        </mesh>
      ))}

      {/* Pinned notes */}
      {NOTES.map((note, index) => (
        <group key={index} position={[note.x, note.y, 0.03]} rotation={[0, 0, note.tilt]}>
          <mesh castShadow>
            <planeGeometry args={[note.w, note.h]} />
            <meshStandardMaterial color={note.tint} side={DoubleSide} roughness={0.95} />
          </mesh>
          {/* Pin */}
          <mesh position={[0, note.h / 2 - 0.02, 0.012]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshStandardMaterial color="#c0392b" roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
