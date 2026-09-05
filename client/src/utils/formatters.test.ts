import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatRelativeTime,
  truncateText,
  stripHtmlTags,
  truncateHtml
} from './formatters'

describe('formatters', () => {
  describe('formatDate', () => {
    it('formats a fixed ISO date', () => {
      expect(formatDate('2024-01-15T12:00:00.000Z')).toBe('January 15th 2024')
    })
  })

  describe('formatRelativeTime', () => {
    it('returns a relative string for a past date', () => {
      const result = formatRelativeTime(new Date(Date.now() - 60_000).toISOString())
      expect(result).toMatch(/ago|minute/i)
    })
  })

  describe('truncateText', () => {
    it('returns empty string for falsy input', () => {
      expect(truncateText('')).toBe('')
      expect(truncateText(null as unknown as string)).toBe('')
    })

    it('truncates long text with ellipsis', () => {
      expect(truncateText('abcdefghij', 5)).toBe('abcde...')
    })

    it('keeps short text unchanged', () => {
      expect(truncateText('short', 10)).toBe('short')
    })
  })

  describe('stripHtmlTags', () => {
    it('returns plain text from HTML', () => {
      expect(stripHtmlTags('<p>Hello <strong>world</strong></p>')).toBe('Hello world')
    })

    it('returns empty string for falsy input', () => {
      expect(stripHtmlTags('')).toBe('')
    })
  })

  describe('truncateHtml', () => {
    it('strips tags then truncates', () => {
      expect(truncateHtml('<p>abcdefghij</p>', 5)).toBe('abcde...')
    })
  })
})
