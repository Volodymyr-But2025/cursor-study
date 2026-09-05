import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import Register from './Register'

vi.mock('./components', () => ({
  RegisterForm: () => <div>RegisterForm</div>
}))

describe('Register', () => {
  it('renders title and register form', () => {
    renderWithProviders(<Register />, { appContext: { navigate: vi.fn() } })

    expect(screen.getByText('Register')).toBeInTheDocument()
    expect(screen.getByText('RegisterForm')).toBeInTheDocument()
  })

  it('navigates home when logo is clicked', async () => {
    const navigate = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<Register />, { appContext: { navigate } })

    await user.click(screen.getAllByText('StudySprint')[0]!)
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('navigates to login from link', async () => {
    const navigate = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<Register />, { appContext: { navigate } })

    await user.click(screen.getByText('Log In'))
    expect(navigate).toHaveBeenCalledWith('/admin')
  })
})
