import type { BlogPost, NotionPageProperties } from '~/types/blog'

/**
 * GET /api/posts/:slug
 * Returns a single blog post by slug, including content blocks
 */
export default defineEventHandler(async (event): Promise<BlogPost> => {
  const notion = getNotionClient()
  const databaseId = getNotionDatabaseId()
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug parameter is required',
    })
  }

  try {
    // Query database for published posts
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
    })

    // Find the post matching the slug
    let matchedPage: any = null

    for (const page of response.results) {
      const props = page.properties as NotionPageProperties
      const title = props.Title?.title?.[0]?.plain_text || 'Untitled'
      const customSlug = props.Slug?.rich_text?.[0]?.plain_text || ''
      const pageSlug = customSlug.trim() || slugify(title)

      if (pageSlug === slug) {
        matchedPage = page
        break
      }
    }

    if (!matchedPage) {
      throw createError({
        statusCode: 404,
        statusMessage: `Post not found: ${slug}`,
      })
    }

    // Extract properties
    const props = matchedPage.properties as NotionPageProperties
    const title = props.Title?.title?.[0]?.plain_text || 'Untitled'
    const customSlug = props.Slug?.rich_text?.[0]?.plain_text || ''
    const finalSlug = customSlug.trim() || slugify(title)
    const description = props.Description?.rich_text?.[0]?.plain_text || null
    const dateValue = props.Date?.date?.start || matchedPage.created_time
    const date = new Date(dateValue).toISOString()
    const tags = props.Tags?.multi_select?.map((tag) => tag.name) || []
    const published = props.Published?.checkbox || false

    // Fetch page blocks (content)
    const blocksResponse = await notion.blocks.children.list({
      block_id: matchedPage.id,
    })

    // Transform Notion blocks to HTML
    let content = await transformBlocksToHtml(blocksResponse.results)
    // Group consecutive list items into proper ul/ol tags
    content = groupListItems(content)

    return {
      id: matchedPage.id,
      title,
      slug: finalSlug,
      description,
      date,
      tags,
      published,
      content,
    }
  } catch (error: any) {
    // Re-throw createError errors as-is
    if (error.statusCode) {
      throw error
    }

    console.error('Error fetching post from Notion:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post from Notion',
      data: {
        message: error.message || 'Unknown error',
        code: error.code || 'UNKNOWN',
      },
    })
  }
})
