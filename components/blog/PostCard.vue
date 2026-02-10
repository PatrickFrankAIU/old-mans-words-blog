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
  <article class="post-card">
    <NuxtLink :to="`/blog/${post.slug}`" class="post-card-link">
      <h2 class="post-card-title">{{ post.title }}</h2>

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
    </NuxtLink>
  </article>
</template>

<style scoped>
.post-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
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
  margin-bottom: 1rem;
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
  margin: 0 0 1rem 0;
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
