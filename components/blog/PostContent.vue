<script setup lang="ts">
defineProps<{
  html: string
}>()
</script>

<template>
  <div class="post-content" v-html="html"></div>
</template>

<style scoped>
.post-content {
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--color-text);
}

/* Typography */
.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3) {
  margin: 2rem 0 1rem 0;
  line-height: 1.3;
  font-weight: 700;
}

.post-content :deep(h1) {
  font-size: 2rem;
}

.post-content :deep(h2) {
  font-size: 1.75rem;
}

.post-content :deep(h3) {
  font-size: 1.5rem;
}

.post-content :deep(p) {
  margin: 1rem 0;
}

/* Links */
.post-content :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
}

.post-content :deep(a:hover) {
  text-decoration: none;
}

/* Lists */
.post-content :deep(ul),
.post-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.post-content :deep(li) {
  margin: 0.5rem 0;
}

/* Code */
.post-content :deep(code) {
  background: var(--color-bg-card);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'Courier New', Courier, monospace;
}

.post-content :deep(pre) {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Quotes */
.post-content :deep(blockquote) {
  border-left: 4px solid var(--color-accent);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--color-text-muted);
}

/* Images */
.post-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.post-content :deep(figure) {
  margin: 2rem 0;
}

.post-content :deep(figcaption) {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}

/* Divider */
.post-content :deep(hr) {
  border: none;
  border-top: 2px solid var(--color-border);
  margin: 2rem 0;
}

/* Callout */
.post-content :deep(.callout) {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-accent);
  border-radius: 8px;
  margin: 1.5rem 0;
}

.post-content :deep(.callout-icon) {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.post-content :deep(.callout-text) {
  flex: 1;
}

/* Full-bleed image */
.post-content :deep(.full-bleed-image) {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: 3rem;
  margin-bottom: 3rem;
  height: 70vh;
  overflow: hidden;
}

.post-content :deep(.full-bleed-image img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0;
  border-radius: 0;
}

/* Wide image */
.post-content :deep(.wide-image) {
  margin: 2rem -4rem;
}

.post-content :deep(.wide-image img) {
  width: 100%;
  border-radius: 12px;
}

/* Split layout (columns) */
.post-content :deep(.split-layout) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin: 3rem 0;
  align-items: start;
}

.post-content :deep(.split-column) {
  display: flex;
  flex-direction: column;
}

/* Responsive */
@media (max-width: 768px) {
  .post-content :deep(.wide-image) {
    margin: 2rem 0;
  }

  .post-content :deep(.split-layout) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* Text formatting */
.post-content :deep(strong) {
  font-weight: 700;
}

.post-content :deep(em) {
  font-style: italic;
}

.post-content :deep(s) {
  text-decoration: line-through;
}

.post-content :deep(u) {
  text-decoration: underline;
}
</style>
