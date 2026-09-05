import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCommentActions } from './useCommentActions'
import { MESSAGES } from '@/constants/messages'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('../../../api', () => ({
  adminApi: {
    approveComment: vi.fn(),
    disapproveComment: vi.fn(),
    deleteComment: vi.fn()
  }
}))

import toast from 'react-hot-toast'
import { adminApi } from '../../../api'

describe('useCommentActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(adminApi.approveComment).mockResolvedValue({
      data: { success: true }
    } as never)
    vi.mocked(adminApi.disapproveComment).mockResolvedValue({
      data: { success: true }
    } as never)
    vi.mocked(adminApi.deleteComment).mockResolvedValue({
      data: { success: true }
    } as never)
  })

  it('approves, disapproves, and deletes comments', async () => {
    const { result } = renderHook(() => useCommentActions())

    await act(async () => {
      await result.current.approveComment('1')
      await result.current.disapproveComment('1')
      await result.current.deleteComment('1')
    })

    expect(adminApi.approveComment).toHaveBeenCalledWith('1')
    expect(adminApi.disapproveComment).toHaveBeenCalledWith('1')
    expect(adminApi.deleteComment).toHaveBeenCalledWith('1')
    expect(toast.success).toHaveBeenCalledWith(MESSAGES.SUCCESS_COMMENT_APPROVED)
    expect(toast.success).toHaveBeenCalledWith(MESSAGES.SUCCESS_COMMENT_DISAPPROVED)
    expect(toast.success).toHaveBeenCalledWith(MESSAGES.SUCCESS_COMMENT_DELETED)
  })
})
