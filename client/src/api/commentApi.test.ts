import { describe, it, expect, vi, beforeEach } from 'vitest'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

vi.mock('./axiosConfig', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

import axios from './axiosConfig'
import { commentApi } from './commentApi'

describe('commentApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('create posts comment payload', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { success: true } })
    const payload = { blog: '1', name: 'Ann', content: 'Hi' }
    await commentApi.create(payload)
    expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.BLOG_ADD_COMMENT, payload)
  })

  it('getByBlog posts blogId', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { success: true } })
    await commentApi.getByBlog('blog-1')
    expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.BLOG_COMMENTS, {
      blogId: 'blog-1'
    })
  })
})
