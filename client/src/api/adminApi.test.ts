import { describe, it, expect, vi, beforeEach } from 'vitest'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

vi.mock('./axiosConfig', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

import axios from './axiosConfig'
import { adminApi } from './adminApi'

describe('adminApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login posts credentials', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { success: true } })
    const credentials = { email: 'a@b.com', password: 'x' }
    await adminApi.login(credentials)
    expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN_LOGIN, credentials)
  })

  it('getStats and getComments use GET endpoints', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { success: true } })
    await adminApi.getStats()
    await adminApi.getComments()
    expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN_STATS)
    expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN_COMMENTS)
  })

  it('approve/disapprove/delete comment post id', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { success: true } })
    await adminApi.approveComment('c1')
    await adminApi.disapproveComment('c1')
    await adminApi.deleteComment('c1')
    expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN_APPROVE_COMMENT, {
      id: 'c1'
    })
    expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN_DISAPPROVE_COMMENT, {
      id: 'c1'
    })
    expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN_DELETE_COMMENT, {
      id: 'c1'
    })
  })
})
