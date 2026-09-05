import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBlogs } from './useBlogs'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('../../../api', () => ({
  blogApi: {
    getAll: vi.fn()
  }
}))

import { blogApi } from '../../../api'

describe('useBlogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty array when no data', async () => {
    vi.mocked(blogApi.getAll).mockResolvedValue({
      data: { success: true }
    } as never)

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.blogs).toEqual([])
  })

  it('maps blogs from response', async () => {
    vi.mocked(blogApi.getAll).mockResolvedValue({
      data: { success: true, blogs: [{ _id: '1' }] }
    } as never)

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => expect(result.current.blogs).toEqual([{ _id: '1' }]))
  })
})
