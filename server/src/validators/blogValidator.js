import fs from 'fs'

export const ALLOWED_BLOG_CATEGORIES = ['Technology', 'Startup', 'Lifestyle', 'Finance']

const stripHtml = (html = '') =>
  html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()

const removeUploadedFile = (file) => {
  if (!file?.path) return
  if (fs.existsSync(file.path)) {
    try {
      fs.unlinkSync(file.path)
    } catch {
      // File may already be gone; do not fail the request
    }
  }
}

const sendValidationError = (res, errors) =>
  res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  })

export const validateComment = (req, res, next) => {
  const { blog, name, content } = req.body
  const errors = []

  if (!blog) errors.push('Blog ID is required')
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters')
  if (!content || content.trim().length < 5) errors.push('Content must be at least 5 characters')

  if (errors.length > 0) {
    return sendValidationError(res, errors)
  }

  next()
}

export const validateBlog = (req, res, next) => {
  const { title, subTitle, description, category } = req.body
  const errors = []

  if (!req.file) errors.push('Thumbnail image is required')
  if (!title || title.trim().length < 3) errors.push('Title must be at least 3 characters')
  if (!subTitle || !subTitle.trim()) errors.push('Subtitle is required')
  if (!stripHtml(description || '')) errors.push('Blog description is required')
  if (!category || !ALLOWED_BLOG_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${ALLOWED_BLOG_CATEGORIES.join(', ')}`)
  }

  if (errors.length > 0) {
    removeUploadedFile(req.file)
    return sendValidationError(res, errors)
  }

  next()
}

export const validateGenerate = (req, res, next) => {
  const { title } = req.body
  const errors = []

  if (!title || title.trim().length < 3) errors.push('Title must be at least 3 characters')

  if (errors.length > 0) {
    return sendValidationError(res, errors)
  }

  next()
}

