# DEV_NOTES.md

Running log of architectural decisions, tradeoffs, and future considerations.

---

## 2026-02-09 — Initial Architecture

### Decision: Custom block-to-HTML transformer over third-party libraries

**Context**: Need to render Notion page content (blocks) as HTML in the static blog.

**Options considered**:
1. Custom transformer (`server/utils/transform.ts`) — manually map each block type to HTML.
2. `notion-to-md` library — converts blocks to Markdown, then render Markdown to HTML.
3. `@notion-render/client` — purpose-built Notion renderer.

**Chosen**: Option 1 (custom transformer).

**Rationale**: Notion blocks are well-structured JSON. The common block types (paragraph, headings, lists, code, quote, image, divider, callout) can be handled in ~150 lines. This avoids two extra dependencies, prevents lossy conversion through a Markdown intermediate, and gives full control over HTML output. Aligns with the project's "avoid unnecessary dependencies" constraint.

**Revisit if**: Block type coverage needs grow significantly, or rich embeds (video, bookmark previews) become important.

---

### Decision: Download images at build time

**Context**: Notion-hosted images use signed S3 URLs that expire after ~1 hour. SSG pages are viewed long after build, so expired URLs = broken images.

**Options considered**:
1. Download images to `public/images/blog/` during build — reliable but adds build complexity.
2. Use Notion URLs directly — zero complexity but images break.
3. External image host — reliable but changes the authoring workflow.

**Chosen**: Option 1 (download at build time).

**Rationale**: Reliability is non-negotiable for a static site. The download logic is contained in `transform.ts` and adds modest complexity. Images are saved with content-hash filenames to avoid duplicates across rebuilds.

**Revisit if**: Image volume grows large enough to impact build times or output size. Could add a CDN/proxy at that point.

---

### Decision: Slug as rich_text with auto-fallback

**Context**: Need URL-friendly slugs for blog post routes.

**Options considered**:
1. Notion `rich_text` property — author sets slug manually.
2. Notion formula — auto-generate from title in Notion.
3. Server-side generation only — derive from title, no Notion property.

**Chosen**: Option 1 with server-side fallback.

**Rationale**: Authors can set a custom slug for SEO control. If they leave it blank, the server generates one from the title via `slugify()`. This is the most flexible approach. A Notion formula can't easily handle all edge cases (unicode, special chars), so server-side fallback is more robust.

---

### Decision: Server routes as the data layer

**Context**: Components need blog data. Where should the Notion API calls live?

**Chosen**: Nuxt server routes (`server/api/`).

**Rationale**: Server routes keep the Notion API key server-side, provide a clean API boundary, and work naturally with Nuxt's SSG — during `nuxt generate`, the framework calls these routes and bakes the responses into static HTML. Components never import Notion libraries directly.

---

## Implementation Plan

The project is built in six sequential phases, each with clear deliverables and dependencies.

### Phase 1: Scaffold ✓ COMPLETE
**Goal**: Initialize Nuxt project with base configuration and folder structure.

**Deliverables**:
- Nuxt 3 project initialized with TypeScript
- `nuxt.config.ts` configured for SSG with runtime config
- Folder structure created per architecture spec
- Base layout with header/footer (`layouts/default.vue`)
- Global CSS with CSS variables (`assets/css/main.css`)
- Placeholder pages (`pages/index.vue`, `pages/blog/[slug].vue`)
- Dependencies installed including `@notionhq/client`
- `.gitignore` and `.env.example`

**Dependencies**: None (first phase)

---

### Phase 2: Notion Integration
**Goal**: Set up Notion API client and create server routes for data fetching.

**Deliverables**:
- `server/utils/notion.ts` — Notion client singleton
- `types/blog.ts` — TypeScript interfaces for posts and Notion responses
- `server/api/posts.get.ts` — API route to list published posts
- `server/api/posts/[slug].get.ts` — API route to fetch single post by slug
- Slug generation utility (`slugify()`)
- Basic error handling and validation

