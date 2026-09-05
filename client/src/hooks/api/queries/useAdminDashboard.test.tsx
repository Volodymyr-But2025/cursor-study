import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppContext } from '@/context'
import { createAppContextStub } from '@/test/renderWithProviders'
import { useAdminDashboard } from './useAdminDashboard'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

describe('useAdminDashboard', () => {
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

  it('maps dashboardData from response', async () => {
    axiosGet.mockResolvedValue({
      data: {
        success: true,
        dashboardData: { blogs: 3, comments: 5, drafts: 1, pendingComments: 2 }
      }
    })

    const { result } = renderHook(() => useAdminDashboard(), { wrapper })

    await waitFor(() =>
      expect(result.current.dashboardData).toMatchObject({ blogs: 3, comments: 5 })
    )
    expect(axiosGet).toHaveBeenCalledWith('/api/admin/dashboard')
  })

  it('uses defaults when dashboardData missing', async () => {
    axiosGet.mockResolvedValue({ data: { success: true } })
    const { result } = renderHook(() => useAdminDashboard(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.dashboardData.blogs).toBe(0)
    expect(result.current.dashboardData.recentBlogs).toEqual([])
  })
})
