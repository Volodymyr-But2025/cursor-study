import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, Input, Button, Typography, Flex } from 'antd'
import { MailOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { adminApi } from '@/api'
import { FormField } from '@/components'
import { createLoginSchema } from '@/utils/formSchemas'

const { Text, Link } = Typography

function LoginForm() {
  const { setToken, navigate } = useAppContext()
  const { t } = useTranslation()

  const schema = useMemo(() => createLoginSchema(t), [t])

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onValid = async (values) => {
    try {
      const response = await adminApi.login({
        email: values.email,
        password: values.password
      })

      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem('token', response.data.token)
        toast.success(t('messages.success.login'))
        navigate(ROUTES.ADMIN)
      } else {
        toast.error(response.data.message || t('messages.error.login'))
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || t('messages.error.login')
      )
    }
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
          className="auth-form-item-small"
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

        <Flex justify="flex-end" className="auth-forgot-password">
          <Text className="auth-forgot-password-text">
            {t('auth.login.forgotPassword')}{' '}
            <Link
              onClick={() => navigate('/reset-password')}
              className="auth-link-warning"
            >
              {t('auth.login.reset')}
            </Link>
          </Text>
        </Flex>

        <Form.Item className="auth-form-item-small">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            size="large"
          >
            {t('auth.login.submitButton')}
          </Button>
        </Form.Item>
      </Form>
    </form>
  )
}

export default LoginForm
