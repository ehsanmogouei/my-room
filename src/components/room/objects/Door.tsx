'use client'

import { MATERIALS, type RoomTheme } from '../roomConfig'

/**
 * The door on the front wall — the way out, and the `/about` marker.
 * Left slightly ajar with light coming through the gap, because a closed door
 * reads as "you are locked in", which is the opposite of the point.
 */
export function Door({ theme }: { theme: RoomTheme }) {
  const width = 1.2
  const height = 2.15
  const openAngle = 0.62

  return (
    <group position={[0, 0, 4.76]}>
      {/* Frame */}
      {(
        [
          [-width / 2 - 0.05, height / 2, 0.1, height + 0.1],
          [width / 2 + 0.05, height / 2, 0.1, height + 0.1],
        ] as const
      ).map(([x, y, w, h], index) => (
        <mesh key={`post${index}`} position={[x, y, 0]} castShadow>
          <boxGeometry args={[w, h, 0.16]} />
          <meshStandardMaterial color={MATERIALS.doorFrame} roughness={0.75} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.05, 0]} castShadow>
        <boxGeometry args={[width + 0.2, 0.1, 0.16]} />
        <meshStandardMaterial color={MATERIALS.doorFrame} roughness={0.75} />
      </mesh>

      {/* The room beyond, so the gap is not a hole into nothing. */}
      <mesh position={[0, height / 2, 0.04]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={theme.window.glow > 0.5 ? '#f6e2bd' : '#3a2f26'} />
      </mesh>

      {/* Leaf, hinged on the left post */}
      <group position={[-width / 2, 0, 0]} rotation={[0, openAngle, 0]}>
        <mesh position={[width / 2, height / 2, 0.06]} castShadow>
          <boxGeometry args={[width, height, 0.05]} />
          <meshStandardMaterial color={MATERIALS.door} roughness={0.8} />
        </mesh>

        {/* Two recessed panels */}
        {[
          { y: height * 0.68, h: height * 0.34 },
          { y: height * 0.26, h: height * 0.36 },
        ].map((panel, index) => (
          <mesh key={index} position={[width / 2, panel.y, 0.09]}>
            <boxGeometry args={[width * 0.68, panel.h, 0.012]} />
            <meshStandardMaterial color="#3f2c1c" roughness={0.85} />
          </mesh>
        ))}

        {/* Handle */}
        <mesh position={[width - 0.12, height * 0.46, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.12, 12]} />
          <meshStandardMaterial color={MATERIALS.frameGold} roughness={0.35} metalness={0.7} />
        </mesh>
        <mesh position={[width - 0.12, height * 0.46, -0.11]}>
          <sphereGeometry args={[0.036, 14, 14]} />
          <meshStandardMaterial color={MATERIALS.frameGold} roughness={0.35} metalness={0.7} />
        </mesh>
      </group>

      {/* Light spilling through the gap and pooling on the floor. */}
      <pointLight
        position={[width / 2 + 0.35, 1.3, -0.3]}
        color={theme.window.glow > 0.5 ? '#ffdca8' : '#6b7fb0'}
        intensity={theme.window.glow > 0.5 ? 4.5 : 2}
        distance={5}
        decay={2}
      />
      <mesh position={[width / 2 + 0.25, 0.004, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 1.9]} />
        <meshBasicMaterial
          color={theme.window.glow > 0.5 ? '#ffdca8' : '#5d6da0'}
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  )
}
