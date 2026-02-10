<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const route = useRoute()
const slug = route.params.slug as string
const config = useRuntimeConfig()

const { fetchPost } = usePosts()

// Fetch post on page load
const { data: post, error, pending } = await useAsyncData<BlogPost>(
  `post-${slug}`,
  () => fetchPost(slug)
)

// SEO meta tags
useHead(() => {
  if (!post.value) return {}

  const url = `${config.public.siteUrl}/blog/${post.value.slug}`
  const title = `${post.value.title} | Old Man's Words`
  const description = post.value.description || post.value.title

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: post.value.title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'article:published_time', content: post.value.date },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: post.value.title },
      { name: 'twitter:description', content: description },
    ],
    link: [
      { rel: 'canonical', href: url }
    ]
  }
})

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="post-page">
    <!-- Loading state -->
    <div v-if="pending" class="post-loading">
      <p>Loading post...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="post-error">
      <h1>Post Not Found</h1>
      <p>The post you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/" class="back-link">← Back to posts</NuxtLink>
      <details>
        <summary>Error details</summary>
        <pre>{{ error }}</pre>
      </details>
    </div>

    <!-- Post content -->
    <article v-else-if="post" class="post">
      <header class="post-header">
        <NuxtLink to="/" class="back-link">← Back to posts</NuxtLink>

        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-meta">
          <time :datetime="post.date" class="post-date">
            {{ formatDate(post.date) }}
          </time>

          <div v-if="post.tags.length > 0" class="post-tags">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="post-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <p v-if="post.description" class="post-description">
          {{ post.description }}
        </p>
      </header>

      <BlogPostContent
        v-if="post.content"
        :html="post.content"
      />

      <div v-else class="post-no-content">
        <p>This post has no content yet.</p>
      </div>

      <footer class="post-footer">
        <div class="post-boilerplate">
          <img src="/images/oldmannotext.png" alt="Old Man" class="boilerplate-image" />
          <p class="boilerplate-text">These are an old man's words. I wouldn't take them too seriously, but what do I know.</p>
        </div>
        <NuxtLink to="/" class="back-link">← Back to posts</NuxtLink>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.post-page {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* States */
.post-loading,
.post-error {
  text-align: center;
  padding: 4rem 1rem;
}

.post-error {
  color: var(--color-accent-alt);
}

.post-error h1 {
  margin-bottom: 1rem;
  color: var(--color-text);
}

.post-error p {
  color: var(--color-text-muted);
}

.post-error details {
  margin-top: 2rem;
  text-align: left;
}

.post-error summary {
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.post-error pre {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  color: var(--color-text);
}

/* Post */
.post {
  padding-bottom: 4rem;
}

.post-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.back-link {
  display: inline-block;
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-accent-alt);
  text-decoration: none;
}

.post-title {
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: var(--color-text);
  line-height: 1.2;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.post-date {
  font-weight: 500;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-tag {
  background: rgba(108, 99, 255, 0.15);
  color: var(--color-accent);
  border: 1px solid rgba(108, 99, 255, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.post-description {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.post-no-content {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--color-text-muted);
}

.post-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.post-boilerplate {
  text-align: center;
  margin-bottom: 3rem;
}

.boilerplate-image {
  max-width: 200px;
  height: auto;
  margin: 0 auto 1.5rem;
  opacity: 0.9;
}

.boilerplate-text {
  color: var(--color-text-muted);
  font-style: italic;
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .post-description {
    font-size: 1.125rem;
  }
}
</style>
