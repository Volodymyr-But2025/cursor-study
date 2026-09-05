import { Controller } from 'react-hook-form'
import { Form } from 'antd'

export function FormField({
  name,
  control,
  label,
  required = false,
  className,
  children
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const errorId = `${name}-error`
        const hasError = Boolean(fieldState.error)

        return (
          <Form.Item
            label={label}
            required={required}
            validateStatus={hasError ? 'error' : undefined}
            help={fieldState.error?.message}
            className={className}
          >
            {children({
              ...field,
              id: name,
              status: hasError ? 'error' : undefined,
              'aria-invalid': hasError || undefined,
              'aria-describedby': hasError ? errorId : undefined
            })}
          </Form.Item>
        )
      }}
    />
  )
}

export default FormField
