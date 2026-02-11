<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

defineProps<{
  post: BlogPost
}>()

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
  <article :class="['post-card', { 'has-hero': post.cardImage }]">
    <NuxtLink :to="post.layout === 'story' ? `/story/${post.slug}` : `/blog/${post.slug}`" class="post-card-link">
      <div v-if="post.cardImage" class="post-card-hero">
        <img :src="post.cardImage" :alt="post.title" loading="lazy" />
        <h2 class="post-card-hero-title">{{ post.title }}</h2>
      </div>

      <div class="post-card-body">
        <h2 v-if="!post.cardImage" class="post-card-title">{{ post.title }}</h2>

        <div class="post-card-meta">
          <time :datetime="post.date" class="post-card-date">
            {{ formatDate(post.date) }}
          </time>

          <div v-if="post.tags.length > 0" class="post-card-tags">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="post-card-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <p v-if="post.description" class="post-card-description">
          {{ post.description }}
        </p>

        <span class="post-card-read-more">Read more →</span>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.post-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.post-card:not(.has-hero) {
  padding: 2rem;
}

.post-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-accent);
  box-shadow: 0 8px 24px rgba(108, 99, 255, 0.15);
}

.post-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* Hero image area */
.post-card-hero {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.post-card-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.post-card-hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to bottom, transparent, var(--color-bg-card));
  pointer-events: none;
}

.post-card-hero-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 1.25rem 0.5rem;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  z-index: 1;
}

/* Card body (text content below hero or full card when no hero) */
.post-card-body {
  padding: 1.25rem;
}

.post-card:not(.has-hero) .post-card-body {
  padding: 0;
}

.post-card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: var(--color-text);
  line-height: 1.3;
}

.post-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.post-card-date {
  font-weight: 500;
}

.post-card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-card-tag {
  background: rgba(108, 99, 255, 0.15);
  color: var(--color-accent);
  border: 1px solid rgba(108, 99, 255, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.post-card-description {
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0 0 0.75rem 0;
}

.post-card-read-more {
  color: var(--color-accent);
  font-weight: 600;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.post-card:hover .post-card-read-more {
  color: var(--color-accent-alt);
}
</style>
