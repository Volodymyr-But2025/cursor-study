import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, Input, Button, Typography, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { useCreateComment } from '@/hooks'
import { FormField } from '@/components'
import { createCommentSchema } from '@/utils/formSchemas'
import './CommentForm.css'

const { Title, Text } = Typography
const { TextArea } = Input

function CommentForm({ blogId, onSubmitted }) {
  const { token, user } = useAppContext()
  const { createComment, isCreating } = useCreateComment()
  const { t } = useTranslation()

  const authorName = token ? user?.name : null
  const showNameField = !authorName

  const schema = useMemo(
    () => createCommentSchema(t, { requireName: showNameField }),
    [t, showNameField]
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      content: ''
    }
  })

  const onValid = async (values) => {
    const name = authorName || values.name?.trim()

    const result = await createComment({
      blog: blogId,
      name,
      content: values.content.trim()
    })

    if (result?.success) {
      reset()
      if (onSubmitted) {
        onSubmitted()
      }
    }
  }

  const isLoading = isCreating || isSubmitting

  return (
    <Flex vertical className="comment-form">
      <Title level={2} className="comment-form-title">
        {t('blogDetail.comments.title')}
      </Title>

      <Text strong className="comment-form-subtitle">
        {t('blogDetail.comments.leaveComment')}
      </Text>

      <form
        onSubmit={handleSubmit(onValid)}
        noValidate
        className="comment-form-fields"
      >
        <Form layout="vertical" component="div">
          {showNameField && (
            <FormField
              name="name"
              control={control}
              required
            >
              {(field) => (
                <Input
                  {...field}
                  size="large"
                  placeholder={t('blogDetail.comments.namePlaceholder')}
                  aria-label={t('blogDetail.comments.namePlaceholder')}
                />
              )}
            </FormField>
          )}

          <FormField
            name="content"
            control={control}
            required
          >
            {(field) => (
              <TextArea
                {...field}
                rows={6}
                placeholder={t('blogDetail.comments.commentPlaceholder')}
                aria-label={t('blogDetail.comments.commentPlaceholder')}
                maxLength={1000}
              />
            )}
          </FormField>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
            >
              {t('blogDetail.comments.submit')}
            </Button>
          </Form.Item>
        </Form>
      </form>
    </Flex>
  )
}

export default CommentForm
