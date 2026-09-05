import React from 'react'
import { Form, Input, Button, Typography, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { useCreateComment } from '@/hooks'
import toast from 'react-hot-toast'
import './CommentForm.css'

const { Title, Text } = Typography
const { TextArea } = Input

function CommentForm({ blogId, onSubmitted }) {
  const [form] = Form.useForm()
  const { token, user } = useAppContext()
  const { createComment, isCreating } = useCreateComment()
  const { t } = useTranslation()

  const authorName = token ? user?.name : null
  const showNameField = !authorName

  const handleFinish = async (values) => {
    const name = authorName || values.name?.trim()

    if (!name) {
      toast.error(t('validation.nameRequired'))
      return
    }

    const result = await createComment({
      blog: blogId,
      name,
      content: values.content.trim()
    })

    if (result?.success) {
      form.resetFields()
      if (onSubmitted) {
        onSubmitted()
      }
    }
  }

  return (
    <Flex vertical className="comment-form">
      <Title level={2} className="comment-form-title">
        {t('blogDetail.comments.title')}
      </Title>

      <Text strong className="comment-form-subtitle">
        {t('blogDetail.comments.leaveComment')}
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="comment-form-fields"
      >
        {showNameField && (
          <Form.Item
            name="name"
            rules={[
              { required: true, message: t('validation.nameRequired') },
              { min: 2, message: t('validation.nameMin') }
            ]}
          >
            <Input
              size="large"
              placeholder={t('blogDetail.comments.namePlaceholder')}
              aria-label={t('blogDetail.comments.namePlaceholder')}
            />
          </Form.Item>
        )}

        <Form.Item
          name="content"
          rules={[
            { required: true, message: t('validation.commentRequired') }
          ]}
        >
          <TextArea
            rows={6}
            placeholder={t('blogDetail.comments.commentPlaceholder')}
            aria-label={t('blogDetail.comments.commentPlaceholder')}
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isCreating}
          >
            {t('blogDetail.comments.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  )
}

export default CommentForm
