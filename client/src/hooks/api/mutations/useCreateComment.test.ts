import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateComment } from './useCreateComment'
import { MESSAGES } from '@/constants/messages'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('../../../api', () => ({
  commentApi: {
    create: vi.fn()
  }
}))

import toast from 'react-hot-toast'
import { commentApi } from '../../../api'

describe('useCreateComment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates comment and shows success toast', async () => {
    vi.mocked(commentApi.create).mockResolvedValue({
      data: { success: true }
    } as never)

    const { result } = renderHook(() => useCreateComment())

    let response: { success: boolean } | undefined
    await act(async () => {
      response = await result.current.createComment({
        blog: '1',
        name: 'Ann',
        content: 'Hi'
      })
    })

    expect(commentApi.create).toHaveBeenCalledWith({
      blog: '1',
      name: 'Ann',
      content: 'Hi'
    })
    expect(response?.success).toBe(true)
    expect(toast.success).toHaveBeenCalledWith(MESSAGES.SUCCESS_COMMENT_ADDED)
  })
})
