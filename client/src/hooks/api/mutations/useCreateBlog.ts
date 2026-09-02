import { useTranslation } from 'react-i18next'
import { useApiMutation } from '../../core'
import { blogApi } from '../../../api'

export function useCreateBlog() {
  const { t } = useTranslation()
  const { mutate, loading, error } = useApiMutation()

  const createBlog = async (formData: FormData) => {
    return mutate(
      () => blogApi.create(formData),
      {
        successMessage: t('messages.success.blogCreated'),
        errorMessage: t('messages.error.generic')
      }
    )
  }

  return {
    createBlog,
    isCreating: loading,
    inProgress: loading,
    error
  }
}
