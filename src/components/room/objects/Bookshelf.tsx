'use client'

import { useMemo } from 'react'

import { BOOK_COLORS, MATERIALS } from '../roomConfig'

const SHELF_WIDTH = 3.6
const SHELF_DEPTH = 0.3
const SHELF_HEIGHT = 2.24
const SHELF_LEVELS = [0.05, 0.6, 1.14, 1.68]

/** Tiny LCG so the shelf looks identical on every render and every reload. */
function makeRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    return state / 0x7fffffff
  }
}

interface Book {
  x: number
  height: number
  width: number
  color: string
  lean: number
}

function buildShelf(level: number): Book[] {
  const random = makeRandom(1337 + level * 977)
  const books: Book[] = []
  let cursor = -SHELF_WIDTH / 2 + 0.12

  while (cursor < SHELF_WIDTH / 2 - 0.2) {
    const width = 0.035 + random() * 0.045
    const height = 0.26 + random() * 0.14
    const color = BOOK_COLORS[Math.floor(random() * BOOK_COLORS.length)]

    // Every so often a book slumps against its neighbour. It is a small
    // detail that stops the shelf reading as a texture.
    const lean = random() > 0.88 ? (random() - 0.5) * 0.22 : 0

    books.push({ x: cursor + width / 2, height, width, color, lean })
    cursor += width + 0.004 + random() * 0.012

    // Leave a gap sometimes, as if a book is currently being read.
    if (random() > 0.94) cursor += 0.18
  }

  return books
}

/**
 * The bookshelf: what the writing lives behind.
 * Built along +X and rotated onto the right-hand wall.
 */
export function Bookshelf() {
  const shelves = useMemo(() => SHELF_LEVELS.map((_, level) => buildShelf(level)), [])

  return (
    <group position={[4.64, 0, -0.8]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Back panel */}
      <mesh position={[0, SHELF_HEIGHT / 2, -SHELF_DEPTH / 2 + 0.01]} receiveShadow>
        <boxGeometry args={[SHELF_WIDTH, SHELF_HEIGHT, 0.03]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.9} />
      </mesh>

      {/* Uprights */}
      {[-SHELF_WIDTH / 2, SHELF_WIDTH / 2].map((x) => (
        <mesh key={x} position={[x, SHELF_HEIGHT / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.04, SHELF_HEIGHT, SHELF_DEPTH]} />
          <meshStandardMaterial color={MATERIALS.shelfWood} roughness={0.78} />
        </mesh>
      ))}

      {/* Shelves plus their books */}
      {SHELF_LEVELS.map((y, level) => (
        <group key={y}>
          <mesh position={[0, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[SHELF_WIDTH, 0.035, SHELF_DEPTH]} />
            <meshStandardMaterial color={MATERIALS.shelfWood} roughness={0.78} />
          </mesh>

          {shelves[level].map((book, index) => (
            <mesh
              key={index}
              position={[book.x, y + 0.018 + book.height / 2, 0.01]}
              rotation={[0, 0, book.lean]}
              castShadow
            >
              <boxGeometry args={[book.width, book.height, SHELF_DEPTH * 0.78]} />
              <meshStandardMaterial color={book.color} roughness={0.88} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Top board */}
      <mesh position={[0, SHELF_HEIGHT, 0]} castShadow receiveShadow>
        <boxGeometry args={[SHELF_WIDTH + 0.06, 0.04, SHELF_DEPTH + 0.04]} />
        <meshStandardMaterial color={MATERIALS.shelfWood} roughness={0.78} />
      </mesh>

      {/* Something on top of the shelf, because nobody's shelf is empty. */}
      <mesh position={[-1.1, SHELF_HEIGHT + 0.11, 0]} castShadow>
        <boxGeometry args={[0.5, 0.18, 0.22]} />
        <meshStandardMaterial color="#5a7a4a" roughness={0.85} />
      </mesh>
      <mesh position={[1.15, SHELF_HEIGHT + 0.09, 0]} castShadow>
        <boxGeometry args={[0.34, 0.14, 0.2]} />
        <meshStandardMaterial color="#8a5a3a" roughness={0.85} />
      </mesh>
    </group>
  )
}
