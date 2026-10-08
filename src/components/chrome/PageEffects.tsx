'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value

const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SOFT = () => typeof window !== 'undefined' && window.innerWidth <= 860

const SCRAMBLE_CHARS = '\u259A\u259E\u2588\u2593\u2592\u2591/\\<>_+=*#%@01'

/**
 * Attaches the page-level motion behaviours to whatever the server rendered.
 *
 * Everything here is progressive: the markup is complete and readable without
 * it, and every behaviour is declared in the markup with a `data-` attribute
 * rather than being wired per component. That keeps the interactive surface in
 * one file and lets any page opt in by adding an attribute.
 */
export function PageEffects() {
  const pathname = usePathname()

  // Re-attached on navigation, because a client transition swaps the DOM.
  useEffect(() => {
    const cleanups: Array<() => void> = []
    const reduced = REDUCED()

    /* ---------------------------------------------------- nav on scroll */
    const nav = document.querySelector('.nav')
    if (nav) {
      const onScrollNav = () => nav.classList.toggle('scrolled', window.scrollY > 40)
      window.addEventListener('scroll', onScrollNav, { passive: true })
      onScrollNav()
      cleanups.push(() => window.removeEventListener('scroll', onScrollNav))
    }

    /* -------------------------------------------------- reveal + counters */
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const countTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'))
    const scrambleTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-scramble]'))

    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach((el) => el.classList.add('revealed'))
      scrambleTargets.forEach((el) => {
        if (el.dataset.text) el.textContent = el.dataset.text
      })
    } else {
      const reveal = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            entry.target.classList.add('revealed')
            reveal.unobserve(entry.target)
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
      )
      revealTargets.forEach((el) => reveal.observe(el))
      cleanups.push(() => reveal.disconnect())

      const counter = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            countUp(entry.target as HTMLElement, reduced)
            counter.unobserve(entry.target)
          }
        },
        { threshold: 0.6 },
      )
      countTargets.forEach((el) => {
        const pad = Number.parseInt(el.dataset.pad ?? '0', 10)
        // Park it at zero so the count-up never appears to reset.
        el.textContent = (pad ? '0'.repeat(pad) : '0') + (el.dataset.suffix ?? '')
        counter.observe(el)
      })
      cleanups.push(() => counter.disconnect())

      const scrambler = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            scramble(entry.target as HTMLElement, reduced)
            scrambler.unobserve(entry.target)
          }
        },
        { threshold: 0.35 },
      )
      scrambleTargets.forEach((el) => scrambler.observe(el))
      cleanups.push(() => scrambler.disconnect())
    }

    /* ------------------------------------------------------------ tilt */
    const TILT_TRANSITION =
      'transform .18s ease-out, box-shadow .5s ease, border-color .4s ease'

    for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'))) {
      if (SOFT() || reduced) break

      const onEnter = () => {
        el.style.transition = TILT_TRANSITION
      }

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        if (!rect.width || !rect.height) return

        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height

        el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
        el.style.transform = `perspective(1100px) rotateX(${((0.5 - y) * 7).toFixed(
          2,
        )}deg) rotateY(${((x - 0.5) * 9).toFixed(2)}deg) translateZ(8px)`
      }

      const onLeave = () => {
        el.style.transition = `${TILT_TRANSITION}, opacity .9s cubic-bezier(.22,1,.36,1)`
        el.style.transform = ''
      }

      el.addEventListener('pointerenter', onEnter)
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('pointerenter', onEnter)
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      })
    }

    /* -------------------------------------------------------- magnetic */
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'))) {
      if (reduced) break

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        if (!rect.width || !rect.height || SOFT()) return

        const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
        const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
        el.style.transform = `translate(${(x * 7).toFixed(1)}px, ${(y * 5).toFixed(1)}px)`
      }

      const onLeave = () => {
        el.style.transform = ''
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [pathname])

  /* --------------------------------------------------------- entrance */
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      window.setTimeout(
        () => document.body.classList.add('is-ready'),
        REDUCED() ? 0 : 140,
      )
    })
    return () => window.cancelAnimationFrame(id)
  }, [pathname])

  return null
}

/* -------------------------------------------------------------------------- */
/* Behaviours                                                                 */
/* -------------------------------------------------------------------------- */

function countUp(el: HTMLElement, reduced: boolean) {
  const target = Number.parseFloat(el.dataset.count ?? '0') || 0
  const pad = Number.parseInt(el.dataset.pad ?? '0', 10)
  const suffix = el.dataset.suffix ?? ''

  const format = (value: number) => {
    let out = String(Math.round(value))
    if (pad) out = out.padStart(pad, '0')
    return out + suffix
  }

  if (reduced) {
    el.textContent = format(target)
    return
  }

  const start = performance.now()
  const duration = 1150

  const step = (now: number) => {
    const progress = clamp((now - start) / duration, 0, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = format(target * eased)
    if (progress < 1) window.requestAnimationFrame(step)
    else el.textContent = format(target)
  }

  window.requestAnimationFrame(step)
}

function scramble(el: HTMLElement, reduced: boolean) {
  const text = (el.dataset.text ?? el.textContent ?? '').replace(/\s+/g, ' ').trim()
  el.dataset.text = text

  if (reduced) {
    el.textContent = text
    return
  }

  const length = text.length
  const start = performance.now()
  const duration = 760

  const step = (now: number) => {
    const progress = clamp((now - start) / duration, 0, 1)
    const solid = Math.floor(progress * length)

    let out = text.slice(0, solid)
    for (let index = solid; index < length; index += 1) {
      out +=
        text[index] === ' '
          ? ' '
          : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0]
    }

    el.textContent = out
    if (progress < 1) window.requestAnimationFrame(step)
    else el.textContent = text
  }

  window.requestAnimationFrame(step)
}
