import mongoose from 'mongoose'

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

export const validateAddComment = (req, res, next) => {
  const { blog, name, content } = req.body
  const errors = []

  if (!blog || !isValidObjectId(blog)) {
    errors.push('Valid blog id is required')
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  } else if (name.trim().length > 50) {
    errors.push('Name must be at most 50 characters')
  }

  if (!content || typeof content !== 'string' || content.trim().length < 1) {
    errors.push('Comment content is required')
  } else if (content.trim().length > 1000) {
    errors.push('Comment must be at most 1000 characters')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  next()
}

export const validateBlogId = (req, res, next) => {
  const { blogId } = req.body

  if (!blogId || !isValidObjectId(blogId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid blog id is required'
    })
  }

  next()
}

export const validateCommentId = (req, res, next) => {
  const { id } = req.body

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Valid comment id is required'
    })
  }

  next()
}
