import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axios, blogApi } from '../api'
import toast from 'react-hot-toast'
import { MESSAGES } from '../constants/messages'
import { getUserFromToken } from '../utils/helpers'
import { AppContext } from './appContext'

export function AppProvider({ children }) {
  const navigate = useNavigate()

  const [token, setTokenState] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => getUserFromToken(localStorage.getItem('token')))
  const [blogs, setBlogs] = useState([])
  const [input, setInput] = useState('')

  const setToken = (newToken) => {
    setTokenState(newToken)
    setUser(newToken ? getUserFromToken(newToken) : null)
  }

  const fetchBlogs = async () => {
    try {
      const response = await blogApi.getAll()
      if (response.data.success) {
        setBlogs(response.data.blogs)
      } else {
        toast.error(response.data.message || MESSAGES.ERROR_FETCH_BLOGS)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || MESSAGES.ERROR_FETCH_BLOGS)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const value = {
    axios,
    navigate,
    token,
    setToken,
    user,
    blogs,
    setBlogs,
    input,
    setInput,
    fetchBlogs
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
