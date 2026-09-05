import { adminApi } from '../../../api'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'

export function useCommentActions() {
  const { mutate, loading, error } = useApiMutation()

  const approveComment = async (id) => {
    return mutate(
      () => adminApi.approveComment(id),
      {
        successMessage: MESSAGES.SUCCESS_COMMENT_APPROVED,
        errorMessage: MESSAGES.ERROR_UPDATE_COMMENT
      }
    )
  }

  const disapproveComment = async (id) => {
    return mutate(
      () => adminApi.disapproveComment(id),
      {
        successMessage: MESSAGES.SUCCESS_COMMENT_DISAPPROVED,
        errorMessage: MESSAGES.ERROR_UPDATE_COMMENT
      }
    )
  }

  const deleteComment = async (id) => {
    return mutate(
      () => adminApi.deleteComment(id),
      {
        successMessage: MESSAGES.SUCCESS_COMMENT_DELETED,
        errorMessage: MESSAGES.ERROR_DELETE_COMMENT
      }
    )
  }

  return {
    approveComment,
    disapproveComment,
    deleteComment,
    inProgress: loading,
    error
  }
}
