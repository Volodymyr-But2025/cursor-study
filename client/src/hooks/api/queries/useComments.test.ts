import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useComments } from './useComments'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('../../../api', () => ({
  commentApi: {
    getByBlog: vi.fn()
  }
}))

import { commentApi } from '../../../api'

describe('useComments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not fetch without blogId', async () => {
    const { result } = renderHook(() => useComments(undefined))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(commentApi.getByBlog).not.toHaveBeenCalled()
    expect(result.current.comments).toEqual([])
  })

  it('fetches comments for blogId', async () => {
    vi.mocked(commentApi.getByBlog).mockResolvedValue({
      data: { success: true, comments: [{ _id: 'c1' }] }
    } as never)

    const { result } = renderHook(() => useComments('blog-1'))

    await waitFor(() =>
      expect(result.current.comments).toEqual([{ _id: 'c1' }])
    )
    expect(commentApi.getByBlog).toHaveBeenCalledWith('blog-1')
  })
})
