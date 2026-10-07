import Image from 'next/image'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

type HeadingProps = ComponentPropsWithoutRef<'h2'> & { node?: unknown }
type AnchorProps = ComponentPropsWithoutRef<'a'> & { node?: unknown }
type ImageProps = ComponentPropsWithoutRef<'img'> & { node?: unknown }

/** Visible-on-hover anchor appended to every h2/h3. */
function HeadingAnchor({ id }: { id?: string }) {
  if (!id) return null

  return (
    <a href={`#${id}`} className="heading-anchor" aria-label="Link to this section">
      #
    </a>
  )
}

function makeHeading(level: 'h2' | 'h3') {
  const Tag = level

  return function Heading({ node: _node, id, children, ...rest }: HeadingProps) {
    return (
      <Tag id={id} {...rest}>
        {children}
        <HeadingAnchor id={id} />
      </Tag>
    )
  }
}

function Anchor({ node: _node, href = '', children, ...rest }: AnchorProps) {
  const isExternal = /^https?:\/\//i.test(href) || href.startsWith('//')

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    )
  }

  // `rehypeLocalizeLinks` has already prefixed internal links with the locale,
  // so they can go straight through next/link for client-side navigation.
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}

function MdxImage({ node: _node, src = '', alt = '', title, className }: ImageProps) {
  if (typeof src !== 'string' || src === '') return null

  // `width={0} height={0}` plus `h-auto w-full` is the documented Next.js
  // pattern for images whose intrinsic size is not known at build time.
  // Props are picked explicitly rather than spread: the raw `width`/`height`
  // attributes of an <img> are strings, which next/image will not accept.
  return (
    <Image
      src={src}
      alt={alt}
      title={title}
      width={0}
      height={0}
      sizes="(max-width: 768px) 100vw, 720px"
      className={cn('h-auto w-full', className)}
    />
  )
}

function Figure({ children, ...rest }: ComponentPropsWithoutRef<'figure'> & { node?: unknown }) {
  return <figure {...rest}>{children}</figure>
}

export interface MdxComponentsOptions {
  locale: Locale
  /** Rendered as a call to action under the article body. */
  footer?: ReactNode
}

/**
 * Component map handed to `compileMDX`. Everything visual is driven by the
 * `.prose-room` styles in `globals.css`; this only fixes behaviour.
 */
export function createMdxComponents({ locale }: MdxComponentsOptions) {
  void locale

  return {
    h2: makeHeading('h2'),
    h3: makeHeading('h3'),
    a: Anchor,
    img: MdxImage,
    figure: Figure,
  }
}
