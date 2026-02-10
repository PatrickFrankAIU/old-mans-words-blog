<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const { fetchPosts } = usePosts()
const config = useRuntimeConfig()

// Fetch posts on page load
const { data: posts, error, pending } = await useAsyncData<BlogPost[]>(
  'posts',
  () => fetchPosts()
)

// SEO meta tags
useHead({
  title: "Old Man's Words",
  meta: [
    { name: 'description', content: 'Thoughts, stories, and ideas' },
    { property: 'og:title', content: "Old Man's Words" },
    { property: 'og:description', content: 'Thoughts, stories, and ideas' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: config.public.siteUrl },
    { property: 'og:image', content: `${config.public.siteUrl}/images/oldmanlogo.png` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: "Old Man's Words" },
    { name: 'twitter:description', content: 'Thoughts, stories, and ideas' },
    { name: 'twitter:image', content: `${config.public.siteUrl}/images/oldmanlogo.png` },
  ],
  link: [
    { rel: 'canonical', href: config.public.siteUrl }
  ]
})
</script>

<template>
  <div class="posts-page">
    <!-- Hero -->
    <header class="hero">
      <img src="/images/oldmanlogo.png" alt="Old Man's Words" class="hero-logo" />
      <h1 class="hero-title">Old Man's Words</h1>
      <p class="hero-subtitle">Thoughts, stories, and ideas</p>
    </header>

    <!-- Loading state -->
    <div v-if="pending" class="posts-loading">
      <p>Loading posts...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="posts-error">
      <p>Failed to load posts. Please try again later.</p>
      <details>
        <summary>Error details</summary>
        <pre>{{ error }}</pre>
      </details>
    </div>

    <!-- Empty state -->
    <div v-else-if="!posts || posts.length === 0" class="posts-empty">
      <p>No posts found. Check back soon!</p>
    </div>

    <!-- Posts grid -->
    <div v-else class="posts-grid">
      <BlogPostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>

<style scoped>
.posts-page {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Hero */
.hero {
  text-align: center;
  padding: 4rem 1rem 3rem;
  margin-bottom: 3rem;
}

.hero-logo {
  max-width: 300px;
  height: auto;
  margin: 0 auto 2rem;
  display: block;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-alt));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted);
  margin: 0;
}

/* Posts grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

/* States */
.posts-loading,
.posts-error,
.posts-empty {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--color-text-muted);
  grid-column: 1 / -1;
}

.posts-error {
  color: var(--color-accent-alt);
}

.posts-error details {
  margin-top: 1rem;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.posts-error summary {
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.posts-error pre {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  color: var(--color-text);
}

/* Responsive */
@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
