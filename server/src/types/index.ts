/** Shared server types — extend as files migrate from JS to TS */

export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean
  message?: string
  count?: number
  data?: T
}

export interface AuthPayload {
  userId: string
  email: string
  name: string
  role: 'admin' | 'author'
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export {}
