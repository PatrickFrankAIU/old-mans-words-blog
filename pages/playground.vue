<script setup lang="ts">
definePageMeta({ layout: false })

const revealElements = ref<HTMLElement[]>([])

function setRevealRef(el: any) {
  if (el) revealElements.value.push(el)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )

  revealElements.value.forEach((el) => observer.observe(el))

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div class="pg">
    <!-- Nav -->
    <nav class="pg-nav">
      <NuxtLink to="/" class="pg-nav-back">&larr; Back to Blog</NuxtLink>
      <span class="pg-nav-label">Design Playground</span>
    </nav>

    <!-- Hero -->
    <section class="pg-hero">
      <div class="pg-hero-overlay" />
      <div class="pg-hero-content">
        <h1 class="pg-hero-title">Design Playground</h1>
        <p class="pg-hero-subtitle">Typography, layout, and scroll experiments</p>
        <div class="pg-scroll-cue" aria-hidden="true">&#8595;</div>
      </div>
    </section>

    <!-- Typography -->
    <section class="pg-section pg-typo">
      <div class="pg-inner">
        <h2 :ref="setRevealRef" class="pg-reveal">Typography</h2>

        <div :ref="setRevealRef" class="pg-reveal">
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
        </div>

        <p :ref="setRevealRef" class="pg-reveal">
          This is a paragraph of body text. It demonstrates the base reading
          experience for longer-form content. Good typography creates a
          comfortable reading rhythm with appropriate line height and measure.
        </p>

        <p :ref="setRevealRef" class="pg-reveal">
          Text can be <strong>bold</strong>, <em>italic</em>,
          <code>inline code</code>, or a
          <a href="#" @click.prevent>hyperlink</a>.
        </p>

        <blockquote :ref="setRevealRef" class="pg-reveal">
          <p>
            "Design is not just what it looks like and feels like. Design is
            how it works." &mdash; Steve Jobs
          </p>
        </blockquote>

        <pre :ref="setRevealRef" class="pg-reveal"><code>function greet(name: string): string {
  return `Hello, ${name}!`
}

console.log(greet('World'))</code></pre>
      </div>
    </section>

    <!-- Full-bleed image -->
    <section class="pg-full-bleed">
      <img
        src="https://picsum.photos/1600/900?random=2"
        alt="Full-bleed landscape"
        loading="lazy"
      />
    </section>

    <!-- Split layout -->
    <section class="pg-section pg-split">
      <div :ref="setRevealRef" class="pg-split-text pg-reveal">
        <h2>Split Layout</h2>
        <p>
          A two-column grid that pairs text with imagery. On desktop the
          columns sit side by side; on mobile they stack vertically for a
          comfortable reading experience.
        </p>
        <p>
          This pattern works well for feature highlights, about sections, and
          any content that benefits from visual pairing.
        </p>
      </div>
      <div :ref="setRevealRef" class="pg-split-image pg-reveal">
        <img
          src="https://picsum.photos/800/600?random=3"
          alt="Split layout image"
          loading="lazy"
        />
      </div>
    </section>

    <!-- Scroll-snap panels -->
    <section class="pg-snap-wrapper">
      <div class="pg-snap-container">
        <div class="pg-snap-panel pg-snap-panel--1">
          <h2>Panel One</h2>
          <p>Scroll-snap with <code>mandatory</code> alignment</p>
        </div>
        <div class="pg-snap-panel pg-snap-panel--2">
          <h2>Panel Two</h2>
          <p>Each panel locks into view as you scroll</p>
        </div>
        <div class="pg-snap-panel pg-snap-panel--3">
          <h2>Panel Three</h2>
          <p>Pure CSS — no JavaScript required</p>
        </div>
      </div>
    </section>

    <!-- Sticky reveal -->
    <section class="pg-section pg-sticky">
      <div class="pg-sticky-text">
        <h2>Sticky Reveal</h2>
        <p>
          This text stays pinned while the cards on the right scroll past.
          A great pattern for storytelling and step-by-step explanations.
        </p>
      </div>
      <div class="pg-sticky-cards">
        <div
          v-for="i in 4"
          :key="i"
          :ref="setRevealRef"
          class="pg-card pg-reveal"
        >
          <h3>Card {{ i }}</h3>
          <p>
            This card scrolls independently of the sticky text column.
            Content flows naturally while the context remains visible.
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="pg-footer">
      <NuxtLink to="/">&larr; Back to Blog</NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
/* ── Theme tokens (scoped to .pg) ── */
.pg {
  --pg-bg: #0a0a0f;
  --pg-text: #e8e8ed;
  --pg-bg-elevated: #141420;
  --pg-bg-card: #1a1a2e;
  --pg-text-muted: #8888a0;
  --pg-accent: #6c63ff;
  --pg-accent-alt: #ff6b6b;
  --pg-border: #2a2a40;

  background: var(--pg-bg);
  color: var(--pg-text);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
}

/* ── Scroll-reveal animation ── */
.pg-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.pg-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ── Nav ── */
.pg-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: rgba(10, 10, 15, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--pg-border);
}

