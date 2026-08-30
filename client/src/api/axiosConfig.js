import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
})

// Request interceptor to add auth token and set Content-Type
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      // Use Bearer token format for proper JWT authentication
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Only set Content-Type to application/json if not FormData
    // FormData needs the browser to set multipart/form-data with boundary
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/api/admin/login')

      if (!isLoginRequest) {
        localStorage.removeItem('token')
        if (window.location.pathname !== '/admin') {
          window.location.href = '/admin'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

