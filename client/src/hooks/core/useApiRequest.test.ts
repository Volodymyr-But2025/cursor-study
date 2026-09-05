import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApiRequest } from './useApiRequest'

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

import toast from 'react-hot-toast'

describe('useApiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('execute returns success and toasts', async () => {
    const { result } = renderHook(() => useApiRequest())
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'OK' }
    })

    let response: { success: boolean } | undefined
    await act(async () => {
      response = await result.current.execute(apiCall, {
        successMessage: 'Saved'
      })
    })

    expect(response?.success).toBe(true)
    expect(toast.success).toHaveBeenCalledWith('Saved')
  })

  it('respects showSuccessToast false', async () => {
    const { result } = renderHook(() => useApiRequest({ showToast: false }))
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'OK' }
    })

    await act(async () => {
      await result.current.execute(apiCall)
    })

    expect(toast.success).not.toHaveBeenCalled()
  })

  it('handles thrown errors with toast', async () => {
    const { result } = renderHook(() => useApiRequest())
    const apiCall = vi.fn().mockRejectedValue({
      response: { data: { message: 'Fail' } }
    })

    let response: { success: boolean; message?: string } | undefined
    await act(async () => {
      response = await result.current.execute(apiCall)
    })

    expect(response).toEqual({ success: false, message: 'Fail' })
    expect(toast.error).toHaveBeenCalledWith('Fail')
  })
})
