<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

definePageMeta({ layout: false })

const route = useRoute()
const slug = route.params.slug as string
const config = useRuntimeConfig()

const { fetchPost } = usePosts()

const { data: post, error, pending } = await useAsyncData<BlogPost>(
  `story-${slug}`,
  () => fetchPost(slug)
)

// SEO meta tags
useHead(() => {
  if (!post.value) return {}

  const url = `${config.public.siteUrl}/story/${post.value.slug}`
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// IntersectionObserver for scroll-reveal fade-in
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.15 }
  )

  const elements = document.querySelectorAll('.story-reveal')
  for (const el of elements) {
    observer.observe(el)
  }
})
</script>

<template>
  <div class="story-page">
    <!-- Fixed nav bar -->
    <nav class="story-nav">
      <NuxtLink to="/" class="story-nav-link">Old Man's Words</NuxtLink>
      <NuxtLink to="/" class="story-nav-back">Back to blog</NuxtLink>
    </nav>

    <!-- Loading -->
    <div v-if="pending" class="story-loading">
      <p>Loading story...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="story-error">
      <h1>Story Not Found</h1>
      <p>The story you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/" class="story-back-link">&larr; Back to blog</NuxtLink>
    </div>

    <!-- Story content -->
    <template v-else-if="post && post.sections">
      <!-- Title hero -->
      <header class="story-hero">
        <h1 class="story-title">{{ post.title }}</h1>
        <div class="story-meta">
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          <span v-for="tag in post.tags" :key="tag" class="story-tag">{{ tag }}</span>
        </div>
        <p v-if="post.description" class="story-description">{{ post.description }}</p>
      </header>

      <!-- Sections -->
      <template v-for="(section, i) in post.sections" :key="i">
        <!-- Parallax image section -->
        <div
          v-if="section.type === 'parallax'"
          class="story-parallax"
          :class="{ 'story-parallax-mobile': true }"
        >
          <!-- Desktop: CSS background with fixed attachment -->
          <div
            class="story-parallax-bg"
            :style="{ backgroundImage: `url(${section.imageSrc})` }"
            role="img"
            :aria-label="section.imageAlt || 'Story image'"
          >
            <div class="story-parallax-overlay" />
          </div>
          <!-- Mobile: <img> element for better support -->
          <img
            :src="section.imageSrc"
            :alt="section.imageAlt || 'Story image'"
            class="story-parallax-img"
            loading="lazy"
          />
        </div>

        <!-- Text section -->
        <div
          v-else-if="section.type === 'text'"
          class="story-text story-reveal"
          :class="{ 'story-text-over-image': i > 0 && post.sections[i - 1]?.type === 'parallax' }"
          v-html="section.html"
        />
      </template>

      <!-- Footer -->
      <footer class="story-footer">
        <NuxtLink to="/" class="story-back-link">&larr; Back to blog</NuxtLink>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.story-page {
  background: var(--color-bg, #0a0a0f);
  color: var(--color-text, #e8e8ed);
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

/* Fixed nav */
.story-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.story-nav-link {
  color: var(--color-text, #e8e8ed);
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
}

.story-nav-back {
  color: var(--color-accent, #6c63ff);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.story-nav-back:hover {
  color: var(--color-accent-alt, #ff6b6b);
  text-decoration: none;
}

/* Loading / Error */
.story-loading,
.story-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.story-error h1 {
  margin-bottom: 1rem;
}

.story-back-link {
  color: var(--color-accent, #6c63ff);
  text-decoration: none;
  font-weight: 500;
}

.story-back-link:hover {
  color: var(--color-accent-alt, #ff6b6b);
  text-decoration: none;
}

/* Title hero */
.story-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 6rem 2rem 4rem;
  text-align: center;
}

.story-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  max-width: 800px;
}

.story-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 0.875rem;
  color: var(--color-text-muted, #8888a0);
  margin-bottom: 1.5rem;
}

.story-tag {
  background: rgba(108, 99, 255, 0.15);
  color: var(--color-accent, #6c63ff);
  border: 1px solid rgba(108, 99, 255, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.story-description {
  font-size: 1.25rem;
  color: var(--color-text-muted, #8888a0);
  max-width: 600px;
  line-height: 1.6;
}

/* Parallax section */
.story-parallax {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* Desktop: CSS background with fixed attachment */
.story-parallax-bg {
  position: absolute;
  inset: 0;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.story-parallax-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 15, 0.35);
  z-index: 1;
}

/* Mobile: <img> element (hidden on desktop) */
.story-parallax-img {
  display: none;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Text section */
.story-text {
  max-width: 720px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

/* Text overlaying a parallax image */
.story-text-over-image {
  position: relative;
  z-index: 1;
  margin-top: -20vh;
  padding-top: 6rem;
  padding-bottom: 6rem;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(10, 10, 15, 0.8) 8%,
    rgba(10, 10, 15, 0.95) 15%,
    var(--color-bg, #0a0a0f) 25%
  );
}

/* Scroll-reveal animation */
.story-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.story-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Prose styling within story text sections */
.story-text :deep(p) {
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  line-height: 1.8;
}

.story-text :deep(h1),
.story-text :deep(h2),
.story-text :deep(h3) {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.story-text :deep(blockquote) {
  border-left: 4px solid var(--color-accent, #6c63ff);
  padding-left: 1rem;
  margin: 2rem 0;
  color: var(--color-text-muted, #8888a0);
  font-style: italic;
}

.story-text :deep(a) {
  color: var(--color-accent, #6c63ff);
}

.story-text :deep(a:hover) {
  color: var(--color-accent-alt, #ff6b6b);
}

.story-text :deep(img) {
  max-width: 100%;
  border-radius: 8px;
}

/* Footer */
.story-footer {
  text-align: center;
  padding: 4rem 2rem 6rem;
  border-top: 1px solid var(--color-border, #2a2a40);
}

/* Mobile: use <img> instead of fixed background */
@media (max-width: 768px) {
  .story-parallax {
    min-height: 70vh;
  }

  /* Hide CSS background on mobile */
  .story-parallax-bg {
    display: none;
  }

  /* Show <img> on mobile */
  .story-parallax-img {
    display: block;
  }

  /* Overlay stays above the image */
  .story-parallax-overlay {
    z-index: 1;
  }

  .story-text {
    padding: 3rem 1.5rem;
  }

  .story-text-over-image {
    margin-top: -15vh;
    padding-top: 4rem;
    padding-bottom: 4rem;
    z-index: 2;
  }

  .story-hero {
    min-height: 80vh;
    padding: 5rem 1.5rem 3rem;
  }

  .story-nav {
    padding: 0.75rem 1rem;
  }
}
</style>
