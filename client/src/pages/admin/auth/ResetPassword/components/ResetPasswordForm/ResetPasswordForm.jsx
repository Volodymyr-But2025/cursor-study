import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, Input, Button, Typography } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { FormField } from '@/components'
import { createResetPasswordSchema } from '@/utils/formSchemas'

const { Text } = Typography

function ResetPasswordForm() {
  const { navigate } = useAppContext()
  const { t } = useTranslation()
  const schema = useMemo(() => createResetPasswordSchema(t), [t])

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  const onValid = async () => {
    toast.success(t('auth.resetPassword.successMessage'))
    setTimeout(() => {
      navigate(ROUTES.ADMIN)
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate>
      <Form layout="vertical" component="div">
        <FormField
          name="email"
          control={control}
          label={<Text>{t('auth.login.emailLabel')}</Text>}
          required
          className="auth-form-item"
        >
          {(field) => (
            <Input
              {...field}
              placeholder={t('auth.login.emailPlaceholder')}
              suffix={<MailOutlined className="auth-input-icon" />}
              size="large"
            />
          )}
        </FormField>

        <Form.Item className="auth-form-item-small">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            size="large"
          >
            {t('auth.resetPassword.submitButton')}
          </Button>
        </Form.Item>
      </Form>
    </form>
  )
}

export default ResetPasswordForm
