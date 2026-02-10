<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl
</script>

<template>
  <div class="layout">
    <header class="site-header">
      <div class="container">
        <NuxtLink to="/" class="site-title">Old Man's Words</NuxtLink>
      </div>
    </header>

    <main class="site-main">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Old Man's Words. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 10, 15, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  padding: 0.75rem 0;
}

.site-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--color-text);
}

.site-title:hover {
  text-decoration: none;
  color: var(--color-link);
}

.site-main {
  flex: 1;
  padding-top: calc(3.5rem + var(--spacing-xl));
  padding-bottom: var(--spacing-xl);
}

.site-footer {
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-lg) 0;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
</style>
