/**
 * Shared TypeScript interfaces for the blog
 */

/**
 * Blog post (normalized from Notion)
 */
export interface BlogPost {
  id: string
  title: string
  slug: string
  description: string | null
  date: string // ISO 8601 date string
  tags: string[]
  published: boolean
  content?: string // HTML content (only included in single post view)
}

/**
 * Notion database property types (for extracting data)
 */
export interface NotionPageProperties {
  Title: {
    type: 'title'
    title: Array<{ plain_text: string }>
  }
  Slug?: {
    type: 'rich_text'
    rich_text: Array<{ plain_text: string }>
  }
  Published: {
    type: 'checkbox'
    checkbox: boolean
  }
  Date?: {
    type: 'date'
    date: { start: string } | null
  }
  Tags?: {
    type: 'multi_select'
    multi_select: Array<{ name: string }>
  }
  Description?: {
    type: 'rich_text'
    rich_text: Array<{ plain_text: string }>
  }
}

/**
 * Notion API error
 */
export interface NotionError {
  code: string
  message: string
}
