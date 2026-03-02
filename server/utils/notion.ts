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
 * Fetch all blocks for a page, handling Notion's 100-block pagination limit.
 */
export async function fetchAllBlocks(blockId: string): Promise<any[]> {
  const notion = getNotionClient()
  const allBlocks: any[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      ...(cursor && { start_cursor: cursor }),
    })
    allBlocks.push(...response.results)
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return allBlocks
}

/**
 * Fetch all blocks for a page/block, recursively attaching children
 * for any block with has_children=true.
 */
export async function fetchBlocksWithChildren(blockId: string): Promise<any[]> {
  const blocks = await fetchAllBlocks(blockId)
  for (const block of blocks) {
    if (block.has_children) {
      block.children = await fetchBlocksWithChildren(block.id)
    }
  }
  return blocks
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
