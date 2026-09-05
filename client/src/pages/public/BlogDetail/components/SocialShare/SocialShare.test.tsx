import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import SocialShare from './SocialShare'

describe('SocialShare', () => {
  it('renders three share buttons', () => {
    renderWithProviders(<SocialShare />, { appContext: false })

    expect(screen.getByLabelText('Facebook')).toBeInTheDocument()
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
    expect(screen.getByLabelText('Google Plus')).toBeInTheDocument()
  })
})
