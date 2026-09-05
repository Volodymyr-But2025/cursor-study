import Comment from '../models/Comment.js'
import Blog from '../models/Blog.js'
import { asyncHandler } from '../helpers/asyncHandler.js'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/messages.js'

export const addComment = asyncHandler(async (req, res) => {
  const { blog, name, content } = req.body

  const blogDoc = await Blog.findById(blog)
  if (!blogDoc) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.BLOG_NOT_FOUND
    })
  }

  const comment = await Comment.create({
    blog,
    name: name.trim(),
    content: content.trim(),
    isApproved: false
  })

  res.status(201).json({
    success: true,
    message: SUCCESS_MESSAGES.COMMENT_ADDED,
    comment
  })
})

export const getBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.body

  const comments = await Comment.find({ blog: blogId, isApproved: true })
    .sort({ createdAt: -1 })
    .lean()

  res.json({
    success: true,
    count: comments.length,
    comments
  })
})

export const getAllCommentsAdmin = asyncHandler(async (req, res) => {
  const comments = await Comment.find({})
    .populate('blog', 'title')
    .sort({ createdAt: -1 })
    .lean()

  res.json({
    success: true,
    count: comments.length,
    comments
  })
})

export const approveComment = asyncHandler(async (req, res) => {
  const { id } = req.body

  const comment = await Comment.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true }
  )

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.COMMENT_NOT_FOUND
    })
  }

  res.json({
    success: true,
    message: SUCCESS_MESSAGES.COMMENT_APPROVED,
    comment
  })
})

export const disapproveComment = asyncHandler(async (req, res) => {
  const { id } = req.body

  const comment = await Comment.findByIdAndUpdate(
    id,
    { isApproved: false },
    { new: true }
  )

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.COMMENT_NOT_FOUND
    })
  }

  res.json({
    success: true,
    message: SUCCESS_MESSAGES.COMMENT_DISAPPROVED,
    comment
  })
})

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.body

  const comment = await Comment.findByIdAndDelete(id)

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.COMMENT_NOT_FOUND
    })
  }

  res.json({
    success: true,
    message: SUCCESS_MESSAGES.COMMENT_DELETED
  })
})
