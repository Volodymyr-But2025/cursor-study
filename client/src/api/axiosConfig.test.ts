import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import axiosInstance from './axiosConfig'

describe('axiosConfig', () => {
  const originalLocation = window.location

  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, pathname: '/admin/articles', href: '' }
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation
    })
  })

  async function runRequest(configOverrides: Record<string, unknown> = {}) {
    const captured: { config?: Record<string, unknown> } = {}

    const adapter = async (config: Record<string, unknown>) => {
      captured.config = config
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      }
    }

    const response = await axiosInstance.request({
      url: '/api/test',
      method: 'get',
      adapter,
      ...configOverrides
    })

    return { response, captured }
  }

  it('adds Bearer token from localStorage', async () => {
    localStorage.setItem('token', 'jwt-token')
    const { captured } = await runRequest()
    expect((captured.config?.headers as Record<string, string>).Authorization).toBe(
      'Bearer jwt-token'
    )
  })

  it('sets JSON Content-Type for non-FormData bodies', async () => {
    const { captured } = await runRequest({ data: { a: 1 }, method: 'post' })
    expect((captured.config?.headers as Record<string, string>)['Content-Type']).toBe(
      'application/json'
    )
  })

  it('does not force JSON Content-Type for FormData', async () => {
    const formData = new FormData()
    formData.append('x', '1')
    const { captured } = await runRequest({ data: formData, method: 'post' })
    expect((captured.config?.headers as Record<string, string>)['Content-Type']).not.toBe(
      'application/json'
    )
  })

  it('clears token and redirects on 401 outside login', async () => {
    localStorage.setItem('token', 'expired')

    const adapter = async (config: Record<string, unknown>) => {
      const error = Object.assign(new Error('Unauthorized'), {
        config,
        response: { status: 401, data: { message: 'Unauthorized' } }
      })
      throw error
    }

    await expect(
      axiosInstance.request({ url: '/api/admin/blogs', method: 'get', adapter })
    ).rejects.toBeTruthy()

    expect(localStorage.getItem('token')).toBeNull()
    expect(window.location.href).toBe('/admin')
  })

  it('does not redirect on 401 for login request', async () => {
    localStorage.setItem('token', 'expired')
    window.location.pathname = '/admin'

    const adapter = async (config: Record<string, unknown>) => {
      const error = Object.assign(new Error('Unauthorized'), {
        config,
        response: { status: 401, data: { message: 'bad credentials' } }
      })
      throw error
    }

    await expect(
      axiosInstance.request({ url: '/api/admin/login', method: 'post', adapter })
    ).rejects.toBeTruthy()

    expect(localStorage.getItem('token')).toBe('expired')
  })
})
