/** Shared client types — extend as files migrate from JS to TS */

export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean
  message?: string
  count?: number
  data?: T
}

export interface Blog {
  _id: string
  title: string
  content: string
  category: string
  image?: string
  authorName: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  _id: string
  blogId: string
  name: string
  email: string
  content: string
  isApproved: boolean
  createdAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'author'
  isActive: boolean
}
