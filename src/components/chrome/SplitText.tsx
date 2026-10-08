import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

/**
 * Splits a string into spans so CSS can stagger their entrance.
 *
 * Done at render time on the server, so the characters are already separated in
 * the HTML — no flash of unsplit text, and the animation stays pure CSS
 * (`html.js .ch i` in globals.css).
 *
 * Important: connected scripts are split by *word*, not by character. Putting
 * each Persian letter in its own inline-block would break the joins and render
 * a word as isolated letterforms.
 */
const CONNECTED_SCRIPT = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/

export function SplitText({
  text,
  className,
  as: Tag = 'span',
}: {
  text: string
  className?: string
  as?: 'span' | 'h1' | 'h2' | 'div'
}) {
  const units = CONNECTED_SCRIPT.test(text) ? text.split(/(\s+)/) : Array.from(text)

  return (
    <Tag className={cn(className)}>
      {units.map((unit, index) => (
        <span
          key={`${unit}-${index}`}
          className="ch"
          style={{ '--i': index } as CSSProperties}
        >
          <i>{unit === ' ' ? '\u00A0' : unit}</i>
        </span>
      ))}
    </Tag>
  )
}
