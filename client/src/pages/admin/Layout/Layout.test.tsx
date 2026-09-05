import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import { renderWithProviders } from '@/test/renderWithProviders'
import Layout from './Layout'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

vi.mock('./components', () => ({
  Sidebar: () => <div>Sidebar</div>
}))

import toast from 'react-hot-toast'

describe('Layout', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'jwt')
  })

  it('logs out, clears token, and navigates home', async () => {
    const setToken = vi.fn()
    const navigate = vi.fn()

    renderWithProviders(
      <Routes>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<div>Dashboard page</div>} />
        </Route>
      </Routes>,
      {
        route: '/admin',
        appContext: { setToken, navigate, token: 'jwt' }
      }
    )

    await userEvent.click(screen.getByRole('button', { name: 'Log Out' }))

    expect(localStorage.getItem('token')).toBeNull()
    expect(setToken).toHaveBeenCalledWith(null)
    expect(navigate).toHaveBeenCalledWith('/')
    expect(toast.success).toHaveBeenCalled()
  })
})
