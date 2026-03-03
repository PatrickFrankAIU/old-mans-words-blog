import type { ContentSection } from '~/types/blog'

/**
 * Transform Notion blocks to HTML
 */
export async function transformBlocksToHtml(blocks: any[]): Promise<string> {
  const htmlParts: string[] = []

  for (const block of blocks) {
    const html = await transformBlock(block)
    if (html) {
      htmlParts.push(html)
    }
  }

  return htmlParts.join('\n')
}

/**
 * Transform a single Notion block to HTML
 */
async function transformBlock(block: any): Promise<string> {
  const type = block.type

  switch (type) {
    case 'paragraph':
      return transformParagraph(block)
    case 'heading_1':
      return transformHeading(block, 1)
    case 'heading_2':
      return transformHeading(block, 2)
    case 'heading_3':
      return transformHeading(block, 3)
    case 'bulleted_list_item':
      return transformListItem(block, 'ul')
    case 'numbered_list_item':
      return transformListItem(block, 'ol')
    case 'code':
      return transformCode(block)
    case 'quote':
      return await transformQuote(block)
    case 'divider':
      return '<hr>'
    case 'callout':
      return await transformCallout(block)
    case 'image':
      return transformImage(block)
    case 'column_list':
      return await transformColumnList(block)
    case 'column':
      return await transformColumn(block)
    default:
      // Unsupported block type - log and skip
      console.warn(`Unsupported block type: ${type}`)
      return ''
  }
}

/**
 * Transform paragraph block
 */
function transformParagraph(block: any): string {
  const text = transformRichText(block.paragraph.rich_text)
  if (!text.trim()) {
    return '<p>&nbsp;</p>' // Empty paragraph
  }
  return `<p>${text}</p>`
}

/**
 * Transform heading block
 */
function transformHeading(block: any, level: number): string {
  const key = `heading_${level}`
  const text = transformRichText(block[key].rich_text)
  return `<h${level}>${text}</h${level}>`
}

/**
 * Transform list item (bulleted or numbered)
 * Note: Notion returns individual list items, not wrapped lists
 * We'll wrap them in ul/ol tags, but proper grouping would require
 * looking ahead to consecutive items
 */
function transformListItem(block: any, listType: 'ul' | 'ol'): string {
  const key = listType === 'ul' ? 'bulleted_list_item' : 'numbered_list_item'
  const text = transformRichText(block[key].rich_text)
  // Return just the <li> - we'll need to group these in a post-processing step
  return `<li data-list-type="${listType}">${text}</li>`
}

/**
 * Transform code block
 */
function transformCode(block: any): string {
  const code = block.code.rich_text
    .map((rt: any) => rt.plain_text)
    .join('')
  const language = block.code.language || 'plaintext'

  // Escape HTML entities in code
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  return `<pre><code class="language-${language}">${escaped}</code></pre>`
}

/**
 * Transform quote block
 */
async function transformQuote(block: any): Promise<string> {
  const text = transformRichText(block.quote.rich_text)
  const childrenHtml = block.children?.length
    ? await transformBlocksToHtml(block.children)
    : ''
  return `<blockquote>${text}${childrenHtml}</blockquote>`
}

/**
 * Transform callout block
 */
async function transformCallout(block: any): Promise<string> {
  const icon = block.callout.icon?.emoji || '💡'
  const text = transformRichText(block.callout.rich_text)
  const color = block.callout.color || 'default'
  const childrenHtml = block.children?.length
    ? await transformBlocksToHtml(block.children)
    : ''
  return `<div class="callout callout-${color}"><span class="callout-icon">${icon}</span><div class="callout-text">${text}${childrenHtml}</div></div>`
}

/**
 * Transform column_list block (container for columns)
 * Notion provides children blocks for columns
 */
async function transformColumnList(block: any): Promise<string> {
  // Column lists have children that are individual column blocks
  // We need to fetch the children if they exist
  if (!block.has_children) {
    return ''
  }

  // Note: children should be fetched by the API route
  // For now, return a placeholder that signals column layout
  return `<div class="split-layout" data-block-id="${block.id}"></div>`
}

/**
 * Transform column block (individual column within column_list)
 */
async function transformColumn(block: any): Promise<string> {
  // Columns contain child blocks that we need to render
  // This is a placeholder - proper implementation requires fetching children
  return `<div class="split-column" data-block-id="${block.id}"></div>`
}

/**
 * Transform image block.
 * Uses the Notion URL directly — no local download — so images render on
 * production without a writable filesystem (e.g. Vercel serverless).
 * Supports layout hints via captions: "full-bleed", "wide"
 */
