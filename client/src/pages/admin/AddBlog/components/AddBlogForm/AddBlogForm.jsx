import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, Input, Select, Upload, Button, Typography, Flex, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { UPLOAD, DEFAULTS } from '@/constants/ui'
import { useBlogGenerator, useCreateBlog } from '@/hooks'
import { FormField } from '@/components'
import { createBlogSchema } from '@/utils/formSchemas'
import '../../../shared/AdminTable.css'
import '../../AddBlog.css'

const { Text } = Typography

function AddBlogForm() {
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const { t } = useTranslation()

  const [imagePreview, setImagePreview] = useState(null)
  const [fileList, setFileList] = useState([])

  const { generateContent, isGenerating } = useBlogGenerator()
  const { createBlog, isCreating } = useCreateBlog()

  const schema = useMemo(() => createBlogSchema(t), [t])

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { isSubmitting }
  } = useForm({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      subTitle: '',
      category: DEFAULTS.CATEGORY,
      description: '',
      image: null
    }
  })

  const isBusy = isCreating || isSubmitting || isGenerating

  const resetFormState = () => {
    reset({
      title: '',
      subTitle: '',
      category: DEFAULTS.CATEGORY,
      description: '',
      image: null
    })
    setFileList([])
    setImagePreview(null)
    if (quillRef.current) {
      quillRef.current.root.innerHTML = ''
    }
  }

  const submitBlog = async (values, isPublished) => {
    const blog = {
      title: values.title,
      subTitle: values.subTitle,
      description: values.description,
      category: values.category,
      isPublished
    }

    const result = await createBlog(blog, values.image)

    if (result?.success) {
      resetFormState()
    }
  }

  const onPublish = (values) => submitBlog(values, true)
  const onDraft = (values) => submitBlog(values, false)

  const handleGenerateContent = async () => {
    const title = getValues('title')
    if (!title?.trim()) {
      toast.error(t('messages.error.blogTitle'))
      return
    }

    const result = await generateContent(title)
    if (result.success && quillRef.current) {
      quillRef.current.root.innerHTML = result.content
      setValue('description', result.content, {
        shouldValidate: true,
        shouldDirty: true
      })
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: t('admin.addBlog.titlePlaceholder')
      })

      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML
        setValue('description', html, {
          shouldValidate: true,
          shouldDirty: true
        })
      })
    }
  }, [t, setValue])

  return (
    <form
      onSubmit={handleSubmit(onPublish)}
      noValidate
      className="admin-add-blog-form"
    >
      <Form layout="vertical" component="div">
        <Controller
          name="image"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              label={t('admin.addBlog.uploadThumbnail')}
              required
              validateStatus={fieldState.error ? 'error' : undefined}
              help={fieldState.error?.message}
            >
              <Upload
                listType="picture-card"
                className="admin-upload"
                maxCount={1}
                accept={UPLOAD.ACCEPTED_TYPES}
                showUploadList={false}
                fileList={fileList}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/')
                  if (!isImage) {
                    setError('image', {
                      type: 'manual',
                      message: t('messages.error.imageType')
                    })
                    return false
                  }

                  const isLt5M = file.size / 1024 / 1024 < UPLOAD.MAX_SIZE_MB
                  if (!isLt5M) {
                    setError('image', {
                      type: 'manual',
                      message: t('messages.error.imageSize')
                    })
                    return false
                  }

                  const reader = new FileReader()
                  reader.onload = (e) => {
                    setImagePreview(e.target.result)
                  }
                  reader.readAsDataURL(file)

                  clearErrors('image')
                  field.onChange(file)
                  setFileList([file])
                  return false
                }}
                onRemove={() => {
                  field.onChange(null)
                  setFileList([])
                  setImagePreview(null)
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="admin-upload-preview"
                  />
                ) : (
                  <Flex vertical align="center" justify="center">
                    <PlusOutlined />
                    <Text className="admin-upload-text">
                      {t('admin.addBlog.uploadButton')}
                    </Text>
                  </Flex>
                )}
              </Upload>
            </Form.Item>
          )}
        />

        <FormField
          name="title"
          control={control}
          label={t('admin.addBlog.titleLabel')}
          required
        >
          {(field) => (
            <Input
              {...field}
              placeholder={t('admin.addBlog.titlePlaceholder')}
            />
          )}
        </FormField>

        <FormField
          name="subTitle"
          control={control}
          label={t('admin.addBlog.subtitleLabel')}
          required
        >
          {(field) => (
            <Input
              {...field}
              placeholder={t('admin.addBlog.titlePlaceholder')}
            />
          )}
        </FormField>

        <FormField
          name="category"
          control={control}
          label={t('admin.addBlog.categoryLabel')}
          required
        >
          {(field) => (
            <Select
              {...field}
              placeholder={t('admin.addBlog.categoryPlaceholder')}
            >
              {BLOG_CATEGORIES.filter((cat) => cat !== 'All').map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          )}
        </FormField>

        <Controller
          name="description"
          control={control}
          render={({ fieldState }) => (
            <Form.Item
              label={t('admin.addBlog.bodyLabel')}
              required
              validateStatus={fieldState.error ? 'error' : undefined}
              help={fieldState.error?.message}
            >
              <div className="admin-editor-wrapper">
                <div ref={editorRef} className="admin-editor" />
                <Button
                  size="small"
                  onClick={handleGenerateContent}
                  loading={isGenerating}
                  disabled={isBusy}
                  className="admin-editor-ai-button"
                >
                  {t('admin.addBlog.generateAI')}
                </Button>
              </div>
            </Form.Item>
          )}
        />

        <Form.Item className="admin-form-actions-item">
          <Space size="middle">
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isSubmitting}
              disabled={isBusy}
            >
              {t('admin.addBlog.publishButton')}
            </Button>
            <Button
              onClick={handleSubmit(onDraft)}
              loading={isCreating || isSubmitting}
              disabled={isBusy}
              className="admin-draft-button"
            >
              {t('admin.addBlog.saveDraft')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </form>
  )
}

export default AddBlogForm
