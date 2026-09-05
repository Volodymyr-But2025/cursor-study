import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import User from '../models/User.js'
import { transformBlogImage, transformBlogsImages } from '../utils/imageUrl.js'
import { asyncHandler } from '../helpers/asyncHandler.js'

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email, isActive: true })

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid Credentials' })
  }

  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid Credentials' })
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    success: true,
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
})

export const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 })
  res.json({
    success: true,
    count: blogs.length,
    blogs: transformBlogsImages(blogs, req)
  })
})

export const getDashboard = asyncHandler(async (req, res) => {
  const [recentBlogs, recentComments, blogs, drafts, comments, pendingComments] =
    await Promise.all([
      Blog.find({}).sort({ createdAt: -1 }).limit(6).lean(),
      Comment.find({})
        .populate('blog', 'title')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Blog.countDocuments(),
      Blog.countDocuments({ isPublished: false }),
      Comment.countDocuments(),
      Comment.countDocuments({ isApproved: false })
    ])

  const transformedBlogs = recentBlogs.map((blog) => transformBlogImage(blog, req))

  const dashboardData = {
    blogs,
    drafts,
    comments,
    pendingComments,
    recentBlogs: transformedBlogs,
    recentComments
  }

  res.json({ success: true, dashboardData })
})
