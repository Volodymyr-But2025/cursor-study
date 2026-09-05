import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useApiQuery } from './useApiQuery'

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

import toast from 'react-hot-toast'

describe('useApiQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches on mount and sets data', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, blogs: [{ id: 1 }] }
    })

    const { result } = renderHook(() => useApiQuery(apiCall))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual({ success: true, blogs: [{ id: 1 }] })
    expect(result.current.error).toBeNull()
  })

  it('sets error and toasts when success is false', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Nope' }
    })

    const { result } = renderHook(() =>
      useApiQuery(apiCall, { errorMessage: 'Fallback' })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Nope')
    expect(toast.error).toHaveBeenCalledWith('Nope')
  })

  it('uses fallback errorMessage when success false without message', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false }
    })

    const { result } = renderHook(() =>
      useApiQuery(apiCall, { errorMessage: 'Fallback error' })
    )

    await waitFor(() => {
      expect(result.current.error).toBe('Fallback error')
    })
  })

  it('handles thrown errors', async () => {
    const apiCall = vi.fn().mockRejectedValue({
      response: { data: { message: 'Server down' } }
    })

    const { result } = renderHook(() => useApiQuery(apiCall))

    await waitFor(() => {
      expect(result.current.error).toBe('Server down')
    })

    expect(toast.error).toHaveBeenCalledWith('Server down')
  })

  it('does not fetch when enabled is false', async () => {
    const apiCall = vi.fn()
    const { result } = renderHook(() =>
      useApiQuery(apiCall, { enabled: false })
    )

    expect(result.current.loading).toBe(false)
    expect(apiCall).not.toHaveBeenCalled()
  })

  it('does not fetch when apiCall is missing', async () => {
    const { result } = renderHook(() => useApiQuery(null as never))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('calls onSuccess and onError callbacks', async () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()

    const successCall = vi.fn().mockResolvedValue({
      data: { success: true, items: [] }
    })
    const { result: successResult } = renderHook(() =>
      useApiQuery(successCall, { onSuccess })
    )
    await waitFor(() => expect(successResult.current.loading).toBe(false))
    expect(onSuccess).toHaveBeenCalledWith({ success: true, items: [] })

    const failCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Fail' }
    })
    renderHook(() => useApiQuery(failCall, { onError }))
    await waitFor(() => expect(onError).toHaveBeenCalledWith('Fail'))
  })

  it('skips error toast when showErrorToast is false', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Silent' }
    })

    const { result } = renderHook(() =>
      useApiQuery(apiCall, { showErrorToast: false })
    )

    await waitFor(() => {
      expect(result.current.error).toBe('Silent')
    })
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('refetch calls api again', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, items: [] }
    })

    const { result } = renderHook(() => useApiQuery(apiCall))

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.refetch()
    })

    expect(apiCall).toHaveBeenCalledTimes(2)
  })
})
