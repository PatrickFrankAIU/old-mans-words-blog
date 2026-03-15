import type { Ref } from 'vue'
import type { BlogPost } from '~/types/blog'

const SITE_NAME = "Old Man's Words"
const PUBLISHER = { '@type': 'Organization', name: 'OldMansWords' } as const

/**
 * Injects BlogPosting + BreadcrumbList JSON-LD into <head> for a blog post page.
 * Call this once after the post data is available (e.g. after useAsyncData).
 *
 * @param post    - reactive ref to the fetched BlogPost (may be null/undefined)
 * @param postUrl - full canonical URL of this post (e.g. https://example.com/blog/my-post)
 * @param siteUrl - site root URL from runtimeConfig.public.siteUrl
 */
export function useBlogPostStructuredData(
  post: Ref<BlogPost | null | undefined>,
  postUrl: string,
  siteUrl: string,
) {
  useHead(() => {
    if (!post.value) return {}

    const description = post.value.description || post.value.title
    const image = post.value.cardImage
      ? `${siteUrl}${post.value.cardImage}`
      : `${siteUrl}/images/oldmanlogo.png`

    const blogPosting = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.value.title,
      description,
      author: PUBLISHER,
      datePublished: post.value.date,
      dateModified: post.value.date,
      image,
      mainEntityOfPage: postUrl,
      url: postUrl,
      publisher: PUBLISHER,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: siteUrl,
      },
      inLanguage: 'en-US',
    }

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: post.value.title,
          item: postUrl,
        },
      ],
    }

    return {
      script: [
        {
          key: 'ld-blogposting',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(blogPosting),
        },
        {
          key: 'ld-breadcrumb',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumb),
        },
      ],
    }
  })
}
