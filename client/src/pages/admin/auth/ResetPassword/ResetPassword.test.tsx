import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import ResetPassword from './ResetPassword'

vi.mock('./components', () => ({
  ResetPasswordForm: () => <div>ResetPasswordForm</div>
}))

describe('ResetPassword', () => {
  it('renders title and form', () => {
    renderWithProviders(<ResetPassword />, { appContext: { navigate: vi.fn() } })

    expect(screen.getByText('Reset Password')).toBeInTheDocument()
    expect(screen.getByText('ResetPasswordForm')).toBeInTheDocument()
  })

  it('navigates home when logo is clicked', async () => {
    const navigate = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<ResetPassword />, { appContext: { navigate } })

    await user.click(screen.getAllByText('StudySprint')[0]!)
    expect(navigate).toHaveBeenCalledWith('/')
  })
})
