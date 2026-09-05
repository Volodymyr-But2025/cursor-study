import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppContext } from '@/context'
import { createAppContextStub } from '@/test/renderWithProviders'
import { useBlogActions } from './useBlogActions'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

describe('useBlogActions', () => {
  const axiosPost = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    axiosPost.mockResolvedValue({ data: { success: true } })
  })

  function wrapper({ children }: { children: ReactNode }) {
    return (
      <AppContext.Provider
        value={createAppContextStub({ axios: { post: axiosPost, get: vi.fn() } })}
      >
        {children}
      </AppContext.Provider>
    )
  }

  it('cancels delete when confirm is declined', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { result } = renderHook(() => useBlogActions(), { wrapper })

    let response: { success: boolean; cancelled?: boolean } | undefined
    await act(async () => {
      response = await result.current.deleteBlog('1')
    })

    expect(response).toEqual({ success: false, cancelled: true })
    expect(axiosPost).not.toHaveBeenCalled()
  })

  it('deletes when confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { result } = renderHook(() => useBlogActions(), { wrapper })

    await act(async () => {
      await result.current.deleteBlog('1')
    })

    expect(axiosPost).toHaveBeenCalledWith('/api/blog/delete', { id: '1' })
  })

  it('publish and unpublish post correct endpoints', async () => {
    const { result } = renderHook(() => useBlogActions(), { wrapper })

    await act(async () => {
      await result.current.publishBlog('2')
      await result.current.unpublishBlog('2')
    })

    expect(axiosPost).toHaveBeenCalledWith('/api/blog/publish', { id: '2' })
    expect(axiosPost).toHaveBeenCalledWith('/api/blog/unpublish', { id: '2' })
  })
})
