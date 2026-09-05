import express from 'express'
import { 
  adminLogin, 
  getAllBlogsAdmin, 
  getDashboard 
} from '../controllers/adminController.js'
import {
  getAllCommentsAdmin,
  approveComment,
  disapproveComment,
  deleteComment
} from '../controllers/commentController.js'
import auth from '../middleware/auth.js'
import { loginLimiter } from '../middleware/rateLimiter.js'
import { validateCommentId } from '../validators/commentValidator.js'

const adminRouter = express.Router()

// Apply strict rate limiting to login endpoint
adminRouter.post('/login', loginLimiter, adminLogin)

// Apply auth middleware to all routes below this point
adminRouter.use(auth)

adminRouter.get('/dashboard', getDashboard)
adminRouter.get('/blogs', getAllBlogsAdmin)
adminRouter.get('/comments', getAllCommentsAdmin)
adminRouter.post('/approve-comment', validateCommentId, approveComment)
adminRouter.post('/disapprove-comment', validateCommentId, disapproveComment)
adminRouter.post('/delete-comment', validateCommentId, deleteComment)

export default adminRouter