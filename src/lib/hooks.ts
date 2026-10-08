'use client'

import { useCallback, useSyncExternalStore } from 'react'

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
/* Device capability                                                          */
/* -------------------------------------------------------------------------- */

let lowPowerProbe: boolean | null = null

/**
 * Rough guess at whether the animated canvas can afford a high frame rate.
 * The hero reads this to lower its own quality rather than dropping frames.
 */
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
