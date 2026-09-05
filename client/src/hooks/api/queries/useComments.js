import { commentApi } from '../../../api'
import { useApiQuery } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useComments(blogId) {
  const { data, loading, error, refetch } = useApiQuery(
    blogId ? () => commentApi.getByBlog(blogId) : null,
    {
      enabled: Boolean(blogId),
      dependencies: [blogId],
      errorMessage: MESSAGES.ERROR_FETCH_COMMENTS
    }
  )

  return {
    comments: data?.comments || [],
    loading,
    error,
    refetch
  }
}
