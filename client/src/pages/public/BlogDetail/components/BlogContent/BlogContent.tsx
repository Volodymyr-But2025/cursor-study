import { Flex, theme } from 'antd'
import { renderBlogHtml } from '@/utils/sanitizeHtml'
import './BlogContent.css'

interface BlogContentProps {
  content: string
}

function BlogContent({ content }: BlogContentProps) {
  const { token } = theme.useToken()

  return (
    <Flex
      vertical
      gap={token.marginMD}
      className="blog-content"
      style={{
        width: '100%',
        maxWidth: 910,
        color: token.colorTextBase
      }}
    >
      <div
        className="rich-text"
        dangerouslySetInnerHTML={{ __html: renderBlogHtml(content) }}
      />
    </Flex>
  )
}

export default BlogContent
