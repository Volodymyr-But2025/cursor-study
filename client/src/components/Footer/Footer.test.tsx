import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import Footer from './Footer'

describe('Footer', () => {
  const originalPathname = window.location.pathname

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, pathname: originalPathname }
    })
  })

  it('renders quick links and navigates to login', async () => {
    const navigate = vi.fn()
    renderWithProviders(<Footer />, { appContext: { navigate } })

    expect(screen.getByText('All Articles')).toBeInTheDocument()
    expect(screen.getByText('Instagram')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Login'))
    expect(navigate).toHaveBeenCalledWith('/admin')
  })

  it('navigates to register', async () => {
    const navigate = vi.fn()
    renderWithProviders(<Footer />, { appContext: { navigate } })

    await userEvent.click(screen.getByText('Register'))
    expect(navigate).toHaveBeenCalledWith('/register')
  })

  it('scrolls to articles when already on home', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, pathname: '/' }
    })

    const navigate = vi.fn()
    const scrollIntoView = vi.fn()
    const articles = document.createElement('div')
    articles.id = 'articles'
    articles.scrollIntoView = scrollIntoView
    document.body.appendChild(articles)

    renderWithProviders(<Footer />, { appContext: { navigate } })

    await userEvent.click(screen.getByText('All Articles'))
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(navigate).not.toHaveBeenCalled()

    articles.remove()
  })

  it('navigates to home articles hash when not on home', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, pathname: '/blog/1' }
    })

    const navigate = vi.fn()
    renderWithProviders(<Footer />, { appContext: { navigate } })

    await userEvent.click(screen.getByText('All Articles'))
    expect(navigate).toHaveBeenCalledWith({ pathname: '/', hash: 'articles' })
  })
})
