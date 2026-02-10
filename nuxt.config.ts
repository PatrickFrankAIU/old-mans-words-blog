// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // Enable SSG
  ssr: true,

  devtools: { enabled: true },

  // Runtime config for environment variables
  runtimeConfig: {
    // Server-only env vars (never exposed to client)
    notionApiKey: process.env.NOTION_API_KEY,
    notionDatabaseId: process.env.NOTION_DATABASE_ID,

    // Public env vars (exposed to client)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  // TypeScript config
  typescript: {
    strict: true,
    typeCheck: false, // Disabled during dev for faster startup
  },

  // CSS
  css: ['~/assets/css/main.css'],
})
