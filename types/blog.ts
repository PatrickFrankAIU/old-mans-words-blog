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
  layout?: string // 'standard' | 'story' — controls which route renders the post
  cardImage?: string // local image path for card thumbnail (auto-extracted from first image)
  content?: string // HTML content (only included in single post view)
  sections?: ContentSection[] // Section-based content for story layout
}

/**
 * Content section for scrollytelling (story layout)
 */
export interface ContentSection {
  type: 'text' | 'parallax'
  html?: string       // for text sections: rendered HTML of consecutive non-image blocks
  imageSrc?: string   // for parallax sections: local image path
  imageAlt?: string   // for parallax sections: image alt text
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
  Layout?: {
    type: 'select'
    select: { name: string } | null
  }
}

/**
 * Notion API error
 */
export interface NotionError {
  code: string
  message: string
}
