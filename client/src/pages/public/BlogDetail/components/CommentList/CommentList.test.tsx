import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import CommentList from './CommentList'

describe('CommentList', () => {
  it('shows spinner while loading', () => {
    const { container } = renderWithProviders(
      <CommentList comments={[]} loading />,
      { appContext: false }
    )
    expect(container.querySelector('.ant-spin')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    renderWithProviders(<CommentList comments={[]} loading={false} />, {
      appContext: false
    })
    expect(screen.getByText('No comments yet')).toBeInTheDocument()
  })

  it('renders comments', () => {
    renderWithProviders(
      <CommentList
        loading={false}
        comments={[
          {
            _id: '1',
            name: 'Ann',
            content: 'Great article',
            createdAt: '2024-01-15T12:00:00.000Z'
          }
        ]}
      />,
      { appContext: false }
    )

    expect(screen.getByText('Ann')).toBeInTheDocument()
    expect(screen.getByText('Great article')).toBeInTheDocument()
  })
})
