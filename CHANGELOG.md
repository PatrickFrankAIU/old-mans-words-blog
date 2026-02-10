# CHANGELOG.md

## 2026-02-09 — Project Architecture Defined

- Established project goals: Nuxt 3 SSG blog with Notion CMS, deployed to Vercel.
- Designed folder structure with clear separation: server routes for data fetching, utils for Notion client and block transformation, pages for routing, components for UI.
- Defined Notion database schema: Title, Slug, Published, Date, Tags, Description.
- Chose custom block-to-HTML transformer over third-party libraries for minimal dependencies and full control.
- Decided to download Notion images at build time to avoid signed URL expiry.
- Created foundational documentation: PROJECT_CONTEXT.md, README.md, DEV_NOTES.md, CHANGELOG.md, CLAUDE.md.
- Outlined six-phase implementation plan: Scaffold → Notion Integration → Content Transform → Pages & UI → SEO & Meta → Deploy.

## 2026-02-09 — Phase 1: Scaffold Complete

- Initialized Nuxt 3 project with TypeScript support.
- Created `nuxt.config.ts` with SSG enabled and runtime config for environment variables.
- Set up folder structure: `assets/css/`, `components/`, `layouts/`, `pages/`, `server/`, `types/`, `public/images/blog/`.
- Created base layout (`layouts/default.vue`) with header and footer.
- Added global CSS (`assets/css/main.css`) with CSS variables and basic styling.
- Created placeholder pages: `pages/index.vue` (post list), `pages/blog/[slug].vue` (single post).
- Installed dependencies including `@notionhq/client` for Notion API integration.
- Added `.gitignore` and `.env.example`.

## 2026-02-09 — Phase 2: Notion Integration Complete

- Created `server/utils/notion.ts` with Notion client singleton and database ID helper.
- Defined TypeScript interfaces in `types/blog.ts`: `BlogPost`, `NotionPageProperties`, `NotionError`.
- Implemented `server/api/posts.get.ts` to fetch all published posts from Notion database.
- Implemented `server/api/posts/[slug].get.ts` to fetch single post by slug with content blocks.
- Created `server/utils/slugify.ts` for URL-friendly slug generation with auto-fallback from title.
- Added comprehensive error handling and validation in API routes.
- Configured environment variables in `nuxt.config.ts` via `runtimeConfig`.
- Verified Notion API connection and database access (2 test posts fetched successfully).

## 2026-02-10 — Phase 3: Content Transform Complete

- Created `server/utils/transform.ts` with block-to-HTML transformer.
- Implemented support for core block types: paragraph, headings (h1-h3), bulleted/numbered lists, code, quote, divider, callout, image.
- Added rich text formatting: bold, italic, strikethrough, underline, inline code, links.
- Implemented image download logic with MD5 hash-based caching to `/public/images/blog/`.
- Added HTML sanitization and entity escaping for security.
- Implemented automatic list grouping (consecutive list items wrapped in `<ul>`/`<ol>` tags).
- Updated `server/api/posts/[slug].get.ts` to transform Notion blocks to HTML instead of returning raw JSON.
- Tested transformer with existing Notion posts - working correctly.

## 2026-02-10 — Scrollytelling Story Layout

- Added NYT-style scrollytelling layout for narrative posts via `/story/[slug]` route.
- New Notion `Layout` select property (`standard` / `story`) controls which route renders a post.
- Added `transformBlocksToSections()` in `transform.ts` — splits blocks into text and parallax sections at image boundaries.
- Created `pages/story/[slug].vue` with full-viewport parallax images, dark overlay text, IntersectionObserver fade-in, fixed nav bar, and mobile fallback.
- Updated `PostCard.vue` to route to `/story/` or `/blog/` based on post layout.
- Added `ContentSection` interface and `layout` field to `BlogPost` type.
- Updated `posts/[slug].get.ts` to return sections array for story layout posts.

## 2026-02-10 — Phase 4: Pages & UI Complete

- Created `composables/usePosts.ts` for fetching posts from API routes.
- Built `components/blog/PostCard.vue` for displaying post previews with title, date, description, tags, and "Read more" link.
- Built `components/blog/PostContent.vue` for rendering transformed HTML content with comprehensive styling.
- Updated `pages/index.vue` to fetch and display all published posts with loading, error, and empty states.
- Updated `pages/blog/[slug].vue` to fetch and display single post with full content, metadata, and navigation.
- Added responsive CSS styling for post list and post detail layouts.
- Implemented proper date formatting, tag display, and typography styles.
- Tested complete flow: homepage → post list → individual post - all working correctly.
