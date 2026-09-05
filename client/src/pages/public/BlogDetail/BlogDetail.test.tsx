import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test/renderWithProviders'
import BlogDetail from './BlogDetail'

vi.mock('@/hooks', () => ({
  useBlog: vi.fn(),
  useComments: vi.fn()
}))

vi.mock('@/components', () => ({
  Navbar: () => <div>Navbar</div>,
  Footer: () => <div>Footer</div>,
  Loader: () => <div>Loader</div>
}))

vi.mock('./components', () => ({
  BlogHeader: ({ blog }: { blog: { title: string } }) => <div>{blog.title}</div>,
  BlogContent: () => <div>Content</div>,
  CommentForm: () => <div>CommentForm</div>,
  CommentList: () => <div>CommentList</div>
}))

import { useBlog, useComments } from '@/hooks'

describe('BlogDetail', () => {
  it('shows loader while blog is loading', () => {
    vi.mocked(useBlog).mockReturnValue({
      blog: null,
      loading: true,
      error: null,
      refetch: vi.fn()
    })
    vi.mocked(useComments).mockReturnValue({
      comments: [],
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithProviders(
      <Routes>
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>,
      { route: '/blog/1', appContext: false }
    )

    expect(screen.getByText('Loader')).toBeInTheDocument()
  })

  it('renders blog content when loaded', () => {
    vi.mocked(useBlog).mockReturnValue({
      blog: { _id: '1', title: 'Loaded Post', description: '<p>Hi</p>' },
      loading: false,
      error: null,
      refetch: vi.fn()
    })
    vi.mocked(useComments).mockReturnValue({
      comments: [],
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithProviders(
      <Routes>
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>,
      { route: '/blog/1' }
    )

    expect(screen.getByText('Loaded Post')).toBeInTheDocument()
    expect(screen.getByText('CommentForm')).toBeInTheDocument()
  })
})
