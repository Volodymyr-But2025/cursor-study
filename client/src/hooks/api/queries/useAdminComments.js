import { adminApi } from '../../../api'
import { useApiQuery } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useAdminComments() {
  const { data, setData, loading, error, refetch } = useApiQuery(
    () => adminApi.getComments(),
    {
      errorMessage: MESSAGES.ERROR_FETCH_COMMENTS
    }
  )

  const updateComment = (id, patch) => {
    setData((previous) => {
      if (!previous?.comments) return previous

      return {
        ...previous,
        comments: previous.comments.map((comment) => (
          comment._id === id ? { ...comment, ...patch } : comment
        ))
      }
    })
  }

  const removeComment = (id) => {
    setData((previous) => {
      if (!previous?.comments) return previous

      const comments = previous.comments.filter((comment) => comment._id !== id)

      return {
        ...previous,
        comments,
        count: comments.length
      }
    })
  }

  return {
    comments: data?.comments || [],
    loading,
    error,
    refetch,
    updateComment,
    removeComment
  }
}
