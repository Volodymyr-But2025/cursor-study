import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/messages.js'

// 404 handler - catches unmatched routes
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  })
}

const getUploadError = (err) => {
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return { statusCode: HTTP_STATUS.BAD_REQUEST, message: ERROR_MESSAGES.FILE_TOO_LARGE }
    }
    return { statusCode: HTTP_STATUS.BAD_REQUEST, message: err.message }
  }

  if (err.message?.includes('Invalid file type')) {
    return { statusCode: HTTP_STATUS.BAD_REQUEST, message: ERROR_MESSAGES.INVALID_FILE_TYPE }
  }

  return null
}

// Global error handler
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  const uploadError = getUploadError(err)
  const statusCode = uploadError?.statusCode || err.statusCode || HTTP_STATUS.SERVER_ERROR
  const message = uploadError?.message || err.message || 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