function transformImage(block: any): string {
  const image = block.image
  let imageUrl: string

  if (image.type === 'external') {
    imageUrl = image.external.url
  } else if (image.type === 'file') {
    imageUrl = image.file.url
  } else {
    console.warn('Unknown image type:', image.type)
    return ''
  }

  // Get caption if it exists
  const caption = image.caption?.length
    ? transformRichText(image.caption)
    : ''

  // Check for layout hints in caption
  const captionText = image.caption?.map((rt: any) => rt.plain_text).join('').toLowerCase() || ''

  if (captionText.includes('full-bleed') || captionText.includes('fullbleed')) {
    return `<div class="full-bleed-image"><img src="${imageUrl}" alt="${caption}" loading="lazy" /></div>`
  }

  if (captionText.includes('wide')) {
    return `<div class="wide-image"><img src="${imageUrl}" alt="${caption}" loading="lazy" /></div>`
  }

  if (caption) {
    return `<figure><img src="${imageUrl}" alt="${caption}" loading="lazy" /><figcaption>${caption}</figcaption></figure>`
  }

  return `<img src="${imageUrl}" alt="" loading="lazy" />`
}


/**
 * Extract the first image URL from a list of Notion blocks.
 * Returns the raw Notion URL (signed S3 or external) — no local download.
 */
export function extractFirstImageUrl(blocks: any[]): string | null {
  for (const block of blocks) {
    if (block.type !== 'image') continue

    const image = block.image
    if (image.type === 'external') return image.external.url
    if (image.type === 'file') return image.file.url
  }

  return null
}

/**
 * Transform rich text array to HTML
 * Handles bold, italic, strikethrough, code, links, etc.
 */
function transformRichText(richTextArray: any[]): string {
  if (!richTextArray || richTextArray.length === 0) {
    return ''
  }

  return richTextArray
    .map((rt) => {
      let text = rt.plain_text

      // Escape HTML entities
      text = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

      const annotations = rt.annotations

      // Apply formatting in correct order
      if (annotations.code) {
        text = `<code>${text}</code>`
      }
      if (annotations.bold) {
        text = `<strong>${text}</strong>`
      }
      if (annotations.italic) {
        text = `<em>${text}</em>`
      }
      if (annotations.strikethrough) {
        text = `<s>${text}</s>`
      }
      if (annotations.underline) {
        text = `<u>${text}</u>`
      }

      // Handle links
      if (rt.href) {
        text = `<a href="${rt.href}" target="_blank" rel="noopener noreferrer">${text}</a>`
      }

      return text
    })
    .join('')
}

/**
 * Post-process HTML to group consecutive list items
 */
export function groupListItems(html: string): string {
  // Replace consecutive <li data-list-type="ul"> with proper <ul> wrapping
  html = html.replace(
    /(<li data-list-type="ul">.*?<\/li>\n?)+/gs,
    (match) => {
      const items = match.replace(/ data-list-type="ul"/g, '')
      return `<ul>\n${items}</ul>\n`
    }
  )

  // Replace consecutive <li data-list-type="ol"> with proper <ol> wrapping
  html = html.replace(
    /(<li data-list-type="ol">.*?<\/li>\n?)+/gs,
    (match) => {
      const items = match.replace(/ data-list-type="ol"/g, '')
      return `<ol>\n${items}</ol>\n`
    }
  )

  return html
}

/**
 * Transform Notion blocks into content sections for scrollytelling layout.
 * Splits blocks into text and parallax sections based on image boundaries.
 */
export async function transformBlocksToSections(blocks: any[]): Promise<ContentSection[]> {
  const sections: ContentSection[] = []
  let pendingHtmlParts: string[] = []

  const flushText = () => {
    if (pendingHtmlParts.length === 0) return
    let html = pendingHtmlParts.join('\n')
    html = groupListItems(html)
    sections.push({ type: 'text', html })
    pendingHtmlParts = []
  }

  for (const block of blocks) {
    if (block.type === 'image') {
      // Flush accumulated text before the image
      flushText()

      // Extract image info and emit a parallax section
      const info = extractImageInfo(block)
      if (info) {
        sections.push({
          type: 'parallax',
          imageSrc: info.src,
          imageAlt: info.alt,
        })
      }
    } else {
      // Accumulate non-image blocks as HTML
      const html = await transformBlock(block)
      if (html) {
        pendingHtmlParts.push(html)
      }
    }
  }

  // Flush any remaining text
  flushText()

  return sections
}

/**
 * Extract image source and alt from an image block.
 * Returns the raw Notion URL — no local download.
 */
function extractImageInfo(block: any): { src: string; alt: string } | null {
  const image = block.image
  let imageUrl: string

  if (image.type === 'external') {
    imageUrl = image.external.url
  } else if (image.type === 'file') {
    imageUrl = image.file.url
  } else {
    return null
  }

  const alt = image.caption?.map((rt: any) => rt.plain_text).join('') || ''
  return { src: imageUrl, alt }
}
