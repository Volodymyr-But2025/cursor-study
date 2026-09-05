import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppContext } from '@/context'
import { createAppContextStub } from '@/test/renderWithProviders'
import { useAdminBlogs } from './useAdminBlogs'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

describe('useAdminBlogs', () => {
  const axiosGet = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  function wrapper({ children }: { children: ReactNode }) {
    return (
      <AppContext.Provider
        value={createAppContextStub({ axios: { get: axiosGet, post: vi.fn() } })}
      >
        {children}
      </AppContext.Provider>
    )
  }

  it('maps blogs from dashboard response', async () => {
    axiosGet.mockResolvedValue({
      data: { success: true, blogs: [{ _id: 'b1' }] }
    })

    const { result } = renderHook(() => useAdminBlogs(), { wrapper })

    await waitFor(() => expect(result.current.blogs).toEqual([{ _id: 'b1' }]))
    expect(axiosGet).toHaveBeenCalledWith('/api/admin/blogs')
  })

  it('defaults to empty list', async () => {
    axiosGet.mockResolvedValue({ data: { success: true } })
    const { result } = renderHook(() => useAdminBlogs(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.blogs).toEqual([])
  })
})
