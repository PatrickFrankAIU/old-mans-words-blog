import type { BlogPost } from '~/types/blog'

/**
 * Composable for fetching blog posts
 */
export const usePosts = () => {
  /**
   * Fetch all published posts
   */
  const fetchPosts = async (): Promise<BlogPost[]> => {
    const data = await $fetch<BlogPost[]>('/api/posts')
    return data
  }

  /**
   * Fetch a single post by slug
   */
  const fetchPost = async (slug: string): Promise<BlogPost> => {
    const data = await $fetch<BlogPost>(`/api/posts/${slug}`)
    return data
  }

  return {
    fetchPosts,
    fetchPost,
  }
}
