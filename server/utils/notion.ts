import { Client } from '@notionhq/client'

/**
 * Notion client singleton
 * Initialized once with API key from runtime config
 */
let notionClient: Client | null = null

export function getNotionClient(): Client {
  if (notionClient) {
    return notionClient
  }

  const config = useRuntimeConfig()

  if (!config.notionApiKey) {
    throw new Error(
      'NOTION_API_KEY is not configured. Please set it in your .env file.'
    )
  }

  notionClient = new Client({
    auth: config.notionApiKey,
  })

  return notionClient
}

/**
 * Get the configured Notion database ID
 */
export function getNotionDatabaseId(): string {
  const config = useRuntimeConfig()

  if (!config.notionDatabaseId) {
    throw new Error(
      'NOTION_DATABASE_ID is not configured. Please set it in your .env file.'
    )
  }

  return config.notionDatabaseId
}
