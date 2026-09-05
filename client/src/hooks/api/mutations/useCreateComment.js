import { commentApi } from '../../../api'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useCreateComment() {
  const { mutate, loading, error } = useApiMutation()

  const createComment = async ({ blog, name, content }) => {
    return mutate(
      () => commentApi.create({ blog, name, content }),
      {
        successMessage: MESSAGES.SUCCESS_COMMENT_ADDED,
        errorMessage: MESSAGES.ERROR_CREATE_COMMENT
      }
    )
  }

  return {
    createComment,
    isCreating: loading,
    inProgress: loading,
    error
  }
}
