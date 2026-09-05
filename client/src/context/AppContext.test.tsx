import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AppProvider, useAppContext } from './index'
import { createJwt } from '@/test/testUtils'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('../api', () => ({
  axios: {},
  blogApi: {
    getAll: vi.fn()
  }
}))

import toast from 'react-hot-toast'
import { blogApi } from '../api'

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('AppContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.mocked(blogApi.getAll).mockResolvedValue({
      data: { success: true, blogs: [] }
    } as never)
  })

  it('throws when useAppContext is used outside provider', () => {
    expect(() => renderHook(() => useAppContext(), { wrapper })).toThrow(
      /must be used within an AppProvider/
    )
  })

  it('derives user from JWT token in localStorage', async () => {
    const token = createJwt({
      name: 'Ada',
      email: 'ada@example.com',
      role: 'admin'
    })
    localStorage.setItem('token', token)

    const { result } = renderHook(() => useAppContext(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <AppProvider>{children}</AppProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => expect(result.current.user?.name).toBe('Ada'))
    expect(result.current.token).toBe(token)
  })

  it('setToken(null) clears user', async () => {
    const token = createJwt({ name: 'Ada', email: 'a@b.com', role: 'admin' })
    localStorage.setItem('token', token)

    const { result } = renderHook(() => useAppContext(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <AppProvider>{children}</AppProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => expect(result.current.user).toBeTruthy())

    act(() => {
      result.current.setToken(null)
    })

    expect(result.current.token).toBeNull()
    expect(result.current.user).toBeNull()
  })

  it('fetchBlogs sets blogs on success', async () => {
    vi.mocked(blogApi.getAll).mockResolvedValue({
      data: { success: true, blogs: [{ _id: '1', title: 'Post' }] }
    } as never)

    const { result } = renderHook(() => useAppContext(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <AppProvider>{children}</AppProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() =>
      expect(result.current.blogs).toEqual([{ _id: '1', title: 'Post' }])
    )
  })

  it('fetchBlogs toasts on error', async () => {
    vi.mocked(blogApi.getAll).mockRejectedValue({
      response: { data: { message: 'Failed blogs' } }
    })

    renderHook(() => useAppContext(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <AppProvider>{children}</AppProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed blogs')
    })
  })

  it('fetchBlogs toasts when success is false', async () => {
    vi.mocked(blogApi.getAll).mockResolvedValue({
      data: { success: false, message: 'No blogs allowed' }
    } as never)

    renderHook(() => useAppContext(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <AppProvider>{children}</AppProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No blogs allowed')
    })
  })
})
