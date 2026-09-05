import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from 'antd'
import { FormField } from './FormField'
import { renderWithProviders } from '@/test/renderWithProviders'

function TestForm() {
  const { control, setError } = useForm({
    defaultValues: { email: '' }
  })

  useEffect(() => {
    setError('email', { type: 'manual', message: 'Email is required' })
  }, [setError])

  return (
    <FormField name="email" control={control} label="Email" required>
      {(field) => <Input {...field} aria-label="Email" />}
    </FormField>
  )
}

describe('FormField', () => {
  it('exposes aria-invalid and help text on error', async () => {
    renderWithProviders(<TestForm />, { appContext: false })

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    })
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })
})
