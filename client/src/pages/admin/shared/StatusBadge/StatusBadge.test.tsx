import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it.each([
    ['published', 'Published'],
    ['draft', 'Draft'],
    ['approved', 'Approved'],
    ['pending', 'Pending']
  ] as const)('renders %s status', (status, label) => {
    renderWithProviders(<StatusBadge status={status} />, { appContext: false })
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('returns null for unknown status', () => {
    const { container } = renderWithProviders(
      <StatusBadge status="unknown" />,
      { appContext: false }
    )
    expect(container).toBeEmptyDOMElement()
  })
})