.pg-nav-back {
  color: var(--pg-accent);
  text-decoration: none;
  font-weight: 500;
}

.pg-nav-back:hover {
  color: var(--pg-accent-alt);
  text-decoration: underline;
}

.pg-nav-label {
  color: var(--pg-text-muted);
  font-size: 0.85rem;
}

/* ── Hero ── */
.pg-hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('https://picsum.photos/1920/1080?random=1') center/cover no-repeat;
  background-attachment: fixed;
}

.pg-hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 15, 0.65);
}

.pg-hero-content {
  position: relative;
  text-align: center;
  padding: 0 1.5rem;
}

.pg-hero-title {
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent-alt));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.pg-hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--pg-text-muted);
}

.pg-scroll-cue {
  margin-top: 2rem;
  font-size: 1.5rem;
  color: var(--pg-text-muted);
  animation: pg-bounce 2s infinite;
}

@keyframes pg-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

/* ── Section spacing ── */
.pg-section {
  padding: 5rem 1.5rem;
}

/* ── Inner container (720px) ── */
.pg-inner {
  max-width: 720px;
  margin: 0 auto;
}

/* ── Typography overrides (dark theme) ── */
.pg-typo h1,
.pg-typo h2,
.pg-typo h3,
.pg-typo h4,
.pg-typo h5,
.pg-typo h6 {
  color: var(--pg-text);
  margin-bottom: 0.75rem;
}

.pg-typo h1 { font-size: 2.5rem; }
.pg-typo h2 { font-size: 2rem; }
.pg-typo h3 { font-size: 1.75rem; }
.pg-typo h4 { font-size: 1.5rem; }
.pg-typo h5 { font-size: 1.25rem; }
.pg-typo h6 { font-size: 1.1rem; }

.pg-typo p {
  color: var(--pg-text);
  margin-bottom: 1rem;
}

.pg-typo a {
  color: var(--pg-accent);
}

.pg-typo a:hover {
  color: var(--pg-accent-alt);
}

.pg-typo strong {
  font-weight: 700;
}

.pg-typo code {
  background: var(--pg-bg-card);
  color: var(--pg-accent-alt);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.pg-typo blockquote {
  border-left: 4px solid var(--pg-accent);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: var(--pg-text-muted);
  font-style: italic;
}

.pg-typo pre {
  background: var(--pg-bg-card);
  border: 1px solid var(--pg-border);
  border-radius: 8px;
  padding: 1.25rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.pg-typo pre code {
  background: none;
  color: var(--pg-text);
  padding: 0;
}

/* ── Full-bleed image ── */
.pg-full-bleed {
  height: 70vh;
  overflow: hidden;
}

.pg-full-bleed img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0;
}

/* ── Split layout ── */
.pg-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.pg-split-text h2 {
  color: var(--pg-text);
  margin-bottom: 1rem;
}

.pg-split-text p {
  color: var(--pg-text-muted);
  margin-bottom: 0.75rem;
}

.pg-split-image img {
  border-radius: 12px;
  width: 100%;
  margin: 0;
}

/* ── Scroll-snap panels ── */
.pg-snap-wrapper {
  height: 100vh;
  overflow: hidden;
}

.pg-snap-container {
  height: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.pg-snap-panel {
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.pg-snap-panel h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 0.75rem;
}

.pg-snap-panel p {
  font-size: 1.15rem;
  color: var(--pg-text-muted);
}

.pg-snap-panel code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.pg-snap-panel--1 {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}

.pg-snap-panel--2 {
  background: linear-gradient(135deg, #0f3460, #1a1a2e);
}

.pg-snap-panel--3 {
  background: linear-gradient(135deg, #1a1a2e, #2a1a3e);
}

/* ── Sticky reveal ── */
.pg-sticky {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pg-sticky-text {
  position: sticky;
  top: 5rem;
  align-self: start;
}

.pg-sticky-text h2 {
  color: var(--pg-text);
  margin-bottom: 1rem;
}

.pg-sticky-text p {
  color: var(--pg-text-muted);
}

.pg-sticky-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pg-card {
  background: var(--pg-bg-card);
  border: 1px solid var(--pg-border);
  border-radius: 12px;
  padding: 2rem;
}

.pg-card h3 {
  color: var(--pg-accent);
  margin-bottom: 0.5rem;
}

.pg-card p {
  color: var(--pg-text-muted);
  margin-bottom: 0;
}

/* ── Footer ── */
.pg-footer {
  padding: 3rem 1.5rem;
  text-align: center;
  border-top: 1px solid var(--pg-border);
  color: var(--pg-text-muted);
}

.pg-footer a {
  color: var(--pg-accent);
  text-decoration: none;
}

.pg-footer a:hover {
  color: var(--pg-accent-alt);
  text-decoration: underline;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .pg-split {
    grid-template-columns: 1fr;
  }

  .pg-sticky {
    grid-template-columns: 1fr;
  }

  .pg-sticky-text {
    position: static;
  }

  .pg-hero {
    background-attachment: scroll;
  }
}
</style>
