import type { Metadata } from 'next'

import { PostList } from '@/components/blog/PostList'
import { PageHeader } from '@/components/ui/PageHeader'
import { getPostSummaries } from '@/lib/content'
import { getDictionary } from '@/lib/dictionaries'
import { resolveLocale } from '@/lib/types'
import { truncate } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)

  return {
    title: dict.blog.title,
    description: truncate(dict.blog.subtitle, 160),
    alternates: {
      canonical: `/${locale}/blog`,
      types: { 'application/rss+xml': `/${locale}/rss.xml` },
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale)
  const dict = getDictionary(locale)
  const posts = getPostSummaries(locale)

  return (
    <div className="container-page py-12">
      <PageHeader
        eyebrow={dict.nav.blog}
        title={dict.blog.title}
        subtitle={dict.blog.subtitle}
      />

      <div className="mt-8">
        <PostList posts={posts} locale={locale} dict={dict} />
      </div>
    </div>
  )
}
