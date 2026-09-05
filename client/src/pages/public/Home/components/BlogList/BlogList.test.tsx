import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import BlogList from './BlogList'

const { navigate } = vi.hoisted(() => ({
  navigate: vi.fn()
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  )
  return {
    ...actual,
    useNavigate: () => navigate
  }
})

const blogs = [
  {
    _id: '1',
    title: 'React Tips',
    category: 'Technology',
    description: '<p>About React</p>',
    image: '/img1.png'
  },
  {
    _id: '2',
    title: 'Startup Life',
    category: 'Startup',
    description: '<p>About startups</p>',
    image: '/img2.png'
  }
]

describe('BlogList', () => {
  it('shows empty state when no blogs match', () => {
    renderWithProviders(<BlogList />, {
      appContext: { blogs: [], input: '' }
    })
    expect(screen.getByText('No blogs found')).toBeInTheDocument()
  })

  it('filters by search input', () => {
    renderWithProviders(<BlogList />, {
      appContext: { blogs, input: 'startup' }
    })
    expect(screen.getByText('Startup Life')).toBeInTheDocument()
    expect(screen.queryByText('React Tips')).not.toBeInTheDocument()
  })

  it('navigates to blog detail on card click', async () => {
    navigate.mockClear()
    const user = userEvent.setup()
    renderWithProviders(<BlogList />, {
      appContext: { blogs, input: '' }
    })

    await user.click(screen.getByText('React Tips'))
    expect(navigate).toHaveBeenCalledWith('/blog/1')
  })

  it('filters by category tab', async () => {
    const user = userEvent.setup()
    renderWithProviders(<BlogList />, {
      appContext: { blogs, input: '' }
    })

    await user.click(screen.getByRole('tab', { name: 'Technology' }))
    expect(screen.getByText('React Tips')).toBeInTheDocument()
    expect(screen.queryByText('Startup Life')).not.toBeInTheDocument()
  })
})
