import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateUrl,
  isNonEmptyHtml
} from './validators'

describe('validators', () => {
  describe('validateEmail', () => {
    it('accepts valid emails', () => {
      expect(validateEmail('user@example.com')).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(validateEmail('not-an-email')).toBe(false)
      expect(validateEmail('a@b')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validateRequired', () => {
    it('rejects null, undefined, and whitespace-only', () => {
      expect(validateRequired(null)).toBe(false)
      expect(validateRequired(undefined)).toBe(false)
      expect(validateRequired('   ')).toBe(false)
    })

    it('accepts non-empty strings', () => {
      expect(validateRequired('hello')).toBe(true)
    })
  })

  describe('validateMinLength / validateMaxLength', () => {
    it('checks minimum length', () => {
      expect(validateMinLength('ab', 3)).toBe(false)
      expect(validateMinLength('abc', 3)).toBe(true)
    })

    it('checks maximum length', () => {
      expect(validateMaxLength('abcd', 3)).toBe(false)
      expect(validateMaxLength('ab', 3)).toBe(true)
    })
  })

  describe('validateUrl', () => {
    it('accepts absolute URLs', () => {
      expect(validateUrl('https://example.com/path')).toBe(true)
    })

    it('rejects invalid URLs', () => {
      expect(validateUrl('not a url')).toBe(false)
    })
  })

  describe('isNonEmptyHtml', () => {
    it('returns false for empty Quill placeholders', () => {
      expect(isNonEmptyHtml('')).toBe(false)
      expect(isNonEmptyHtml('<p><br></p>')).toBe(false)
      expect(isNonEmptyHtml('<p></p>')).toBe(false)
      expect(isNonEmptyHtml('<p>&nbsp;</p>')).toBe(false)
    })

    it('returns true when HTML has visible text', () => {
      expect(isNonEmptyHtml('<p>Hello</p>')).toBe(true)
    })
  })
})
