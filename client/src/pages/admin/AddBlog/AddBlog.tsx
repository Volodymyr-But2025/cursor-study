import { useRef } from 'react'
import { Form, Input, Select, Button, Upload, Typography, Flex } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { UploadFile } from 'antd/es/upload/interface'
import { useAppContext } from '@/context/AppContext'
import { useCreateBlog, useBlogGenerator } from '@/hooks'
import { BLOG_CATEGORY_OPTIONS } from '@/constants/categories'
import { ROUTES } from '@/constants/routes'
import { UPLOAD } from '@/constants/ui'
import { isEmptyHtml } from '@/utils/validators'
import toast from 'react-hot-toast'
import BlogEditor from './BlogEditor'
import './AddBlog.css'

const { Title } = Typography

interface AddBlogFormValues {
  title: string
  subTitle: string
  category: string
  description: string
  image: UploadFile[]
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

function AddBlog() {
  const [form] = Form.useForm<AddBlogFormValues>()
  const { t } = useTranslation()
  const { navigate, fetchBlogs } = useAppContext()
  const { createBlog, isCreating } = useCreateBlog()
  const { generateContent, isGenerating } = useBlogGenerator()
  const publishRef = useRef(true)

  const beforeUpload = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(t('messages.error.imageType'))
      return Upload.LIST_IGNORE
    }

    const isLtMax = file.size / 1024 / 1024 < UPLOAD.MAX_SIZE_MB
    if (!isLtMax) {
      toast.error(t('messages.error.imageSize'))
      return Upload.LIST_IGNORE
    }

    return false
  }

  const handleGenerate = async () => {
    const title = form.getFieldValue('title') as string | undefined
    if (!title?.trim()) {
      toast.error(t('messages.error.blogTitle'))
      return
    }

    const result = await generateContent({
      title: title.trim(),
      subTitle: form.getFieldValue('subTitle'),
      category: form.getFieldValue('category')
    })

    if (result.success && result.data?.content) {
      form.setFieldValue('description', result.data.content)
    }
  }

  const handleFinish = async (values: AddBlogFormValues) => {
    const file = values.image?.[0]?.originFileObj
    if (!file) {
      toast.error(t('messages.error.blogThumbnail'))
      return
    }

    const formData = new FormData()
    formData.append('image', file)
    formData.append('title', values.title.trim())
    formData.append('subTitle', values.subTitle.trim())
    formData.append('description', values.description)
    formData.append('category', values.category)
    formData.append('isPublished', String(publishRef.current))

    const result = await createBlog(formData)
    if (result.success) {
      form.resetFields()
      fetchBlogs()
      navigate(ROUTES.ADMIN_ARTICLES)
    }
  }

  return (
    <div className="add-blog">
      <Title level={2} className="add-blog-title">
        {t('admin.addBlog.title')}
      </Title>

      <Form
        form={form}
        layout="vertical"
        className="add-blog-form"
        onFinish={handleFinish}
        initialValues={{ description: '' }}
        disabled={isCreating}
      >
        <Form.Item
          label={t('admin.addBlog.uploadThumbnail')}
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(event) => (Array.isArray(event) ? event : event?.fileList)}
          rules={[{ required: true, message: t('messages.error.blogThumbnail') }]}
        >
          <Upload
            accept="image/jpeg,image/png,image/gif,image/webp"
            listType="picture-card"
            maxCount={1}
            beforeUpload={beforeUpload}
            disabled={isCreating}
            className="add-blog-upload"
          >
            <Flex vertical align="center" gap={4}>
              <PlusOutlined />
              <span>{t('admin.addBlog.uploadButton')}</span>
            </Flex>
          </Upload>
        </Form.Item>

        <Form.Item
          label={t('admin.addBlog.titleLabel')}
          name="title"
          rules={[
            { required: true, message: t('validation.titleRequired') },
            { min: 3, message: t('messages.error.blogTitleMin') }
          ]}
        >
          <Input placeholder={t('admin.addBlog.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('admin.addBlog.subtitleLabel')}
          name="subTitle"
          rules={[{ required: true, message: t('validation.subtitleRequired') }]}
        >
          <Input placeholder={t('admin.addBlog.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('admin.addBlog.categoryLabel')}
          name="category"
          rules={[{ required: true, message: t('validation.categoryRequired') }]}
        >
          <Select
            placeholder={t('admin.addBlog.categoryPlaceholder')}
            options={BLOG_CATEGORY_OPTIONS.map((category) => ({
              value: category,
              label: category
            }))}
          />
        </Form.Item>

        <Form.Item
          label={t('admin.addBlog.bodyLabel')}
          name="description"
          rules={[
            {
              validator: async (_, value: string) => {
                if (isEmptyHtml(value)) {
                  return Promise.reject(new Error(t('validation.bodyRequired')))
                }
              }
            }
          ]}
        >
          <BlogEditor
            placeholder={t('admin.addBlog.titlePlaceholder')}
            disabled={isCreating || isGenerating}
            extra={(
              <Button
                htmlType="button"
                className="add-blog-generate-btn"
                onClick={handleGenerate}
                loading={isGenerating}
                disabled={isCreating || isGenerating}
              >
                {isGenerating ? t('admin.addBlog.generateLoading') : t('admin.addBlog.generateAI')}
              </Button>
            )}
          />
        </Form.Item>

        <Flex gap={12} className="add-blog-actions">
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating && publishRef.current}
            disabled={isCreating || isGenerating}
            onClick={() => {
              publishRef.current = true
            }}
          >
            {t('admin.addBlog.publishButton')}
          </Button>
          <Button
            htmlType="submit"
            loading={isCreating && !publishRef.current}
            disabled={isCreating || isGenerating}
            onClick={() => {
              publishRef.current = false
            }}
          >
            {t('admin.addBlog.saveDraft')}
          </Button>
        </Flex>
      </Form>
    </div>
  )
}

export default AddBlog
