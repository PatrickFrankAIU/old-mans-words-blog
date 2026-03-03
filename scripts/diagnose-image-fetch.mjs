/**
 * Diagnostic script — run with: node scripts/diagnose-image-fetch.mjs
 *
 * Fetches a real Notion image block URL and probes every likely failure mode:
 *   1. URL expiry
 *   2. HTTP status with no headers
 *   3. HTTP status with a User-Agent header
 *   4. Redirect detection
 *   5. Actual buffer download
 */

import { readFileSync } from 'fs'
import { Client } from '@notionhq/client'

// Load .env manually (no dotenv dependency)
const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=').map(p => p.trim()))
    .filter(([k, v]) => k && v)
    .map(([k, ...rest]) => [k, rest.join('=')])
)

const NOTION_API_KEY = env.NOTION_API_KEY
const NOTION_DATABASE_ID = env.NOTION_DATABASE_ID

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error('Missing NOTION_API_KEY or NOTION_DATABASE_ID in .env')
  process.exit(1)
}

const notion = new Client({ auth: NOTION_API_KEY })

// ── helpers ──────────────────────────────────────────────────────────────────

function parseAmzExpiry(url) {
  try {
    const u = new URL(url)
    const amzDate    = u.searchParams.get('X-Amz-Date')
    const amzExpires = u.searchParams.get('X-Amz-Expires')
    if (!amzDate || !amzExpires) return null

    const iso = `${amzDate.slice(0,4)}-${amzDate.slice(4,6)}-${amzDate.slice(6,8)}` +
                `T${amzDate.slice(9,11)}:${amzDate.slice(11,13)}:${amzDate.slice(13,15)}Z`
    const expiresAt = new Date(Date.parse(iso) + parseInt(amzExpires) * 1000)
    const secondsRemaining = Math.round((expiresAt.getTime() - Date.now()) / 1000)
    return { expiresAt, secondsRemaining, isExpired: secondsRemaining < 0 }
  } catch {
    return null
  }
}

async function probe(label, url, options = {}) {
  console.log(`\n  [${label}]`)
  try {
    const res = await fetch(url, { redirect: 'follow', ...options })
    const redirected = res.url !== url
    console.log(`    status : ${res.status} ${res.statusText}`)
    console.log(`    type   : ${res.headers.get('content-type')}`)
    console.log(`    length : ${res.headers.get('content-length')} bytes`)
    console.log(`    redirect: ${redirected ? res.url : 'none'}`)
    if (!res.ok) {
      const body = await res.text()
      console.log(`    body   : ${body.slice(0, 400)}`)
    } else {
      const buf = await res.arrayBuffer()
      console.log(`    buffer : ${buf.byteLength} bytes received ✓`)
    }
  } catch (e) {
    console.log(`    ERROR  : ${e.name}: ${e.message}`)
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

console.log('=== Notion image fetch diagnostic ===\n')

// 1. Get published posts
const dbResponse = await notion.databases.query({
  database_id: NOTION_DATABASE_ID,
  filter: { property: 'Published', checkbox: { equals: true } },
  page_size: 5,
})

console.log(`Found ${dbResponse.results.length} published posts (checking first 5 for images)`)

let imageUrl = null
let imageType = null

for (const page of dbResponse.results) {
  const title = page.properties?.Title?.title?.[0]?.plain_text || '(untitled)'
  const blocks = await notion.blocks.children.list({ block_id: page.id })
  const imageBlock = blocks.results.find(b => b.type === 'image')

  if (imageBlock) {
    const img = imageBlock.image
    if (img.type === 'file') {
      imageUrl = img.file.url
      imageType = 'file (Notion-hosted, signed S3)'
    } else if (img.type === 'external') {
      imageUrl = img.external.url
      imageType = 'external'
    }
    console.log(`\nUsing image from: "${title}"`)
    console.log(`Type   : ${imageType}`)
    console.log(`URL    : ${imageUrl.slice(0, 80)}...`)
    break
  }
}

if (!imageUrl) {
  console.log('\nNo image blocks found in first 5 posts — nothing to probe.')
  process.exit(0)
}

// 2. Check expiry
const expiry = parseAmzExpiry(imageUrl)
if (expiry) {
  console.log(`\nExpiry : ${expiry.isExpired ? '🔴 EXPIRED' : '🟢 valid'} — ${expiry.secondsRemaining}s remaining (${expiry.expiresAt.toISOString()})`)
} else {
  console.log(`\nExpiry : not an S3 signed URL (external image)`)
}

// 3. Probe with various configurations
console.log('\n--- Fetch probes ---')

await probe('no extra headers (current behavior)', imageUrl)

await probe('with User-Agent', imageUrl, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NuxtBlog/1.0)' },
})

await probe('redirect:manual (detect if S3 redirects)', imageUrl, {
  redirect: 'manual',
})

console.log('\n=== Done ===')
