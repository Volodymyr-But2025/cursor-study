import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, Input, Button, Typography } from 'antd'
import { MailOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FormField } from '@/components'
import { createRegisterSchema } from '@/utils/formSchemas'

const { Text } = Typography

function RegisterForm() {
  const { t } = useTranslation()
  const schema = useMemo(() => createRegisterSchema(t), [t])

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onValid = async () => {
    toast(t('messages.info.registrationComingSoon'))
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

        <FormField
          name="password"
          control={control}
          label={<Text>{t('auth.login.passwordLabel')}</Text>}
          required
          className="auth-form-item"
        >
          {(field) => (
            <Input.Password
              {...field}
              placeholder={t('auth.login.passwordPlaceholder')}
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              size="large"
            />
          )}
        </FormField>

        <FormField
          name="confirmPassword"
          control={control}
          label={<Text>{t('auth.register.repeatPasswordLabel')}</Text>}
          required
          className="auth-form-item"
        >
          {(field) => (
            <Input.Password
              {...field}
              placeholder={t('auth.login.passwordPlaceholder')}
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
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
            {t('auth.register.submitButton')}
          </Button>
        </Form.Item>
      </Form>
    </form>
  )
}

export default RegisterForm
