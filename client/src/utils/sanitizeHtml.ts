import DOMPurify from 'dompurify'
import { parse } from 'marked'

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'a',
  'img',
  'span',
  'div',
  'hr'
]

const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel']

function looksLikeHtml(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content.trim())
}

export function toHtml(content: string): string {
  if (!content) return ''
  if (looksLikeHtml(content)) return content

  return parse(content, {
    async: false,
    gfm: true,
    breaks: true
  })
}

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false
  })
}

export function renderBlogHtml(content: string): string {
  return sanitizeHtml(toHtml(content))
}
