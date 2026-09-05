import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import AddBlogForm from './AddBlogForm'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

const generateContent = vi.fn()
const createBlog = vi.fn()

vi.mock('@/hooks', () => ({
  useBlogGenerator: () => ({
    generateContent,
    isGenerating: false
  }),
  useCreateBlog: () => ({
    createBlog,
    isCreating: false
  })
}))

const quillInstances: Array<{
  root: { innerHTML: string }
  on: ReturnType<typeof vi.fn>
  textChangeHandler?: () => void
}> = []

vi.mock('quill', () => {
  class MockQuill {
    root = { innerHTML: '<p>Enough content here</p>' }
    on = vi.fn((event: string, handler: () => void) => {
      if (event === 'text-change') {
        this.textChangeHandler = handler
        handler()
      }
    })
    textChangeHandler?: () => void

    constructor() {
      quillInstances.push(this)
    }
  }
  return { default: MockQuill }
})

import toast from 'react-hot-toast'

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  const titleInputs = screen.getAllByPlaceholderText('Type here')
  await user.type(titleInputs[0]!, 'My Article Title')
  await user.type(titleInputs[1]!, 'My subtitle text')

  const file = new File(['img'], 'thumb.png', { type: 'image/png' })
  Object.defineProperty(file, 'size', { value: 1024 })

  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  expect(fileInput).toBeTruthy()
  await user.upload(fileInput, file)
}

describe('AddBlogForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    quillInstances.length = 0
    createBlog.mockResolvedValue({ success: true })
    generateContent.mockResolvedValue({
      success: true,
      content: '<p>Enough AI content</p>'
    })
  })

  it('does not call generate API without title', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddBlogForm />)

    await user.click(screen.getByRole('button', { name: 'Generate with AI' }))

    expect(toast.error).toHaveBeenCalled()
    expect(generateContent).not.toHaveBeenCalled()
  })

  it('calls generateContent and writes HTML into Quill', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddBlogForm />)

    const titleInputs = screen.getAllByPlaceholderText('Type here')
    await user.type(titleInputs[0]!, 'My Article Title')
    await user.click(screen.getByRole('button', { name: 'Generate with AI' }))

    await waitFor(() => {
      expect(generateContent).toHaveBeenCalledWith('My Article Title')
    })
    expect(quillInstances[0]?.root.innerHTML).toBe('<p>Enough AI content</p>')
  })

  it('shows validation errors when publishing empty form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddBlogForm />)

    await user.click(screen.getByRole('button', { name: 'Publish Article' }))

    expect(await screen.findByText('Please enter article title')).toBeInTheDocument()
    expect(createBlog).not.toHaveBeenCalled()
  })

  it('publishes article and resets form on success', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddBlogForm />)

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: 'Publish Article' }))

    await waitFor(() => {
      expect(createBlog).toHaveBeenCalled()
    })

    const [blog, image] = createBlog.mock.calls[0]!
    expect(blog).toMatchObject({
      title: 'My Article Title',
      subTitle: 'My subtitle text',
      isPublished: true
    })
    expect(image).toBeInstanceOf(File)

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Type here')[0]).toHaveValue('')
    })
  })

  it('saves draft with isPublished false', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddBlogForm />)

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: 'Save Draft' }))

    await waitFor(() => {
      expect(createBlog).toHaveBeenCalled()
    })

    const [blog] = createBlog.mock.calls[0]!
    expect(blog.isPublished).toBe(false)
  })

  it('rejects non-image upload', async () => {
    renderWithProviders(<AddBlogForm />)

    const file = new File(['txt'], 'notes.txt', { type: 'text/plain' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(
      await screen.findByText('You can only upload image files!')
    ).toBeInTheDocument()
  })

  it('rejects oversized image upload', async () => {
    renderWithProviders(<AddBlogForm />)

    const file = new File(['img'], 'big.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 })

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(
      await screen.findByText('Image must be smaller than 5MB!')
    ).toBeInTheDocument()
  })

  it('shows image preview after valid upload', async () => {
    const user = userEvent.setup()
    const readAsDataURL = vi.fn(function (this: FileReader) {
      Object.defineProperty(this, 'result', { value: 'data:image/png;base64,abc' })
      this.onload?.({ target: this } as ProgressEvent<FileReader>)
    })
    vi.spyOn(window, 'FileReader').mockImplementation(function (this: FileReader) {
      this.readAsDataURL = readAsDataURL
      this.onload = null
      return this
    } as unknown as typeof FileReader)

    renderWithProviders(<AddBlogForm />)

    const file = new File(['img'], 'thumb.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 1024 })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByAltText('preview')).toBeInTheDocument()
    })
  })
})