**Dependencies**: Phase 1 (scaffold and config must exist)

**Key tasks**:
- Initialize Notion client with API key from runtime config
- Query database with Published=true filter
- Extract and normalize post properties (title, slug, date, tags, description)
- Fetch page blocks for individual posts
- Auto-generate slug from title if Slug property is empty

---

### Phase 3: Content Transform ✓ COMPLETE
**Goal**: Convert Notion blocks to HTML and download images.

**Deliverables**:
- `server/utils/transform.ts` — Block-to-HTML transformer
- Support for core block types: paragraph, headings (h1-h3), bulleted/numbered lists, code, quote, image, divider, callout
- Image download logic with caching (file existence + URL hash check)
- Rich text formatting (bold, italic, code, links)
- Content sanitization and error handling

**Dependencies**: Phase 2 (needs Notion block data)

**Key tasks**:
- Map each Notion block type to corresponding HTML
- Handle rich text annotations (bold, italic, strikethrough, code, links)
- Download images to `public/images/blog/` with hash-based filenames
- Skip re-downloading if image already exists
- Return sanitized HTML strings

---

### Phase 4: Pages & UI ✓ COMPLETE
**Goal**: Build post list and post detail pages with components.

**Deliverables**:
- `pages/index.vue` — Post list page (replaces placeholder)
- `pages/blog/[slug].vue` — Single post page (replaces placeholder)
- `components/blog/PostCard.vue` — Post preview card for list
- `components/blog/PostContent.vue` — Rendered post body
- `composables/usePosts.ts` — Client-side composable for fetching posts
- Basic responsive CSS for blog layout

**Dependencies**: Phase 3 (needs working transform and API routes)

**Key tasks**:
- Fetch posts from `/api/posts` on home page
- Display posts as cards (title, date, description, tags)
- Fetch single post from `/api/posts/:slug` on detail page
- Render post content HTML
- Add loading states and error handling
- Style post list and detail layouts

---

### Phase 5: SEO & Meta
**Goal**: Add SEO-friendly meta tags and sitemap generation.

**Deliverables**:
- `useHead()` calls in pages for dynamic meta tags
- Open Graph and Twitter Card meta tags
- JSON-LD structured data for blog posts
- Sitemap generation (consider `@nuxtjs/sitemap` or custom route)
- Robots.txt

**Dependencies**: Phase 4 (needs working pages)

**Key tasks**:
- Add page titles, descriptions, canonical URLs
- Generate OG image tags (using post descriptions)
- Add structured data for articles (Schema.org)
- Generate sitemap.xml with all post URLs
- Create robots.txt

---

### Phase 6: Deploy
**Goal**: Deploy to Vercel with environment variables and CI/CD.

**Deliverables**:
- GitHub repository created and pushed
- Vercel project connected to GitHub
- Environment variables configured in Vercel
- Successful `nuxt generate` build on Vercel
- Deployed static site accessible via Vercel URL

**Dependencies**: Phase 5 (complete, tested application)

**Key tasks**:
- Push repository to GitHub
- Import project in Vercel dashboard
- Configure env vars: `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NUXT_PUBLIC_SITE_URL`
- Verify build succeeds on Vercel
- Test deployed site
- Document rebuild triggers (manual push, deploy hooks)

---

## Future Considerations

- **RSS feed**: Can be added as a server route that outputs XML. Low priority but straightforward.
- **Tag filtering**: The post list page could filter by tag. Requires either client-side filtering or pre-rendered tag pages.
- **Search**: Static site search via a pre-built JSON index (e.g., Fuse.js). Not needed initially.
- **Comments**: Could integrate Giscus (GitHub Discussions) or similar. Out of scope for v1.
- **Notion webhooks**: Notion doesn't offer reliable webhooks yet. Rebuild triggers will need to be manual or cron-based.
- **Incremental builds**: Nuxt doesn't natively support ISR in static mode. Full rebuilds are the current approach.
