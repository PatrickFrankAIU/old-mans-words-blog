# Nuxt Static Blog

A statically generated blog built with Nuxt 3, using Notion as a headless CMS.

## Prerequisites

- Node.js 18+
- A Notion account with an integration token
- A Notion database set up for blog posts (see [Notion Setup](#notion-setup))

## Notion Setup

1. Create a [Notion integration](https://www.notion.so/my-integrations) and copy the API key.
2. Create a Notion database with these properties:

   | Property    | Type         | Required |
   |-------------|--------------|----------|
   | Title       | title        | Yes      |
   | Slug        | rich_text    | No       |
   | Published   | checkbox     | Yes      |
   | Date        | date         | No       |
   | Tags        | multi_select | No       |
   | Description | rich_text    | No       |

3. Share the database with your integration (click "..." → "Connections" → add your integration).
4. Copy the database ID from the database URL:
   `https://notion.so/{workspace}/{DATABASE_ID}?v=...`

## Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable             | Description                  |
|----------------------|------------------------------|
| NOTION_API_KEY       | Notion integration token     |
| NOTION_DATABASE_ID   | Notion database ID           |
| NUXT_PUBLIC_SITE_URL | Your site's canonical URL    |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The dev server runs at `http://localhost:3000`. In development, content is fetched live from Notion on each request.

## Build & Preview

```bash
# Generate static site
npm run generate

# Preview the generated site locally
npm run preview
```

`npm run generate` produces a fully static site in `.output/public/`. Images from Notion are downloaded during this step.

## Deployment

The site deploys to Vercel via GitHub integration:

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Set environment variables in Vercel's project settings.
4. Vercel runs `npm run generate` on each push to `main`.

### Triggering Rebuilds

Since content lives in Notion, new posts require a rebuild. Options:

- Push a commit to trigger Vercel's build.
- Use a Vercel Deploy Hook (webhook URL that triggers a build).
- Automate via Notion's webhook/automation features or a cron job.

## Project Structure

See [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) for the full architectural overview.

```
pages/index.vue           → Post list (home page)
pages/blog/[slug].vue     → Individual post
server/api/posts.get.ts   → API: list posts
server/api/posts/[slug].get.ts → API: single post
server/utils/notion.ts    → Notion client
server/utils/transform.ts → Notion blocks → HTML
```

## Tech Stack

- [Nuxt 3](https://nuxt.com/) — Vue framework with SSG
- [Notion API](https://developers.notion.com/) — Headless CMS
- [Vercel](https://vercel.com/) — Static hosting
- TypeScript — Type safety
