import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Button, Typography, theme, Form, Flex } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FormField } from '@/components'
import { createNewsletterSchema } from '@/utils/formSchemas'
import { LAYOUT } from '@/constants/ui'
import './NewsletterForm.css'

const { Title, Paragraph } = Typography

function NewsletterForm() {
  const { token } = theme.useToken()
  const { t } = useTranslation()
  const schema = useMemo(() => createNewsletterSchema(t), [t])

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  const onValid = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success(t('newsletter.successMessage'))
    reset()
  }

  return (
    <div
      className="newsletter-form-section"
      style={{
        padding: `${token.paddingXL * 2}px ${token.paddingXL * 2}px`,
        background: token.colorPrimaryBg
      }}
    >
      <Title level={2} style={{ marginBottom: token.marginMD, color: token.colorText }}>
        {t('newsletter.title')}
      </Title>
      <Paragraph
        style={{
          fontSize: token.fontSizeLG,
          color: token.colorTextSecondary,
          marginBottom: token.marginXL
        }}
      >
        {t('newsletter.description')}
      </Paragraph>

      <form
        onSubmit={handleSubmit(onValid)}
        noValidate
        className="newsletter-form-container"
        style={{ maxWidth: LAYOUT.CARD_MAX_WIDTH }}
      >
        <Form layout="vertical" component="div">
          <Flex gap="small" align="flex-start">
            <div style={{ flex: 1 }}>
              <FormField name="email" control={control} required>
                {(field) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder={t('newsletter.placeholder')}
                    aria-label={t('newsletter.placeholder')}
                    styles={{
                      input: {
                        height: token.controlHeightLG + 8,
                        fontSize: token.fontSizeLG
                      }
                    }}
                  />
                )}
              </FormField>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              icon={<MailOutlined />}
              size="large"
              style={{ height: token.controlHeightLG + 8 }}
            >
              {t('common.subscribe')}
            </Button>
          </Flex>
        </Form>
      </form>
    </div>
  )
}

export default NewsletterForm
