import type { BlogPost, NotionPageProperties } from '~/types/blog'

/**
 * GET /api/posts
 * Returns a list of all published blog posts
 */
export default defineEventHandler(async (event): Promise<BlogPost[]> => {
  const notion = getNotionClient()
  const databaseId = getNotionDatabaseId()

  try {
    // Query database for published posts only
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    })

    // Transform Notion pages to BlogPost objects
    const posts: BlogPost[] = response.results.map((page: any) => {
      const props = page.properties as NotionPageProperties

      // Extract title
      const title = props.Title?.title?.[0]?.plain_text || 'Untitled'

      // Extract or generate slug
      const customSlug = props.Slug?.rich_text?.[0]?.plain_text || ''
      const slug = customSlug.trim() || slugify(title)

      // Extract description
      const description =
        props.Description?.rich_text?.[0]?.plain_text || null

      // Extract date (use Date property or fall back to created_time)
      const dateValue = props.Date?.date?.start || page.created_time
      const date = new Date(dateValue).toISOString()

      // Extract tags
      const tags = props.Tags?.multi_select?.map((tag) => tag.name) || []

      // Published flag
      const published = props.Published?.checkbox || false

      // Layout (standard or story) — normalize to lowercase
      const layout = (props.Layout?.select?.name || 'standard').toLowerCase()

      return {
        id: page.id,
        title,
        slug,
        description,
        date,
        tags,
        published,
        layout,
      }
    })

    return posts
  } catch (error: any) {
    console.error('Error fetching posts from Notion:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts from Notion',
      data: {
        message: error.message || 'Unknown error',
        code: error.code || 'UNKNOWN',
      },
    })
  }
})
