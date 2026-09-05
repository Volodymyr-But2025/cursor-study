import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import NewsletterForm from './NewsletterForm'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

import toast from 'react-hot-toast'

describe('NewsletterForm', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderWithProviders(<NewsletterForm />, { appContext: false })

    await user.type(screen.getByLabelText('Enter your email id'), 'bad')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    expect(await screen.findByText(/emailInvalid|valid email/i)).toBeInTheDocument()
  })

  it('toasts success for valid email', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderWithProviders(<NewsletterForm />, { appContext: false })

    await user.type(screen.getByLabelText('Enter your email id'), 'ok@mail.com')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    await vi.advanceTimersByTimeAsync(1000)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Successfully subscribed to newsletter!'
      )
    })
  })
})
