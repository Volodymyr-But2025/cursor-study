import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApiMutation } from './useApiMutation'

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

import toast from 'react-hot-toast'

describe('useApiMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success data and shows toast', async () => {
    const { result } = renderHook(() => useApiMutation())
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'Done' }
    })

    let response: { success: boolean; data?: unknown } | undefined
    await act(async () => {
      response = await result.current.mutate(apiCall, {
        successMessage: 'Created!'
      })
    })

    expect(response).toEqual({
      success: true,
      data: { success: true, message: 'Done' }
    })
    expect(toast.success).toHaveBeenCalledWith('Created!')
    expect(result.current.loading).toBe(false)
  })

  it('returns cancelled when confirm is declined', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { result } = renderHook(() => useApiMutation())
    const apiCall = vi.fn()

    let response: { success: boolean; cancelled?: boolean } | undefined
    await act(async () => {
      response = await result.current.mutate(apiCall, {
        confirmMessage: 'Sure?'
      })
    })

    expect(response).toEqual({ success: false, cancelled: true })
    expect(apiCall).not.toHaveBeenCalled()
  })

  it('proceeds when confirm is accepted', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { result } = renderHook(() => useApiMutation())
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'OK' }
    })

    let response: { success: boolean } | undefined
    await act(async () => {
      response = await result.current.mutate(apiCall, {
        confirmMessage: 'Sure?'
      })
    })

    expect(response?.success).toBe(true)
    expect(apiCall).toHaveBeenCalled()
  })

  it('handles API failure', async () => {
    const { result } = renderHook(() => useApiMutation())
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Nope' }
    })

    let response: { success: boolean; message?: string } | undefined
    await act(async () => {
      response = await result.current.mutate(apiCall)
    })

    expect(response?.success).toBe(false)
    expect(result.current.error).toBe('Nope')
    expect(toast.error).toHaveBeenCalledWith('Nope')
  })

  it('calls onSuccess and onError', async () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const { result } = renderHook(() => useApiMutation())

    await act(async () => {
      await result.current.mutate(
        vi.fn().mockResolvedValue({ data: { success: true } }),
        { onSuccess }
      )
    })
    expect(onSuccess).toHaveBeenCalled()

    await act(async () => {
      await result.current.mutate(
        vi.fn().mockResolvedValue({ data: { success: false, message: 'Bad' } }),
        { onError }
      )
    })
    expect(onError).toHaveBeenCalledWith('Bad')
  })

  it('skips toasts when showToast is false', async () => {
    const { result } = renderHook(() => useApiMutation({ showToast: false }))
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'Quiet' }
    })

    await act(async () => {
      await result.current.mutate(apiCall)
    })

    expect(toast.success).not.toHaveBeenCalled()
  })

  it('reset clears error state', async () => {
    const { result } = renderHook(() => useApiMutation())
    const apiCall = vi.fn().mockRejectedValue({ message: 'Boom' })

    await act(async () => {
      await result.current.mutate(apiCall)
    })

    expect(result.current.error).toBe('Boom')

    act(() => {
      result.current.reset()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })
})
