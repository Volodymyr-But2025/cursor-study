import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import LoginForm from './LoginForm'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('@/api', () => ({
  adminApi: {
    login: vi.fn()
  }
}))

import toast from 'react-hot-toast'
import { adminApi } from '@/api'

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.click(screen.getByRole('button', { name: 'Log In' }))

    expect(await screen.findByText('Please enter your email')).toBeInTheDocument()
  })

  it('sets token and navigates on successful login', async () => {
    vi.mocked(adminApi.login).mockResolvedValue({
      data: { success: true, token: 'new-jwt' }
    } as never)

    const setToken = vi.fn()
    const navigate = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(<LoginForm />, { appContext: { setToken, navigate } })

    await user.type(screen.getByPlaceholderText('hello@studysprint.com'), 'admin@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'secret')
    await user.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() => {
      expect(setToken).toHaveBeenCalledWith('new-jwt')
    })
    expect(localStorage.getItem('token')).toBe('new-jwt')
    expect(navigate).toHaveBeenCalledWith('/admin')
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows toast.error when login returns success false', async () => {
    vi.mocked(adminApi.login).mockResolvedValue({
      data: { success: false, message: 'Invalid credentials' }
    } as never)

    const setToken = vi.fn()
    const navigate = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(<LoginForm />, { appContext: { setToken, navigate } })

    await user.type(screen.getByPlaceholderText('hello@studysprint.com'), 'admin@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'secret')
    await user.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials')
    })
    expect(setToken).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('shows toast.error from catch with response message', async () => {
    vi.mocked(adminApi.login).mockRejectedValue({
      response: { data: { message: 'Server unavailable' } }
    })

    const setToken = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(<LoginForm />, { appContext: { setToken } })

    await user.type(screen.getByPlaceholderText('hello@studysprint.com'), 'admin@example.com')
    await user.type(screen.getByPlaceholderText('Password'), 'secret')
    await user.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Server unavailable')
    })
    expect(setToken).not.toHaveBeenCalled()
  })

  it('navigates to reset password', async () => {
    const navigate = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(<LoginForm />, { appContext: { navigate } })

    await user.click(screen.getByText('Reset'))
    expect(navigate).toHaveBeenCalledWith('/reset-password')
  })
})
