<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const props = defineProps<{
  currentPost: BlogPost
  allPosts: BlogPost[]
}>()

function tagOverlapCount(a: string[], b: string[]): number {
  return a.filter(t => b.includes(t)).length
}

function postUrl(post: BlogPost): string {
  return post.layout === 'story' ? `/story/${post.slug}` : `/blog/${post.slug}`
}

function postLabel(post: BlogPost): string {
  return post.layout === 'story' ? 'Story' : 'Essay'
}

const recommendations = computed<BlogPost[]>(() => {
  const current = props.currentPost
  const candidates = props.allPosts.filter(p => p.slug !== current.slug)

  function bestMatch(type: 'story' | 'essay'): BlogPost | undefined {
    const pool = candidates.filter(p =>
      type === 'story' ? p.layout === 'story' : p.layout !== 'story'
    )
    if (pool.length === 0) return undefined

    // Prefer posts with tag overlap > 0, sorted by overlap count then date
    const withOverlap = pool
      .map(p => ({ post: p, overlap: tagOverlapCount(current.tags, p.tags) }))
      .filter(x => x.overlap > 0)
      .sort((a, b) =>
        b.overlap - a.overlap ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
      )

    if (withOverlap.length > 0) return withOverlap[0].post

    // Fallback: most recent of that type
    return [...pool].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]
  }

  const results: BlogPost[] = []

  if (current.layout === 'story') {
    const story = bestMatch('story')
    if (story) results.push(story)
    if (results.length < 2) {
      const essay = bestMatch('essay')
      if (essay) results.push(essay)
    }
  } else {
    const essay = bestMatch('essay')
    if (essay) results.push(essay)
    if (results.length < 2) {
      const story = bestMatch('story')
      if (story) results.push(story)
    }
  }

  return results
})
</script>

<template>
  <section v-if="recommendations.length > 0" class="read-next">
    <h3 class="read-next-heading">Read Next</h3>
    <div class="read-next-list">
      <NuxtLink
        v-for="rec in recommendations"
        :key="rec.slug"
        :to="postUrl(rec)"
        class="read-next-card"
      >
        <img
          v-if="rec.cardImage"
          :src="rec.cardImage"
          :alt="rec.title"
          class="read-next-thumb"
          loading="lazy"
        />
        <div class="read-next-card-body">
          <span class="read-next-label">{{ postLabel(rec) }}</span>
          <p class="read-next-title">{{ rec.title }}</p>
          <p v-if="rec.description" class="read-next-desc">{{ rec.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.read-next {
  max-width: var(--max-width-content);
  margin: 3rem auto 0;
  padding: 2rem var(--spacing-md) 0;
  border-top: 1px solid var(--color-border);
}

.read-next-heading {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
}

.read-next-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.read-next-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.read-next-card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.12);
  text-decoration: none;
}

.read-next-thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  display: block;
  margin: 0;
}

.read-next-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.read-next-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.read-next-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.read-next-desc {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (min-width: 600px) {
  .read-next-list {
    flex-direction: row;
  }

  .read-next-card {
    flex: 1;
  }
}
</style>
