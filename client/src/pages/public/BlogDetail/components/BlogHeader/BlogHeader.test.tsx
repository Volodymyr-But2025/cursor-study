import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import BlogHeader from './BlogHeader'

describe('BlogHeader', () => {
  it('renders title, category, and subtitle', () => {
    renderWithProviders(
      <BlogHeader
        blog={{
          title: 'Deep Dive',
          category: 'Technology',
          subTitle: 'A closer look',
          image: '/cover.png'
        }}
      />,
      { appContext: false }
    )

    expect(screen.getByRole('heading', { name: 'Deep Dive' })).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('A closer look')).toBeInTheDocument()
  })
})
