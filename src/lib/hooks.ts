'use client'

import { useCallback, useSyncExternalStore } from 'react'

export interface WebGLSupport {
  /** True when a WebGL context could be created. */
  supported: boolean
  /** False until the probe has run on the client. */
  checked: boolean
}

/** A store that never changes: used with `useSyncExternalStore` for reads. */
const neverChanges = () => () => {}

/* -------------------------------------------------------------------------- */
/* Hydration                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * `false` on the server, `true` after hydration.
 * This is the React-recommended way to ask "am I on the client yet" — it does
 * not schedule an extra render the way `useEffect(() => setMounted(true))` does.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  )
}

/* -------------------------------------------------------------------------- */
/* Media queries                                                              */
/* -------------------------------------------------------------------------- */

/** Subscribe to a CSS media query. `false` before hydration. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/* -------------------------------------------------------------------------- */
/* WebGL capability                                                           */
/* -------------------------------------------------------------------------- */

// Probing creates a GPU context, so the answer is cached for the page lifetime.
let webglProbe: boolean | null = null

function probeWebGL(): boolean {
  if (webglProbe !== null) return webglProbe

  try {
    const canvas = document.createElement('canvas')
    const context =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')

    webglProbe = Boolean(context)

    // Release the probe context immediately; browsers cap how many can exist.
    if (context && 'getExtension' in context) {
      ;(context as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    webglProbe = false
  }

  return webglProbe
}

export function useWebGLSupport(): WebGLSupport {
  const mounted = useMounted()
  const supported = useSyncExternalStore(neverChanges, probeWebGL, () => false)

  return { supported, checked: mounted }
}

/* -------------------------------------------------------------------------- */
/* Device capability                                                          */
/* -------------------------------------------------------------------------- */

let lowPowerProbe: boolean | null = null

/** Rough guess at whether shadows and high particle counts are affordable. */
export function getLowPowerDevice(): boolean {
  if (lowPowerProbe !== null) return lowPowerProbe

  const cores = navigator.hardwareConcurrency ?? 8
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8

  lowPowerProbe = cores <= 4 || memory <= 4
  return lowPowerProbe
}

export function useLowPowerDevice(): boolean {
  return useSyncExternalStore(neverChanges, getLowPowerDevice, () => false)
}
