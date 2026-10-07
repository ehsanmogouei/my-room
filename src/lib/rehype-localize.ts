import type { Root as HastRoot, Element } from 'hast'

type HastNode = HastRoot | Element | { type: string; children?: HastNode[] }

/**
 * Prefixes root-relative *links* with the active locale, so a post can write
 * `[the projects](/projects)` and still land on `/fa/projects` for a Persian
 * reader.
 *
 * Image sources are deliberately left alone. Files under `public/` are served
 * from the root for every language, and `/fa/gallery/photo.jpg` would collide
 * with the `/fa/gallery` page rather than resolve to the file.
 *
 * External URLs, protocol-relative URLs, `mailto:` and bare fragments are
 * untouched.
 */
export function rehypeLocalizeLinks({ locale }: { locale: string }) {
  const shouldPrefix = (value: string) =>
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.startsWith(`/${locale}/`) &&
    value !== `/${locale}`

  return (tree: HastRoot) => {
    const walk = (node: HastNode) => {
      if (node.type === 'element') {
        const element = node as Element
        const properties = element.properties ?? {}

        const href = properties.href
        if (element.tagName === 'a' && typeof href === 'string' && shouldPrefix(href)) {
          properties.href = `/${locale}${href}`
          element.properties = properties
        }
      }

      for (const child of node.children ?? []) walk(child)
    }

    walk(tree)
  }
}

/**
 * Turns external links inside prose into safe new-tab links and marks them
 * so the styling layer can add a small affordance.
 */
export function rehypeExternalLinks() {
  return (tree: HastRoot) => {
    const walk = (node: HastNode) => {
      if (node.type === 'element') {
        const element = node as Element
        const properties = element.properties ?? {}
        const href = properties.href

        if (
          element.tagName === 'a' &&
          typeof href === 'string' &&
          /^https?:\/\//i.test(href)
        ) {
          properties.target = '_blank'
          properties.rel = ['noopener', 'noreferrer']
          element.properties = properties
        }
      }

      for (const child of node.children ?? []) walk(child)
    }

    walk(tree)
  }
}
