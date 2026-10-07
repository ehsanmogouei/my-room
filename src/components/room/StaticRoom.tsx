'use client'

import { BookOpen, Clock, DoorOpen, Images, Lamp, Link as LinkIcon, Monitor } from 'lucide-react'
import Link from 'next/link'
import type { ComponentType } from 'react'

import type { Dictionary } from '@/lib/dictionaries'
import type { HotspotId, Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

import { HOTSPOTS } from './roomConfig'

const ICONS: Record<HotspotId, ComponentType<{ className?: string }>> = {
  window: Clock,
  desk: Monitor,
  galleryWall: Images,
  bookshelf: BookOpen,
  corkboard: LinkIcon,
  door: DoorOpen,
  lamp: Lamp,
}

/** Wall layout mirrors the 3D room, so switching modes is not disorienting. */
const LAYOUT: HotspotId[][] = [
  ['window', 'desk', 'galleryWall'],
  ['corkboard', 'lamp', 'bookshelf'],
  ['door'],
]

/**
 * The room without WebGL.
 *
 * Used on phones, when `prefers-reduced-motion` is set, when WebGL is
 * unavailable, or when the visitor simply prefers it. It carries exactly the
 * same destinations as the 3D scene — nothing is locked behind the canvas.
 */
export function StaticRoom({
  locale,
  dict,
  mode,
  onToggleTheme,
  onUse3D,
  canUse3D,
  className,
}: {
  locale: Locale
  dict: Dictionary
  mode: 'day' | 'night'
  onToggleTheme: () => void
  onUse3D: () => void
  canUse3D: boolean
  className?: string
}) {
  const byId = new Map(HOTSPOTS.map((hotspot) => [hotspot.id, hotspot]))

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'grain relative overflow-hidden rounded-3xl border border-subtle p-4 sm:p-6',
          mode === 'night'
            ? 'bg-[linear-gradient(180deg,#0f1420_0%,#191c26_58%,#241d16_100%)]'
            : 'bg-[linear-gradient(180deg,#f3e7d3_0%,#e9dac2_58%,#c9a781_100%)]',
        )}
      >
        {/* Wall trim + floor line, so it still reads as a room. */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 bottom-0 h-24',
            mode === 'night' ? 'bg-[#2a2018]' : 'bg-[#a37c54]',
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 bottom-24 h-px',
            mode === 'night' ? 'bg-white/10' : 'bg-black/10',
          )}
        />

        <div className="relative grid gap-3">
          {LAYOUT.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={cn(
                'grid gap-3',
                row.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-3',
                row.length === 1 && 'sm:grid-cols-1',
              )}
            >
              {row.map((id) => {
                const hotspot = byId.get(id)
                if (!hotspot) return null

                const Icon = ICONS[id]
                const copy = dict.room.hotspots[id]

                return (
                  <SceneObject
                    key={id}
                    icon={Icon}
                    title={copy.label}
                    description={copy.description}
                    accent={hotspot.color}
                    mode={mode}
                    wide={row.length === 1}
                    action={
                      hotspot.action === 'theme'
                        ? { kind: 'button', onClick: onToggleTheme }
                        : {
                            kind: 'link',
                            href: `/${locale}${hotspot.href ?? ''}`,
                          }
                    }
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {canUse3D && (
        <div className="mt-4 flex justify-center">
          <button type="button" onClick={onUse3D} className="btn btn-ghost">
            {dict.room.use3D}
          </button>
        </div>
      )}
    </div>
  )
}

function SceneObject({
  icon: Icon,
  title,
  description,
  accent,
  mode,
  wide,
  action,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  accent: string
  mode: 'day' | 'night'
  wide?: boolean
  action: { kind: 'link'; href: string } | { kind: 'button'; onClick: () => void }
}) {
  const className = cn(
    'group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-subtle/70 p-4 text-start backdrop-blur-sm transition-all duration-200',
    'hover:-translate-y-0.5 hover:shadow-lift focus-visible:-translate-y-0.5',
    mode === 'night' ? 'bg-white/[0.045] hover:bg-white/[0.075]' : 'bg-white/65 hover:bg-white/85',
    wide && 'sm:mx-auto sm:max-w-sm',
  )

  const inner = (
    <>
      {/* Accent wash, tinted per object */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.09] transition-opacity group-hover:opacity-20"
        style={{ background: `radial-gradient(120px 90px at 12% 40%, ${accent}, transparent 70%)` }}
      />

      <span
        className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-subtle/70 bg-surface-raised/80"
        style={{ color: accent }}
        aria-hidden="true"
      >
        <Icon className="size-5" />
      </span>

      <span className="relative min-w-0">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="block truncate text-xs text-ink-muted">{description}</span>
      </span>
    </>
  )

  if (action.kind === 'button') {
    return (
      <button type="button" onClick={action.onClick} className={className}>
        {inner}
      </button>
    )
  }

  return (
    <Link href={action.href} className={className}>
      {inner}
    </Link>
  )
}
