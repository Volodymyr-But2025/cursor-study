import { describe, it, expect } from 'vitest'
import {
  createLoginSchema,
  createRegisterSchema,
  createResetPasswordSchema,
  createNewsletterSchema,
  createCommentSchema,
  createBlogSchema
} from './formSchemas'

const t = (key: string) => key

describe('formSchemas', () => {
  describe('createLoginSchema', () => {
    it('accepts valid credentials', () => {
      const result = createLoginSchema(t).safeParse({
        email: 'admin@example.com',
        password: 'secret'
      })
      expect(result.success).toBe(true)
    })

    it('rejects missing email and password', () => {
      const result = createLoginSchema(t).safeParse({
        email: '',
        password: ''
      })
      expect(result.success).toBe(false)
    })
  })

  describe('createRegisterSchema', () => {
    it('rejects password mismatch', () => {
      const result = createRegisterSchema(t).safeParse({
        email: 'user@example.com',
        password: 'secret1',
        confirmPassword: 'secret2'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('confirmPassword'))).toBe(true)
      }
    })

    it('accepts matching passwords', () => {
      const result = createRegisterSchema(t).safeParse({
        email: 'user@example.com',
        password: 'secret1',
        confirmPassword: 'secret1'
      })
      expect(result.success).toBe(true)
    })
  })

  describe('createResetPasswordSchema / createNewsletterSchema', () => {
    it('requires a valid email', () => {
      expect(createResetPasswordSchema(t).safeParse({ email: 'bad' }).success).toBe(false)
      expect(createNewsletterSchema(t).safeParse({ email: 'ok@mail.com' }).success).toBe(true)
    })
  })

  describe('createCommentSchema', () => {
    it('requires name when requireName is true', () => {
      const result = createCommentSchema(t, { requireName: true }).safeParse({
        name: 'A',
        content: 'Nice post'
      })
      expect(result.success).toBe(false)
    })

    it('allows optional name when requireName is false', () => {
      const result = createCommentSchema(t, { requireName: false }).safeParse({
        content: 'Nice post'
      })
      expect(result.success).toBe(true)
    })
  })

  describe('createBlogSchema', () => {
    const validFile = new File(['img'], 'cover.png', { type: 'image/png' })

    it('rejects empty Quill HTML description', () => {
      const result = createBlogSchema(t).safeParse({
        title: 'My Title',
        subTitle: 'Subtitle',
        category: 'Startup',
        description: '<p><br></p>',
        image: validFile
      })
      expect(result.success).toBe(false)
    })

    it('rejects non-image files', () => {
      const textFile = new File(['x'], 'note.txt', { type: 'text/plain' })
      const result = createBlogSchema(t).safeParse({
        title: 'My Title',
        subTitle: 'Subtitle',
        category: 'Startup',
        description: '<p>Enough content here</p>',
        image: textFile
      })
      expect(result.success).toBe(false)
    })

    it('accepts a valid blog payload', () => {
      const result = createBlogSchema(t).safeParse({
        title: 'My Title',
        subTitle: 'Subtitle',
        category: 'Startup',
        description: '<p>Enough content here</p>',
        image: validFile
      })
      expect(result.success).toBe(true)
    })
  })
})
