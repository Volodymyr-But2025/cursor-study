import { describe, it, expect } from 'vitest'
import { toHtml, sanitizeHtml, renderBlogHtml } from './sanitizeHtml'

describe('sanitizeHtml', () => {
  describe('toHtml', () => {
    it('returns empty string for falsy content', () => {
      expect(toHtml('')).toBe('')
    })

    it('passes through existing HTML', () => {
      expect(toHtml('<p>Hello</p>')).toBe('<p>Hello</p>')
    })

    it('converts markdown to HTML', () => {
      const html = toHtml('**bold**')
      expect(html).toContain('<strong>bold</strong>')
    })
  })

  describe('sanitizeHtml', () => {
    it('strips script tags', () => {
      const dirty = '<p>Hi</p><script>alert(1)</script>'
      const clean = sanitizeHtml(dirty)
      expect(clean).toContain('<p>Hi</p>')
      expect(clean).not.toContain('<script>')
      expect(clean).not.toContain('alert')
    })

    it('strips javascript: hrefs', () => {
      const dirty = '<a href="javascript:alert(1)">click</a>'
      const clean = sanitizeHtml(dirty)
      expect(clean).not.toContain('javascript:')
    })
  })

  describe('renderBlogHtml', () => {
    it('sanitizes markdown-rendered content', () => {
      const html = renderBlogHtml('Hello <script>evil()</script>')
      expect(html).toContain('Hello')
      expect(html).not.toContain('<script>')
    })
  })
})
