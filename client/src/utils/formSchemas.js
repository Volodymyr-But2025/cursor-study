import { z } from 'zod'
import { isNonEmptyHtml } from './validators'
import { UPLOAD } from '@/constants/ui'

export const emailField = (t) =>
  z
    .string()
    .trim()
    .min(1, t('validation.emailRequired'))
    .email(t('validation.emailInvalid'))

export const passwordRequired = (t) =>
  z.string().min(1, t('validation.passwordRequired'))

export const passwordMin = (t, min = 6) =>
  z.string().min(min, t('validation.passwordMin'))

export const createLoginSchema = (t) =>
  z.object({
    email: emailField(t),
    password: passwordRequired(t)
  })

export const createRegisterSchema = (t) =>
  z
    .object({
      email: emailField(t),
      password: passwordMin(t, 6),
      confirmPassword: z.string().min(1, t('validation.confirmPasswordRequired'))
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('validation.passwordMismatch')
    })

export const createResetPasswordSchema = (t) =>
  z.object({
    email: emailField(t)
  })

export const createNewsletterSchema = (t) =>
  z.object({
    email: emailField(t)
  })

export const createCommentSchema = (t, { requireName = true } = {}) =>
  z.object({
    name: requireName
      ? z
          .string()
          .trim()
          .min(2, t('validation.nameMin'))
          .max(50, t('validation.nameMax'))
      : z.string().optional(),
    content: z
      .string()
      .trim()
      .min(1, t('validation.commentRequired'))
      .max(1000, t('validation.commentMax'))
  })

export const createBlogSchema = (t) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, t('validation.titleRequired'))
      .min(3, t('validation.titleMin')),
    subTitle: z.string().trim().min(1, t('validation.subtitleRequired')),
    category: z.string().min(1, t('validation.categoryRequired')),
    description: z
      .string()
      .refine(isNonEmptyHtml, t('validation.descriptionRequired'))
      .refine((html) => html.trim().length >= 10, t('validation.descriptionMin')),
    image: z
      .custom((file) => file instanceof File, {
        message: t('validation.thumbnailRequired')
      })
      .refine((file) => file.type.startsWith('image/'), {
        message: t('messages.error.imageType')
      })
      .refine((file) => file.size / 1024 / 1024 < UPLOAD.MAX_SIZE_MB, {
        message: t('messages.error.imageSize')
      })
  })
