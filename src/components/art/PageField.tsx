import { GenerativeArt } from '@/components/art/GenerativeArt'
import { cn } from '@/lib/utils'

/**
 * The atmosphere behind every page.
 *
 * A full-screen generative artwork, blurred far enough that it stops being a
 * picture and becomes weather. It is server-rendered SVG, so it costs nothing
 * on the client and cannot flash in after hydration.
 */
export function PageField({ seed, className }: { seed: string; className?: string }) {
  return (
    <div className={cn('page-field', className)} aria-hidden="true">
      <div className="page-field__art">
        <GenerativeArt seed={seed} density="compact" width={1600} height={900} />
      </div>
    </div>
  )
}
