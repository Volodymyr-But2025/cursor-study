import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import Comments from './Comments'

vi.mock('@/hooks', () => ({
  useAdminComments: vi.fn(),
  useCommentActions: vi.fn()
}))

import { useAdminComments, useCommentActions } from '@/hooks'

const comments = [
  {
    _id: 'c1',
    content: 'Pending comment',
    name: 'Ann',
    isApproved: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    blog: { title: 'Article B' }
  },
  {
    _id: 'c2',
    content: 'Approved comment',
    name: 'Bob',
    isApproved: true,
    createdAt: '2024-06-01T00:00:00.000Z',
    blog: { title: 'Article A' }
  },
  {
    _id: 'c3',
    content: 'Orphan comment',
    name: 'Carl',
    isApproved: false,
    createdAt: '2024-03-01T00:00:00.000Z'
  }
]

describe('Comments', () => {
  const updateComment = vi.fn()
  const removeComment = vi.fn()
  const approveComment = vi.fn()
  const deleteComment = vi.fn()
  const disapproveComment = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    approveComment.mockResolvedValue({ success: true })
    deleteComment.mockResolvedValue({ success: true })
    disapproveComment.mockResolvedValue({ success: true })

    vi.mocked(useAdminComments).mockReturnValue({
      comments,
      loading: false,
      error: null,
      refetch: vi.fn(),
      updateComment,
      removeComment
    })

    vi.mocked(useCommentActions).mockReturnValue({
      approveComment,
      disapproveComment,
      deleteComment,
      inProgress: false,
      error: null
    })
  })

  it('shows loading spinner', () => {
    vi.mocked(useAdminComments).mockReturnValue({
      comments: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
      updateComment,
      removeComment
    })

    const { container } = renderWithProviders(<Comments />, { appContext: false })
    expect(container.querySelector('.ant-spin')).toBeTruthy()
  })

  it('shows empty table when there are no comments', () => {
    vi.mocked(useAdminComments).mockReturnValue({
      comments: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
      updateComment,
      removeComment
    })

    renderWithProviders(<Comments />, { appContext: false })
    expect(screen.getByText('Comments')).toBeInTheDocument()
    expect(screen.getByText(/0/)).toBeInTheDocument()
  })

  it('shows unknown article when blog title is missing', () => {
    renderWithProviders(<Comments />, { appContext: false })
    expect(screen.getByText('Unknown article')).toBeInTheDocument()
  })

  it('approves a comment', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<Comments />, { appContext: false })

    const row = container.querySelector('tr[data-row-key="c1"]') as HTMLElement
    await user.click(within(row).getByLabelText('Approve'))

    await waitFor(() => {
      expect(approveComment).toHaveBeenCalledWith('c1')
    })
    expect(updateComment).toHaveBeenCalledWith('c1', { isApproved: true })
  })

  it('does not update when approve fails', async () => {
    approveComment.mockResolvedValue({ success: false })
    const user = userEvent.setup()
    const { container } = renderWithProviders(<Comments />, { appContext: false })

    const row = container.querySelector('tr[data-row-key="c1"]') as HTMLElement
    await user.click(within(row).getByLabelText('Approve'))

    await waitFor(() => {
      expect(approveComment).toHaveBeenCalledWith('c1')
    })
    expect(updateComment).not.toHaveBeenCalled()
  })

  it('disapproves an approved comment', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Comments />, { appContext: false })

    await user.click(screen.getByLabelText('Disapprove'))

    await waitFor(() => {
      expect(disapproveComment).toHaveBeenCalledWith('c2')
    })
    expect(updateComment).toHaveBeenCalledWith('c2', { isApproved: false })
  })

  it('deletes a comment', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<Comments />, { appContext: false })

    const row = container.querySelector('tr[data-row-key="c1"]') as HTMLElement
    await user.click(within(row).getByLabelText('Delete'))

    await waitFor(() => {
      expect(deleteComment).toHaveBeenCalledWith('c1')
    })
    expect(removeComment).toHaveBeenCalledWith('c1')
  })

  it('sorts by article title', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<Comments />, { appContext: false })

    await user.click(screen.getByText('By Article'))

    const rows = Array.from(
      container.querySelectorAll('.ant-table-tbody tr[data-row-key]')
    )
    const articleCells = rows.map((row) => {
      const cells = row.querySelectorAll('td')
      return cells[2]?.textContent
    })
    expect(articleCells).toEqual(['Unknown article', 'Article A', 'Article B'])
  })

  it('sorts by latest date', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<Comments />, { appContext: false })

    await user.click(screen.getByText('By Article'))
    await user.click(screen.getByText('Latest'))

    const rows = Array.from(
      container.querySelectorAll('.ant-table-tbody tr[data-row-key]')
    )
    const contents = rows.map((row) => {
      const cells = row.querySelectorAll('td')
      return cells[1]?.textContent
    })
    expect(contents).toEqual([
      'Approved comment',
      'Orphan comment',
      'Pending comment'
    ])
  })
})
