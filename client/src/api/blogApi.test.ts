import { describe, it, expect, vi, beforeEach } from 'vitest'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

vi.mock('./axiosConfig', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

import axios from './axiosConfig'
import { blogApi } from './blogApi'

describe('blogApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAll calls BLOGS_ALL', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { success: true } })
    await blogApi.getAll()
    expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.BLOGS_ALL)
  })

  it('getById calls BLOG_BY_ID', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { success: true } })
    await blogApi.getById('42')
    expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.BLOG_BY_ID('42'))
  })

  it('publish and unpublish post id in body', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { success: true } })
    await blogApi.publish('1')
    await blogApi.unpublish('1')
    expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.BLOG_PUBLISH, { id: '1' })
    expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.BLOG_UNPUBLISH, { id: '1' })
  })

  it('deleteBlog posts to hardcoded delete path', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { success: true } })
    await blogApi.deleteBlog('9')
    expect(axios.post).toHaveBeenCalledWith('/api/blog/delete', { id: '9' })
  })
})
