'use client'

import { Lamp, Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

/**
 * Three-state visual: sun in day mode, lamp glow in night mode.
 * Renders a neutral icon until hydrated so the markup matches the server.
 */
export function ThemeToggle({
  className,
  labels,
  variant = 'icon',
}: {
  className?: string
  labels: { theme: string; day: string; night: string }
  variant?: 'icon' | 'lamp'
}) {
  const { theme, ready, toggleTheme } = useTheme()
  const isNight = theme === 'night'

  const title = `${labels.theme}: ${isNight ? labels.night : labels.day}`

  if (variant === 'lamp') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={title}
        aria-label={title}
        aria-pressed={isNight}
        className={cn(
          'group inline-flex items-center gap-2 rounded-full border border-subtle px-3 py-1.5 text-xs font-semibold text-ink-muted transition-colors hover:border-strong hover:text-ink',
          className,
        )}
      >
        <Lamp
          className={cn(
            'size-4 transition-colors',
            ready && isNight ? 'text-accent' : 'text-ink-faint',
          )}
        />
        <span>{isNight ? labels.night : labels.day}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={title}
      aria-label={title}
      aria-pressed={isNight}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full border border-subtle text-ink-muted transition-colors hover:border-strong hover:text-ink',
        className,
      )}
    >
      {!ready ? (
        <span className="size-4" aria-hidden="true" />
      ) : isNight ? (
        <Moon className="size-4" aria-hidden="true" />
      ) : (
        <Sun className="size-4" aria-hidden="true" />
      )}
    </button>
  )
}
