import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppContext } from '@/context'
import { createAppContextStub } from '@/test/renderWithProviders'
import { useAdminComments } from './useAdminComments'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('../../../api', () => ({
  adminApi: {
    getComments: vi.fn()
  }
}))

import { adminApi } from '../../../api'

describe('useAdminComments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function wrapper({ children }: { children: ReactNode }) {
    return (
      <AppContext.Provider value={createAppContextStub()}>
        {children}
      </AppContext.Provider>
    )
  }

  it('maps comments and supports optimistic update/remove', async () => {
    vi.mocked(adminApi.getComments).mockResolvedValue({
      data: {
        success: true,
        comments: [
          { _id: '1', isApproved: false },
          { _id: '2', isApproved: true }
        ],
        count: 2
      }
    } as never)

    const { result } = renderHook(() => useAdminComments(), { wrapper })

    await waitFor(() => expect(result.current.comments).toHaveLength(2))

    act(() => {
      result.current.updateComment('1', { isApproved: true })
    })
    expect(result.current.comments.find((c) => c._id === '1')?.isApproved).toBe(true)

    act(() => {
      result.current.removeComment('2')
    })
    expect(result.current.comments).toHaveLength(1)
    expect(result.current.comments[0]?._id).toBe('1')
  })
})
