import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { createMdxComponents } from '@/components/mdx/components'
import { rehypeExternalLinks, rehypeLocalizeLinks } from '@/lib/rehype-localize'
import type { Locale } from '@/lib/types'

/**
 * Code blocks are always dark, in both themes. That is a deliberate design
 * decision: one Shiki theme instead of two means half the CSS and a panel that
 * reads as intentional rather than as a leftover.
 */
const prettyCodeOptions = {
  theme: 'vesper',
  keepBackground: false,
  defaultLang: { block: 'text', inline: 'text' },
} satisfies Parameters<typeof rehypePrettyCode>[0]

/**
 * Server component that turns an MDX string into rendered React.
 * Frontmatter has already been stripped by the content loader, so parsing it
 * again here would only be a source of drift.
 */
export async function MdxContent({
  source,
  locale,
  className,
}: {
  source: string
  locale: Locale
  className?: string
}) {
  const { content } = await compileMDX({
    source,
    components: createMdxComponents({ locale }),
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeLocalizeLinks, { locale }],
          rehypeExternalLinks,
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    },
  })

  return <div className={className ? `prose-room ${className}` : 'prose-room'}>{content}</div>
}
