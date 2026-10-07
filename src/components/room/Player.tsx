'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Euler } from 'three'

import {
  BLOCKERS,
  BOUNDS,
  EYE_HEIGHT,
  HOTSPOTS,
  MARKER_NEAR,
  RUN_SPEED,
  SPAWN,
  WALK_SPEED,
  type RoomHotspot,
} from './roomConfig'

export interface PlayerState {
  locked: boolean
  nearest: RoomHotspot | null
}

/** Window event asking the room to grab the pointer. */
export const REQUEST_LOCK_EVENT = 'my-room:request-lock'
/** Window event fired when the player presses E near a hotspot. */
export const ENTER_HOTSPOT_EVENT = 'my-room:enter-hotspot'

/**
 * First-person controller.
 *
 * Hand-written rather than drei's `PointerLockControls` for one reason:
 * pointer lock must be requested only when the visitor clicks *empty space*.
 * Clicking a hotspot label has to navigate, and a control that locks on any
 * canvas click would fight the labels.
 */
export function Player({
  onState,
  enabled = true,
  reducedMotion = false,
}: {
  onState: (state: PlayerState) => void
  enabled?: boolean
  reducedMotion?: boolean
}) {
  const { camera, gl } = useThree()

  const yaw = useRef(0)
  const pitch = useRef(0)
  const locked = useRef(false)
  const keys = useRef<Record<string, boolean>>({})
  const bob = useRef(0)
  const nearest = useRef<RoomHotspot | null>(null)

  // Kept in a ref so the event listeners below never need to re-subscribe.
  // Assigned inside an effect rather than during render: writing to a ref while
  // rendering is a side effect that React 19's compiler rules reject.
  const onStateRef = useRef(onState)
  useEffect(() => {
    onStateRef.current = onState
  }, [onState])

  const lookEuler = useMemo(() => new Euler(0, 0, 0, 'YXZ'), [])

  const report = () => onStateRef.current({ locked: locked.current, nearest: nearest.current })

  /* ------------------------------------------------------------- spawn */
  useEffect(() => {
    camera.position.set(...SPAWN.position)

    const [tx, ty, tz] = SPAWN.lookAt
    const dx = tx - SPAWN.position[0]
    const dy = ty - SPAWN.position[1]
    const dz = tz - SPAWN.position[2]

    // Yaw so the camera's -Z axis points at the target; pitch to its height.
    yaw.current = Math.atan2(-dx, -dz)
    pitch.current = Math.atan2(dy, Math.hypot(dx, dz))

    lookEuler.set(pitch.current, yaw.current, 0, 'YXZ')
    camera.quaternion.setFromEuler(lookEuler)
  }, [camera, lookEuler])

  /* ------------------------------------------------------- pointer lock */
  useEffect(() => {
    const element = gl.domElement

    const lock = () => {
      if (!enabled || document.pointerLockElement === element) return

      try {
        const result = element.requestPointerLock() as unknown
        // Chrome returns a promise and rejects if the request is too soon
        // after an exit; that rejection is expected and not worth surfacing.
        if (result && typeof (result as Promise<void>).catch === 'function') {
          void (result as Promise<void>).catch(() => {})
        }
      } catch {
        // Pointer lock unavailable — labels remain clickable.
      }
    }

    const onLockChange = () => {
      locked.current = document.pointerLockElement === element
      report()
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!locked.current || !enabled) return

      const sensitivity = 0.0022
      yaw.current -= event.movementX * sensitivity
      pitch.current -= event.movementY * sensitivity

      const limit = Math.PI / 2 - 0.06
      pitch.current = Math.max(-limit, Math.min(limit, pitch.current))

      lookEuler.set(pitch.current, yaw.current, 0, 'YXZ')
      camera.quaternion.setFromEuler(lookEuler)
    }

    const onRequestLock = () => lock()

    document.addEventListener('pointerlockchange', onLockChange)
    document.addEventListener('mousemove', onMouseMove)
    window.addEventListener(REQUEST_LOCK_EVENT, onRequestLock)

    return () => {
      document.removeEventListener('pointerlockchange', onLockChange)
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener(REQUEST_LOCK_EVENT, onRequestLock)
    }
  }, [camera, enabled, gl, lookEuler])

  /* --------------------------------------------------------- keyboard */
  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return

      keys.current[event.key.toLowerCase()] = true

      if (event.key.toLowerCase() === 'e' && nearest.current) {
        event.preventDefault()
        window.dispatchEvent(
          new CustomEvent(ENTER_HOTSPOT_EVENT, { detail: { id: nearest.current.id } }),
        )
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false
    }

    const onBlur = () => {
      keys.current = {}
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [enabled])

  /* ------------------------------------------------------------- frame */
  useFrame((state, delta) => {
    // Read the camera from the frame state rather than the render-scoped
    // value, so this callback only ever mutates something it owns.
    const camera = state.camera

    const step = Math.min(delta, 0.05)
    const pressed = keys.current

    const forward =
      (pressed['w'] || pressed['arrowup'] ? 1 : 0) - (pressed['s'] || pressed['arrowdown'] ? 1 : 0)
    const strafe =
      (pressed['d'] || pressed['arrowright'] ? 1 : 0) -
      (pressed['a'] || pressed['arrowleft'] ? 1 : 0)

    const isMoving = forward !== 0 || strafe !== 0
    const speed = pressed['shift'] ? RUN_SPEED : WALK_SPEED

    if (isMoving) {
      // Forward is the camera's -Z projected onto the floor, so looking up
      // never lifts the player off the ground.
      const sin = Math.sin(yaw.current)
      const cos = Math.cos(yaw.current)

      const dx = (-sin * forward + cos * strafe) * speed * step
      const dz = (-cos * forward - sin * strafe) * speed * step

      // Resolve axes separately so the player slides along obstacles
      // instead of sticking to them.
      if (!blocked(camera.position.x + dx, camera.position.z)) camera.position.x += dx
      if (!blocked(camera.position.x, camera.position.z + dz)) camera.position.z += dz

      if (!reducedMotion) bob.current += step * (speed > WALK_SPEED ? 11 : 8)
    }

    camera.position.y =
      EYE_HEIGHT + (reducedMotion || !isMoving ? 0 : Math.sin(bob.current) * 0.028)

    /* ---- proximity: only notify React when the nearest target changes --- */
    let closest: RoomHotspot | null = null
    let closestDistance = MARKER_NEAR

    for (const hotspot of HOTSPOTS) {
      const distance = Math.hypot(
        hotspot.position[0] - camera.position.x,
        hotspot.position[2] - camera.position.z,
      )
      if (distance < closestDistance) {
        closestDistance = distance
        closest = hotspot
      }
    }

    if (closest?.id !== nearest.current?.id) {
      nearest.current = closest
      report()
    }
  })

  return null
}

/** True when the position is inside an obstacle or outside the walkable area. */
function blocked(x: number, z: number): boolean {
  if (x < BOUNDS.min || x > BOUNDS.max || z < BOUNDS.min || z > BOUNDS.max) return true

  return BLOCKERS.some((box) => x > box.x[0] && x < box.x[1] && z > box.z[0] && z < box.z[1])
}
