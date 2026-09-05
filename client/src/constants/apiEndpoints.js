export const API_ENDPOINTS = {
  // Blog endpoints
  BLOGS_ALL: '/api/blog/all',
  BLOG_BY_ID: (id) => `/api/blog/${id}`,
  BLOG_CREATE: '/api/blog',
  BLOG_UPDATE: (id) => `/api/blog/${id}`,
  BLOG_DELETE: (id) => `/api/blog/${id}`,
  BLOG_PUBLISH: '/api/blog/publish',
  BLOG_UNPUBLISH: '/api/blog/unpublish',
  BLOG_ADD_COMMENT: '/api/blog/add-comment',
  BLOG_COMMENTS: '/api/blog/comments',
  
  // Admin endpoints
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_BLOGS: '/api/admin/blogs',
  ADMIN_COMMENTS: '/api/admin/comments',
  ADMIN_APPROVE_COMMENT: '/api/admin/approve-comment',
  ADMIN_DISAPPROVE_COMMENT: '/api/admin/disapprove-comment',
  ADMIN_DELETE_COMMENT: '/api/admin/delete-comment'
}

