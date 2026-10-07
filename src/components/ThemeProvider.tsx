'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

import { useMounted } from '@/lib/hooks'
import { THEME_STORAGE_KEY, type ThemeMode } from '@/lib/theme'

interface ThemeContextValue {
  theme: ThemeMode
  /** False until the client has read the value the bootstrap script wrote. */
  ready: boolean
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/*
 * The `data-theme` attribute on <html> is the single source of truth.
 * The inline bootstrap script sets it before first paint; this store simply
 * observes it. That removes any chance of React state and the DOM disagreeing,
 * and it means the lamp switch inside the 3D room and the header button can
 * both drive the same value without knowing about each other.
 */
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  })
  return () => observer.disconnect()
}

function getThemeSnapshot(): ThemeMode {
  return document.documentElement.dataset.theme === 'day' ? 'day' : 'night'
}

/** Matches the script's default so the server and client markup agree. */
function getServerThemeSnapshot(): ThemeMode {
  return 'night'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const ready = useMounted()
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot)

  // Keep the browser UI (form controls, scrollbars) in step with the class.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'night')
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light'
  }, [theme])

  const setTheme = useCallback((mode: ThemeMode) => {
    document.documentElement.classList.toggle('dark', mode === 'night')
    document.documentElement.dataset.theme = mode

    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {
      // Private mode or storage disabled: the theme still applies for this page.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.dataset.theme === 'day' ? 'night' : 'day')
  }, [setTheme])

  const value = useMemo(
    () => ({ theme, ready, setTheme, toggleTheme }),
    [theme, ready, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
