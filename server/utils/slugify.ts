/**
 * Convert a string to a URL-friendly slug
 * - Lowercase
 * - Kebab-case
 * - ASCII-only (removes diacritics)
 * - Safe for URLs
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove non-word chars except -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, '') // Trim - from end
}
