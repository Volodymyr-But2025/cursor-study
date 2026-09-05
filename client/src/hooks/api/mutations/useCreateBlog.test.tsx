import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppContext } from '@/context'
import { createAppContextStub } from '@/test/renderWithProviders'
import { useCreateBlog } from './useCreateBlog'
import { MESSAGES } from '@/constants/messages'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

describe('useCreateBlog', () => {
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

  it('rejects invalid image file', async () => {
    const { result } = renderHook(() => useCreateBlog(), { wrapper })

    let response: { success: boolean; message?: string } | undefined
    await act(async () => {
      response = await result.current.createBlog({ title: 'T' }, true as unknown as File)
    })

    expect(response).toEqual({ success: false, message: 'Invalid image file' })
    expect(axiosPost).not.toHaveBeenCalled()
  })

  it('posts FormData with blog JSON and image', async () => {
    const { result } = renderHook(() => useCreateBlog(), { wrapper })
    const file = new File(['img'], 'cover.png', { type: 'image/png' })
    const blogData = { title: 'Hello', category: 'Startup' }

    await act(async () => {
      await result.current.createBlog(blogData, file)
    })

    expect(axiosPost).toHaveBeenCalledWith('/api/blog/add', expect.any(FormData))
    const formData = vi.mocked(axiosPost).mock.calls[0]?.[1] as FormData
    expect(formData.get('blog')).toBe(JSON.stringify(blogData))
    expect(formData.get('image')).toBe(file)
  })
})
