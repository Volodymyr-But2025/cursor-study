import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import ResetPasswordForm from './ResetPasswordForm'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

import toast from 'react-hot-toast'

describe('ResetPasswordForm', () => {
  it('shows validation for invalid email', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ResetPasswordForm />)

    await user.type(screen.getByPlaceholderText('hello@studysprint.com'), 'bad')
    await user.click(screen.getByRole('button', { name: 'Send reset link' }))

    expect(await screen.findByText('Please enter a valid email')).toBeInTheDocument()
  })

  it('toasts success for valid email', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ResetPasswordForm />)

    await user.type(screen.getByPlaceholderText('hello@studysprint.com'), 'ok@mail.com')
    await user.click(screen.getByRole('button', { name: 'Send reset link' }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'If the email exists, a reset link has been sent!'
      )
    })
  })
})
