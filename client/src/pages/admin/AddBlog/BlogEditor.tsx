import { useEffect, useRef, type ReactNode } from 'react'
import Quill from 'quill'
import { EDITOR } from '@/constants/ui'

interface BlogEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  disabled?: boolean
  extra?: ReactNode
}

function BlogEditor({
  value = '',
  onChange,
  placeholder,
  disabled = false,
  extra
}: BlogEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const onChangeRef = useRef(onChange)
  const valueRef = useRef(value)

  onChangeRef.current = onChange
  valueRef.current = value

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const editorEl = document.createElement('div')
    host.appendChild(editorEl)

    const quill = new Quill(editorEl, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ header: [2, 3, false] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean']
        ]
      }
    })

    quill.root.style.minHeight = `${EDITOR.HEIGHT}px`

    if (valueRef.current) {
      quill.clipboard.dangerouslyPasteHTML(valueRef.current)
    }

    const handleChange = (_delta: unknown, _oldDelta: unknown, source: string) => {
      if (source !== 'user') return
      onChangeRef.current?.(quill.root.innerHTML)
    }

    quill.on('text-change', handleChange)
    quillRef.current = quill

    return () => {
      quill.off('text-change', handleChange)
      quillRef.current = null
      host.innerHTML = ''
    }
  }, [placeholder])

  useEffect(() => {
    const quill = quillRef.current
    if (!quill) return

    const current = quill.root.innerHTML
    if (value !== current) {
      const selection = quill.getSelection()
      const delta = quill.clipboard.convert({ html: value || '' })
      quill.setContents(delta, 'silent')
      if (selection) {
        quill.setSelection(selection)
      }
    }
  }, [value])

  useEffect(() => {
    const quill = quillRef.current
    if (!quill) return
    quill.enable(!disabled)
  }, [disabled])

  return (
    <div className="blog-editor-shell">
      <div ref={hostRef} className="blog-editor-host" />
      {extra}
    </div>
  )
}

export default BlogEditor
