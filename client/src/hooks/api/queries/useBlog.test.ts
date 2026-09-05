import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useBlog } from './useBlog'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('../../../api', () => ({
  blogApi: {
    getById: vi.fn()
  }
}))

import toast from 'react-hot-toast'
import { blogApi } from '../../../api'

describe('useBlog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not fetch without id', async () => {
    const { result } = renderHook(() => useBlog(undefined))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(blogApi.getById).not.toHaveBeenCalled()
    expect(result.current.blog).toBeNull()
  })

  it('loads blog on success', async () => {
    vi.mocked(blogApi.getById).mockResolvedValue({
      data: { success: true, blog: { _id: '1', title: 'T' } }
    } as never)

    const { result } = renderHook(() => useBlog('1'))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.blog).toEqual({ _id: '1', title: 'T' })
  })

  it('toasts on error', async () => {
    vi.mocked(blogApi.getById).mockRejectedValue({
      response: { data: { message: 'Not found' } }
    })

    const { result } = renderHook(() => useBlog('missing'))

    await waitFor(() => expect(result.current.error).toBe('Not found'))
    expect(toast.error).toHaveBeenCalledWith('Not found')
  })

  it('refetch reloads blog', async () => {
    vi.mocked(blogApi.getById).mockResolvedValue({
      data: { success: true, blog: { _id: '1', title: 'T' } }
    } as never)

    const { result } = renderHook(() => useBlog('1'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.refetch()
    })

    expect(blogApi.getById).toHaveBeenCalledTimes(2)
  })
})
