import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import Loader from './Loader'

describe('Loader', () => {
  it('renders a spinner', () => {
    const { container } = renderWithProviders(<Loader />, { appContext: false })
    expect(container.querySelector('.ant-spin')).toBeInTheDocument()
  })
})
