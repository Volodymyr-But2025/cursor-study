import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const commentApi = {
  create: async ({ blog, name, content }) => {
    return await axios.post(API_ENDPOINTS.BLOG_ADD_COMMENT, { blog, name, content })
  },

  getByBlog: async (blogId) => {
    return await axios.post(API_ENDPOINTS.BLOG_COMMENTS, { blogId })
  }
}
