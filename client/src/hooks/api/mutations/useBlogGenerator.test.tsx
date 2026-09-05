import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppContext } from '@/context'
import { createAppContextStub } from '@/test/renderWithProviders'
import { useBlogGenerator } from './useBlogGenerator'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('marked', () => ({
  parse: vi.fn((content: string) => `<p>${content}</p>`)
}))

import toast from 'react-hot-toast'
import { parse } from 'marked'

describe('useBlogGenerator', () => {
  const axiosPost = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
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

  it('rejects empty prompt without API call', async () => {
    const { result } = renderHook(() => useBlogGenerator(), { wrapper })

    let response: { success: boolean; message?: string } | undefined
    await act(async () => {
      response = await result.current.generateContent('   ')
    })

    expect(response?.success).toBe(false)
    expect(axiosPost).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith('Please enter a title')
  })

  it('parses generated markdown on success', async () => {
    axiosPost.mockResolvedValue({
      data: { success: true, content: 'Hello **world**' }
    })

    const { result } = renderHook(() => useBlogGenerator(), { wrapper })

    await act(async () => {
      await result.current.generateContent('My title')
    })

    await waitFor(() => {
      expect(result.current.generatedContent).toBe('<p>Hello **world**</p>')
    })
    expect(parse).toHaveBeenCalledWith('Hello **world**')
    expect(axiosPost).toHaveBeenCalledWith('/api/blog/generate', {
      prompt: 'My title'
    })
  })

  it('clearContent resets generated content', async () => {
    axiosPost.mockResolvedValue({
      data: { success: true, content: 'x' }
    })

    const { result } = renderHook(() => useBlogGenerator(), { wrapper })

    await act(async () => {
      await result.current.generateContent('title')
    })

    await waitFor(() => expect(result.current.generatedContent).toBeTruthy())

    act(() => {
      result.current.clearContent()
    })

    expect(result.current.generatedContent).toBeNull()
  })
})
