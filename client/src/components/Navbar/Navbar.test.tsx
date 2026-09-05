import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import Navbar from './Navbar'

const scrollToTop = vi.fn()

vi.mock('@/utils/helpers', async () => {
  const actual = await vi.importActual<typeof import('@/utils/helpers')>(
    '@/utils/helpers'
  )
  return {
    ...actual,
    scrollToTop: (...args: unknown[]) => scrollToTop(...args)
  }
})

describe('Navbar', () => {
  beforeEach(() => {
    scrollToTop.mockClear()
  })

  it('shows Login and Register when unauthenticated', () => {
    renderWithProviders(<Navbar />, { appContext: { token: null } })

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
  })

  it('shows Dashboard when authenticated', async () => {
    const navigate = vi.fn()
    renderWithProviders(<Navbar />, {
      appContext: { token: 'jwt', navigate }
    })

    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Dashboard' }))
    expect(navigate).toHaveBeenCalledWith('/admin')
  })

  it('scrolls to top on Home when already on home without hash', async () => {
    const navigate = vi.fn()
    renderWithProviders(<Navbar />, {
      route: '/',
      appContext: { token: null, navigate }
    })

    await userEvent.click(screen.getByRole('button', { name: /Home/i }))
    expect(scrollToTop).toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('clears hash and scrolls when Home clicked on home with hash', async () => {
    const navigate = vi.fn()
    renderWithProviders(<Navbar />, {
      route: '/#articles',
      appContext: { token: null, navigate }
    })

    await userEvent.click(screen.getByRole('button', { name: /Home/i }))
    expect(navigate).toHaveBeenCalledWith('/', { replace: true })
    expect(scrollToTop).toHaveBeenCalled()
  })

  it('navigates home when not on home page', async () => {
    const navigate = vi.fn()
    renderWithProviders(<Navbar />, {
      route: '/blog/1',
      appContext: { token: null, navigate }
    })

    await userEvent.click(screen.getByRole('button', { name: /Home/i }))
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('scrolls to articles section when already on home', async () => {
    const navigate = vi.fn()
    const scrollIntoView = vi.fn()
    const articles = document.createElement('div')
    articles.id = 'articles'
    articles.scrollIntoView = scrollIntoView
    document.body.appendChild(articles)

    renderWithProviders(<Navbar />, {
      route: '/',
      appContext: { token: null, navigate }
    })

    await userEvent.click(screen.getByRole('button', { name: 'Articles' }))
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(navigate).not.toHaveBeenCalled()

    articles.remove()
  })

  it('navigates to home with articles hash when not on home', async () => {
    const navigate = vi.fn()
    renderWithProviders(<Navbar />, {
      route: '/blog/1',
      appContext: { token: null, navigate }
    })

    await userEvent.click(screen.getByRole('button', { name: 'Articles' }))
    expect(navigate).toHaveBeenCalledWith({ pathname: '/', hash: 'articles' })
  })

  it('navigates to register when Register clicked', async () => {
    const navigate = vi.fn()
    renderWithProviders(<Navbar />, {
      appContext: { token: null, navigate }
    })

    await userEvent.click(screen.getByRole('button', { name: 'Register' }))
    expect(navigate).toHaveBeenCalledWith('/register')
  })
})
