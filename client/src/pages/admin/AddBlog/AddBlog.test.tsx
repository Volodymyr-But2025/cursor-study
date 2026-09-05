import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import AddBlog from './AddBlog'

vi.mock('./components', () => ({
  AddBlogForm: () => <div>AddBlogForm</div>
}))

describe('AddBlog', () => {
  it('renders title and form', () => {
    renderWithProviders(<AddBlog />, { appContext: false })

    expect(screen.getByText('Add Article')).toBeInTheDocument()
    expect(screen.getByText('AddBlogForm')).toBeInTheDocument()
  })
})
