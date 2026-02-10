# PROJECT_CONTEXT.md

> High-level architectural summary for AI assistants. Read this first.

## Goals

Build a statically generated blog using Nuxt 3, with Notion as a headless CMS. Prioritize simplicity, maintainability, and clear separation of concerns.

- **Framework**: Nuxt 3 with SSG (`nuxt generate`)
- **Language**: Vue 3 + TypeScript (Composition API, `<script setup>`)
- **CMS**: Notion (database + page blocks)
- **Hosting**: Vercel (static deployment via GitHub integration)

## Architecture

```
Notion Database
      │
      ▼
Server API Routes (server/api/)     ← called at build time by Nuxt SSG
      │
      ├─ notion.ts (client)          ← server/utils/notion.ts
      ├─ transform.ts (blocks→HTML)  ← server/utils/transform.ts
      │
      ▼
Static HTML Pages                    ← output of `nuxt generate`
      │
      ▼
Vercel CDN
```

### Data flow

1. `nuxt generate` triggers page rendering.
2. Pages call server API routes (`/api/posts`, `/api/posts/:slug`).
3. Server routes use the Notion client to query the database and fetch page blocks.
4. `transform.ts` converts Notion block JSON into HTML strings.
5. Images are downloaded to `public/images/blog/` during transform.
6. Images are cached and only re-downloaded when missing or changed (change detection based on file existence and URL hash or timestamp).
7. The result is pre-rendered into static HTML files.

## Build & Deployment Model

The site is fully statically generated. All content changes require a rebuild and redeploy via Vercel. There is no runtime dependency on Notion after deployment.

## Folder Structure

```
nuxt-test/
├── assets/css/               # Global styles
├── components/
│   ├── blog/                 # PostCard, PostContent
│   └── layout/               # SiteHeader, SiteFooter
├── composables/              # usePosts.ts
├── layouts/                  # default.vue
├── pages/
│   ├── index.vue             # Post list
│   └── blog/[slug].vue       # Single post
├── server/
│   ├── api/
│   │   ├── posts.get.ts      # List posts
│   │   └── posts/[slug].get.ts  # Single post
│   └── utils/
│       ├── notion.ts         # Notion client setup
│       └── transform.ts      # Block-to-HTML + image download
├── types/blog.ts             # Shared TypeScript interfaces
├── public/                   # Static assets, downloaded images
├── .env.example              # Environment variable template
└── nuxt.config.ts            # Nuxt configuration (SSG, runtime config)
```

## Notion Database Schema

| Property    | Type          | Required | Notes                                    |
|-------------|---------------|----------|------------------------------------------|
| Title       | title         | Yes      | Built-in Notion title column             |
| Slug        | rich_text     | No       | URL slug; auto-generated from title if empty |
| Published   | checkbox      | Yes      | Only true posts are fetched              |
| Date        | date          | No       | Publication date; falls back to created_time |
| Tags        | multi_select  | No       | Flat taxonomy                            |
| Description | rich_text     | No       | Excerpt / SEO meta description           |

Page body content = Notion blocks within the page (fetched via Blocks API).

## Key Conventions

- **Composition API only** — all components use `<script setup lang="ts">`.
- **Server routes as data layer** — no direct Notion calls from components.
- **Transform is server-only** — `transform.ts` runs at build time, never in the browser.
- **Env vars via `runtimeConfig`** — secrets in `runtimeConfig` (server-only), public values in `runtimeConfig.public`.
- **Slug generation** — `slugify(title)` as fallback when Slug property is empty. Kebab-case, lowercase, ASCII-only. Slugs are immutable once published.
- **Images downloaded at build time** — Notion's signed URLs expire; images are saved to `public/images/blog/` during transform.
- **Build-time validation** — build failures should surface clearly if Notion data is invalid or missing.
- **No persistent cache** — Notion data is fetched fresh during each build. No persistent caching layer is used initially.

## Environment Variables

| Variable              | Purpose                       | Where Used    |
|-----------------------|-------------------------------|---------------|
| NOTION_API_KEY        | Notion integration token      | Server only   |
| NOTION_DATABASE_ID    | Notion database ID            | Server only   |
| NUXT_PUBLIC_SITE_URL  | Canonical site URL for SEO    | Public        |

## Assumptions

- One Notion database contains all blog posts.
- The Notion integration has read access to the database.
- Posts are the only content type (no pages, portfolios, etc.).
- No authentication or user accounts on the blog.
- No comments system (can be added later).
- No i18n — single language.

## Future Extension Points

- Comments system (e.g., Giscus via GitHub Discussions)
- Additional content types beyond blog posts (pages, portfolios)
- Search (e.g., client-side via pre-built JSON index with Fuse.js)
- RSS feed (server route that outputs XML)
