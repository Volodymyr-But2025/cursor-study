import { useTranslation } from 'react-i18next'
import { useApiMutation } from '../../core'
import { blogApi } from '../../../api'
import type { GenerateBlogPayload } from '../../../types'

export function useBlogGenerator() {
  const { t } = useTranslation()
  const { mutate, loading, error } = useApiMutation()

  const generateContent = async (payload: GenerateBlogPayload) => {
    return mutate(
      () => blogApi.generate(payload),
      {
        showSuccessToast: false,
        errorMessage: t('messages.error.aiGenerate')
      }
    )
  }

  return {
    generateContent,
    isGenerating: loading,
    inProgress: loading,
    error
  }
}
