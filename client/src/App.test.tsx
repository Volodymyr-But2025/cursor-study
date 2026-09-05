import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import App from './App'

vi.mock('@/pages', () => ({
  Home: () => <div>Home page</div>,
  BlogDetail: () => <div>Blog detail</div>,
  AdminLayout: () => <div>Admin layout</div>,
  Dashboard: () => <div>Dashboard</div>,
  AddBlog: () => <div>Add blog</div>,
  Articles: () => <div>Articles</div>,
  Comments: () => <div>Comments</div>,
  Login: () => <div>Login page</div>,
  Register: () => <div>Register page</div>,
  ResetPassword: () => <div>Reset page</div>
}))

describe('App', () => {
  it('shows Login on /admin when token is missing', () => {
    renderWithProviders(<App />, {
      route: '/admin',
      appContext: { token: null }
    })

    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('shows AdminLayout on /admin when token exists', () => {
    renderWithProviders(<App />, {
      route: '/admin',
      appContext: { token: 'jwt' }
    })

    expect(screen.getByText('Admin layout')).toBeInTheDocument()
  })

  it('renders home route', () => {
    renderWithProviders(<App />, {
      route: '/',
      appContext: { token: null }
    })

    expect(screen.getByText('Home page')).toBeInTheDocument()
  })

  it('renders blog detail route', () => {
    renderWithProviders(<App />, {
      route: '/blog/42',
      appContext: { token: null }
    })

    expect(screen.getByText('Blog detail')).toBeInTheDocument()
  })

  it('renders register route', () => {
    renderWithProviders(<App />, {
      route: '/register',
      appContext: { token: null }
    })

    expect(screen.getByText('Register page')).toBeInTheDocument()
  })

  it('renders reset password route', () => {
    renderWithProviders(<App />, {
      route: '/reset-password',
      appContext: { token: null }
    })

    expect(screen.getByText('Reset page')).toBeInTheDocument()
  })

  it('renders nested admin articles when authenticated', () => {
    renderWithProviders(<App />, {
      route: '/admin/articles',
      appContext: { token: 'jwt' }
    })

    expect(screen.getByText('Admin layout')).toBeInTheDocument()
  })
})
