import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import CommentForm from './CommentForm'

const createComment = vi.fn()

vi.mock('@/hooks', () => ({
  useCreateComment: () => ({
    createComment,
    isCreating: false
  })
}))

describe('CommentForm', () => {
  beforeEach(() => {
    createComment.mockReset()
    createComment.mockResolvedValue({ success: true })
  })

  it('shows name field for guests and submits comment', async () => {
    const onSubmitted = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(
      <CommentForm blogId="blog-1" onSubmitted={onSubmitted} />,
      { appContext: { token: null, user: null } }
    )

    expect(screen.getByLabelText('Your name')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Your name'), 'Guest')
    await user.type(screen.getByLabelText('Your comment'), 'Nice post')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(createComment).toHaveBeenCalledWith({
        blog: 'blog-1',
        name: 'Guest',
        content: 'Nice post'
      })
    })
    expect(onSubmitted).toHaveBeenCalled()
  })

  it('hides name field when user is authenticated', () => {
    renderWithProviders(<CommentForm blogId="blog-1" />, {
      appContext: { token: 'jwt', user: { name: 'Ada' } }
    })

    expect(screen.queryByLabelText('Your name')).not.toBeInTheDocument()
  })
})
