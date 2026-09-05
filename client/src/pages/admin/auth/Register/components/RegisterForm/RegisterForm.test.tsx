import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import RegisterForm from './RegisterForm'

const { toastMock } = vi.hoisted(() => {
  const toastMock = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn()
  })
  return { toastMock }
})

vi.mock('react-hot-toast', () => ({
  default: toastMock
}))

describe('RegisterForm', () => {
  it('validates password mismatch', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />, { appContext: false })

    const inputs = screen.getAllByPlaceholderText('Password')
    await user.type(screen.getByPlaceholderText('hello@studysprint.com'), 'user@mail.com')
    await user.type(inputs[0]!, 'secret1')
    await user.type(inputs[1]!, 'secret2')
    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
  })

  it('shows coming soon toast on valid submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />, { appContext: false })

    const inputs = screen.getAllByPlaceholderText('Password')
    await user.type(screen.getByPlaceholderText('hello@studysprint.com'), 'user@mail.com')
    await user.type(inputs[0]!, 'secret1')
    await user.type(inputs[1]!, 'secret1')
    await user.click(screen.getByRole('button', { name: 'Register' }))

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalled()
    })
  })
})
