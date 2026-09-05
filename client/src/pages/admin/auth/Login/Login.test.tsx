import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import Login from './Login'

vi.mock('./components', () => ({
  LoginForm: () => <div>LoginForm</div>
}))

describe('Login', () => {
  it('renders title and login form', () => {
    renderWithProviders(<Login />, { appContext: { navigate: vi.fn() } })

    expect(screen.getByText('Log In')).toBeInTheDocument()
    expect(screen.getByText('LoginForm')).toBeInTheDocument()
  })

  it('navigates home when logo is clicked', async () => {
    const navigate = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<Login />, { appContext: { navigate } })

    await user.click(screen.getAllByText('StudySprint')[0]!)
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('navigates to register from link', async () => {
    const navigate = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<Login />, { appContext: { navigate } })

    await user.click(screen.getByText('Register'))
    expect(navigate).toHaveBeenCalledWith('/register')
  })
})
