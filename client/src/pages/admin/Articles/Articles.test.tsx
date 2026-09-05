import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import Articles from './Articles'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('@/hooks', () => ({
  useAdminBlogs: vi.fn()
}))

vi.mock('@/api', () => ({
  blogApi: {
    deleteBlog: vi.fn(),
    publish: vi.fn(),
    unpublish: vi.fn()
  }
}))

import { useAdminBlogs } from '@/hooks'
import { blogApi } from '@/api'
import toast from 'react-hot-toast'

const blogs = [
  {
    _id: '1',
    title: 'Alpha Post',
    createdAt: '2024-01-01T00:00:00.000Z',
    isPublished: false
  },
  {
    _id: '2',
    title: 'Beta Post',
    createdAt: '2024-06-01T00:00:00.000Z',
    isPublished: true
  },
  {
    _id: '3',
    title: 'Charlie Post',
    createdAt: '2024-03-01T00:00:00.000Z',
    isPublished: false
  }
]

describe('Articles', () => {
  const refetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAdminBlogs).mockReturnValue({
      blogs,
      loading: false,
      error: null,
      refetch
    })
  })

  it('shows loading spinner', () => {
    vi.mocked(useAdminBlogs).mockReturnValue({
      blogs: [],
      loading: true,
      error: null,
      refetch
    })

    const { container } = renderWithProviders(<Articles />, { appContext: false })
    expect(container.querySelector('.ant-spin')).toBeTruthy()
  })

  it('renders articles and sorts A-Z', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<Articles />, { appContext: false })

    expect(screen.getByText('All Articles')).toBeInTheDocument()
    expect(screen.getByText('Alpha Post')).toBeInTheDocument()

    await user.click(screen.getByText('A-Z'))

    const rows = Array.from(
      container.querySelectorAll('.ant-table-tbody tr[data-row-key]')
    )
    const titles = rows.map((row) =>
      within(row as HTMLElement).getByText(/Post/).textContent
    )
    expect(titles).toEqual(['Alpha Post', 'Beta Post', 'Charlie Post'])
  })

  it('sorts by latest date', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<Articles />, { appContext: false })

    await user.click(screen.getByText('A-Z'))
    await user.click(screen.getByText('Latest'))

    const rows = Array.from(
      container.querySelectorAll('.ant-table-tbody tr[data-row-key]')
    )
    const titles = rows.map((row) =>
      within(row as HTMLElement).getByText(/Post/).textContent
    )
    expect(titles).toEqual(['Beta Post', 'Charlie Post', 'Alpha Post'])
  })

  it('publishes draft via blogApi and refetches', async () => {
    vi.mocked(blogApi.publish).mockResolvedValue({
      data: { success: true }
    } as never)

    const user = userEvent.setup()
    const { container } = renderWithProviders(<Articles />, { appContext: false })

    const alphaRow = container.querySelector('tr[data-row-key="1"]') as HTMLElement
    await user.click(within(alphaRow).getByLabelText('Publish'))

    await waitFor(() => {
      expect(blogApi.publish).toHaveBeenCalledWith('1')
    })
    expect(refetch).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalled()
  })

  it('unpublishes published article', async () => {
    vi.mocked(blogApi.unpublish).mockResolvedValue({
      data: { success: true }
    } as never)

    const user = userEvent.setup()
    renderWithProviders(<Articles />, { appContext: false })

    await user.click(screen.getByLabelText('Unpublish'))

    await waitFor(() => {
      expect(blogApi.unpublish).toHaveBeenCalledWith('2')
    })
    expect(refetch).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows toast.error when publish returns success false', async () => {
    vi.mocked(blogApi.publish).mockResolvedValue({
      data: { success: false, message: 'Cannot publish' }
    } as never)

    const user = userEvent.setup()
    renderWithProviders(<Articles />, { appContext: false })

    await user.click(screen.getAllByLabelText('Publish')[0]!)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Cannot publish')
    })
    expect(refetch).not.toHaveBeenCalled()
  })

  it('shows toast.error when delete throws', async () => {
    vi.mocked(blogApi.deleteBlog).mockRejectedValue({
      response: { data: { message: 'Delete failed' } }
    })

    const user = userEvent.setup()
    renderWithProviders(<Articles />, { appContext: false })

    await user.click(screen.getAllByLabelText('Delete')[0]!)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Delete failed')
    })
  })

  it('deletes article via blogApi', async () => {
    vi.mocked(blogApi.deleteBlog).mockResolvedValue({
      data: { success: true }
    } as never)

    const user = userEvent.setup()
    renderWithProviders(<Articles />, { appContext: false })

    await user.click(screen.getAllByLabelText('Delete')[0]!)

    await waitFor(() => {
      expect(blogApi.deleteBlog).toHaveBeenCalled()
    })
    expect(refetch).toHaveBeenCalled()
  })
})
