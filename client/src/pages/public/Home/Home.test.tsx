import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import Home from './Home'

vi.mock('@/components', () => ({
  Navbar: () => <div>Navbar</div>,
  Footer: () => <div>Footer</div>
}))

vi.mock('./components', () => ({
  Header: () => <div>Header</div>,
  BlogList: () => <div id="articles">BlogList</div>,
  NewsletterForm: () => <div>Newsletter</div>
}))

describe('Home', () => {
  const scrollIntoView = vi.fn()
  const cancelAnimationFrame = vi.fn()
  let rafCallback: FrameRequestCallback | null = null

  beforeEach(() => {
    scrollIntoView.mockClear()
    cancelAnimationFrame.mockClear()
    rafCallback = null

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb
      return 1
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(cancelAnimationFrame)

    const originalGetElementById = document.getElementById.bind(document)
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'articles') {
        return {
          id: 'articles',
          scrollIntoView
        } as unknown as HTMLElement
      }
      return originalGetElementById(id)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('composes public home sections', () => {
    renderWithProviders(<Home />)

    expect(screen.getByText('Navbar')).toBeInTheDocument()
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('BlogList')).toBeInTheDocument()
    expect(screen.getByText('Newsletter')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('scrolls to articles when hash is #articles', () => {
    renderWithProviders(<Home />, { route: '/#articles' })

    expect(rafCallback).toBeTruthy()
    rafCallback?.(0)
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('cancels animation frame on unmount before raf fires', () => {
    const { unmount } = renderWithProviders(<Home />, { route: '/#articles' })
    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1)
  })
})
