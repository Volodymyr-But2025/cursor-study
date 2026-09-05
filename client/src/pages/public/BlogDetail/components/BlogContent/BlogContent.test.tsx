import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import BlogContent from './BlogContent'

describe('BlogContent', () => {
  it('sanitizes script tags from content', () => {
    const { container } = renderWithProviders(
      <BlogContent content={'Hello <script>alert(1)</script> world'} />,
      { appContext: false }
    )

    const richText = container.querySelector('.rich-text')
    expect(richText?.innerHTML).toContain('Hello')
    expect(richText?.innerHTML).not.toContain('<script>')
    expect(screen.queryByText('alert(1)')).not.toBeInTheDocument()
  })
})
