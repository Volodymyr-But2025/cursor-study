import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import Sidebar from './Sidebar'

describe('Sidebar', () => {
  it('renders four admin navigation items', () => {
    renderWithProviders(<Sidebar />, {
      route: '/admin',
      appContext: { navigate: vi.fn() }
    })

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getAllByText('Add Article').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('All Articles')).toBeInTheDocument()
    expect(screen.getByText('Comments')).toBeInTheDocument()
  })
})
