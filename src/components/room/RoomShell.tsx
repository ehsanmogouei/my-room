'use client'

import { ROOM, type RoomTheme } from './roomConfig'

/**
 * Floor, ceiling and four walls. Everything is a plane facing inward; there
 * is no need for a box with `side: BackSide` and it keeps the material count
 * predictable.
 */
export function RoomShell({ theme }: { theme: RoomTheme }) {
  const halfWidth = ROOM.width / 2
  const halfDepth = ROOM.depth / 2
  const { height } = ROOM

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color={theme.floor} roughness={0.92} metalness={0.02} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color={theme.ceiling} roughness={1} />
      </mesh>

      {/* Back wall (holds the desk, window and gallery) */}
      <mesh position={[0, height / 2, -halfDepth]} receiveShadow>
        <planeGeometry args={[ROOM.width, height]} />
        <meshStandardMaterial color={theme.wall} roughness={0.95} />
      </mesh>

      {/* Front wall (holds the door) */}
      <mesh position={[0, height / 2, halfDepth]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, height]} />
        <meshStandardMaterial color={theme.wall} roughness={0.95} />
      </mesh>

      {/* Left wall (corkboard) */}
      <mesh position={[-halfWidth, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.depth, height]} />
        <meshStandardMaterial color={theme.wall} roughness={0.95} />
      </mesh>

      {/* Right wall (bookshelf) */}
      <mesh position={[halfWidth, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.depth, height]} />
        <meshStandardMaterial color={theme.wall} roughness={0.95} />
      </mesh>

      {/* Skirting board: a thin strip that reads as "this is a real room". */}
      {(
        [
          { position: [0, 0.06, -halfDepth + 0.02], rotation: [0, 0, 0], length: ROOM.width },
          { position: [0, 0.06, halfDepth - 0.02], rotation: [0, Math.PI, 0], length: ROOM.width },
          {
            position: [-halfWidth + 0.02, 0.06, 0],
            rotation: [0, Math.PI / 2, 0],
            length: ROOM.depth,
          },
          {
            position: [halfWidth - 0.02, 0.06, 0],
            rotation: [0, -Math.PI / 2, 0],
            length: ROOM.depth,
          },
        ] as const
      ).map((strip, index) => (
        <mesh key={index} position={strip.position} rotation={strip.rotation}>
          <boxGeometry args={[strip.length, 0.12, 0.03]} />
          <meshStandardMaterial color={theme.ceiling} roughness={0.8} />
        </mesh>
      ))}

      {/* Rug: anchors the middle of the room and hides the empty floor. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0.2]} receiveShadow>
        <planeGeometry args={[3.6, 2.8]} />
        <meshStandardMaterial color="#7a3f3a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0.2]}>
        <planeGeometry args={[3.1, 2.3]} />
        <meshStandardMaterial color="#8f4d45" roughness={1} />
      </mesh>
    </group>
  )
}
