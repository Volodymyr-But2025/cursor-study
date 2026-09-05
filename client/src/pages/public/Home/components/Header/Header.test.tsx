import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import Header from './Header'

describe('Header', () => {
  it('writes search value into AppContext', async () => {
    const setInput = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(<Header />, { appContext: { setInput, input: '' } })

    const search = screen.getByPlaceholderText('Search for blogs...')
    await user.type(search, 'react')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(setInput).toHaveBeenCalledWith('react')
  })

  it('shows clear button when input is set', async () => {
    const setInput = vi.fn()
    renderWithProviders(<Header />, { appContext: { setInput, input: 'query' } })

    await userEvent.click(screen.getByRole('button', { name: 'Clear Search' }))
    expect(setInput).toHaveBeenCalledWith('')
  })
})
