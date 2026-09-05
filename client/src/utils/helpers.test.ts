import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  classNames,
  debounce,
  scrollToTop,
  getErrorMessage,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  decodeJwtPayload,
  getUserFromToken
} from './helpers'
import { createJwt } from '@/test/testUtils'

describe('helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('classNames', () => {
    it('joins truthy class names', () => {
      expect(classNames('a', false, 'b', null, 'c')).toBe('a b c')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('delays function execution', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 300)

      debounced('a')
      debounced('b')
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('b')
    })
  })

  describe('scrollToTop', () => {
    it('calls window.scrollTo', () => {
      scrollToTop('auto')
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
    })
  })

  describe('getErrorMessage', () => {
    it('prefers API response message', () => {
      expect(
        getErrorMessage({ response: { data: { message: 'API error' } } })
      ).toBe('API error')
    })

    it('falls back to error.message then default', () => {
      expect(getErrorMessage({ message: 'Network' })).toBe('Network')
      expect(getErrorMessage({})).toBe('Something went wrong')
    })
  })

  describe('localStorage helpers', () => {
    it('saves, reads, and removes values', () => {
      expect(saveToLocalStorage('key', { a: 1 })).toBe(true)
      expect(getFromLocalStorage('key')).toEqual({ a: 1 })
      expect(removeFromLocalStorage('key')).toBe(true)
      expect(getFromLocalStorage('key', 'fallback')).toBe('fallback')
    })

    it('returns default when JSON is invalid', () => {
      localStorage.setItem('bad', '{not-json')
      expect(getFromLocalStorage('bad', 'default')).toBe('default')
    })

    it('returns false when setItem throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota')
      })
      expect(saveToLocalStorage('x', 1)).toBe(false)
      spy.mockRestore()
    })
  })

  describe('decodeJwtPayload / getUserFromToken', () => {
    it('decodes a valid JWT payload', () => {
      const token = createJwt({ name: 'Ada', email: 'ada@example.com', role: 'admin' })
      expect(decodeJwtPayload(token)).toMatchObject({ name: 'Ada' })
      expect(getUserFromToken(token)).toEqual({
        name: 'Ada',
        email: 'ada@example.com',
        role: 'admin'
      })
    })

    it('returns null for invalid tokens', () => {
      expect(decodeJwtPayload(null as unknown as string)).toBeNull()
      expect(decodeJwtPayload('not.a.jwt')).toBeNull()
      expect(getUserFromToken(createJwt({ email: 'x@y.com' }))).toBeNull()
    })
  })
})
