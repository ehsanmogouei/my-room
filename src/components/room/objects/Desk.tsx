'use client'

import { MATERIALS, type RoomTheme } from '../roomConfig'

/**
 * The desk: what the portfolio lives behind.
 * Everything is procedural — no imported models, so the room has no download
 * cost beyond the JavaScript that draws it.
 */
export function Desk({ theme }: { theme: RoomTheme }) {
  const topY = 0.76
  const legHeight = 0.73

  const legs: Array<[number, number]> = [
    [-1.1, -0.3],
    [1.1, -0.3],
    [-1.1, 0.3],
    [1.1, 0.3],
  ]

  return (
    <group position={[0, 0, -4.4]}>
      {/* Top */}
      <mesh position={[0, topY, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.06, 0.78]} />
        <meshStandardMaterial color={MATERIALS.deskTop} roughness={0.72} />
      </mesh>

      {/* Legs */}
      {legs.map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, legHeight / 2, z]} castShadow>
          <boxGeometry args={[0.07, legHeight, 0.07]} />
          <meshStandardMaterial color={MATERIALS.deskLeg} roughness={0.7} metalness={0.1} />
        </mesh>
      ))}

      {/* Monitor stand and neck */}
      <mesh position={[0.1, topY + 0.03, -0.2]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.03, 20]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.1, topY + 0.13, -0.22]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Monitor body */}
      <mesh position={[0.1, topY + 0.46, -0.24]} castShadow>
        <boxGeometry args={[0.96, 0.58, 0.04]} />
        <meshStandardMaterial color={MATERIALS.screenFrame} roughness={0.55} metalness={0.3} />
      </mesh>

      {/* Screen: the only strongly emissive surface in the room, so the eye
          lands on the desk first — which is the point of the whole scene. */}
      <mesh position={[0.1, topY + 0.46, -0.216]}>
        <planeGeometry args={[0.89, 0.51]} />
        <meshStandardMaterial
          color={MATERIALS.screen}
          emissive={theme.window.glow > 0.45 ? '#cfd8e6' : '#e0a35c'}
          emissiveIntensity={theme.window.glow > 0.45 ? 0.5 : 0.85}
          roughness={0.3}
        />
      </mesh>

      {/* Keyboard and mouse */}
      <mesh position={[0.1, topY + 0.02, 0.02]} castShadow>
        <boxGeometry args={[0.64, 0.022, 0.2]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.6} />
      </mesh>
      <mesh position={[0.56, topY + 0.022, 0.02]} castShadow>
        <boxGeometry args={[0.09, 0.028, 0.14]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.55} />
      </mesh>

      {/* Mug */}
      <group position={[0.82, topY + 0.05, -0.06]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.038, 0.1, 18]} />
          <meshStandardMaterial color={MATERIALS.mug} roughness={0.6} />
        </mesh>
        <mesh position={[0.058, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.028, 0.008, 8, 16]} />
          <meshStandardMaterial color={MATERIALS.mug} roughness={0.6} />
        </mesh>
      </group>

      {/* Paperwork: a couple of sheets, slightly askew. */}
      <mesh
        position={[-0.72, topY + 0.01, 0.04]}
        rotation={[0, 0.18, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.3, 0.006, 0.42]} />
        <meshStandardMaterial color={MATERIALS.paper} roughness={0.95} />
      </mesh>
      <mesh
        position={[-0.66, topY + 0.017, 0.0]}
        rotation={[0, -0.26, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.3, 0.006, 0.42]} />
        <meshStandardMaterial color="#e3d9c6" roughness={0.95} />
      </mesh>

      {/* A short stack of books keeps the desk from looking like a showroom. */}
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          position={[-1.0, topY + 0.035 + index * 0.035, -0.16]}
          rotation={[0, index * 0.06, 0]}
          castShadow
        >
          <boxGeometry args={[0.24, 0.032, 0.18]} />
          <meshStandardMaterial
            color={['#8a4a5a', '#3f6b6b', '#7a6a3a'][index]}
            roughness={0.85}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Desk chair. Present mainly so the desk has someone missing from it. */
export function Chair() {
  return (
    <group position={[0.1, 0, -3.05]}>
      <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.07, 0.44]} />
        <meshStandardMaterial color={MATERIALS.chair} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.78, 0.2]} rotation={[0.14, 0, 0]} castShadow>
        <boxGeometry args={[0.44, 0.55, 0.07]} />
        <meshStandardMaterial color={MATERIALS.chair} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.44, 12]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.5} metalness={0.5} />
      </mesh>
      {[0, 1, 2, 3, 4].map((index) => {
        const angle = (index / 5) * Math.PI * 2
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.16, 0.04, Math.sin(angle) * 0.16]}
            rotation={[0, -angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.3, 0.03, 0.05]} />
            <meshStandardMaterial color={MATERIALS.metal} roughness={0.5} metalness={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

/**
 * The desk lamp, and the room's only switch.
 * Its point light is the difference between day and night inside the room.
 */
export function Lamp({ theme, on }: { theme: RoomTheme; on: boolean }) {
  return (
    <group position={[-1.45, 0.79, -4.42]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.03, 18]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.45} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.22, 0.02]} rotation={[0.22, 0, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.44, 10]} />
        <meshStandardMaterial color={MATERIALS.metal} roughness={0.45} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.44, 0.1]} rotation={[0.9, 0, 0]} castShadow>
        <coneGeometry args={[0.13, 0.18, 20, 1, true]} />
        <meshStandardMaterial
          color="#3c3a36"
          roughness={0.5}
          metalness={0.3}
          side={2}
        />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, 0.4, 0.1]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color="#fff0d0"
          emissive={theme.lamp.color}
          emissiveIntensity={on ? 2.4 : 0.05}
        />
      </mesh>
      <pointLight
        position={[0, 0.42, 0.12]}
        color={theme.lamp.color}
        intensity={theme.lamp.intensity}
        distance={5.5}
        decay={2}
        castShadow={false}
      />
    </group>
  )
}
