import React from 'react'
import { Flex, Typography, Spin, Empty, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { DATE_FORMATS } from '@/constants/ui'
import './CommentList.css'

const { Text, Paragraph } = Typography

function CommentList({ comments, loading }) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Flex justify="center" align="center" className="comment-list-loading">
        <Spin size="large" />
      </Flex>
    )
  }

  if (!comments.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={t('blogDetail.comments.empty')}
        className="comment-list-empty"
      />
    )
  }

  return (
    <Flex vertical className="comment-list">
      {comments.map((comment, index) => (
        <div key={comment._id} className="comment-list-item">
          {index > 0 && <Divider className="comment-list-divider" />}
          <Flex vertical gap="small">
            <Flex align="center" gap="middle" wrap="wrap">
              <Text strong>{comment.name}</Text>
              <Text type="secondary">
                {moment(comment.createdAt).format(DATE_FORMATS.DISPLAY)}
              </Text>
            </Flex>
            <Paragraph className="comment-list-content">
              {comment.content}
            </Paragraph>
          </Flex>
        </div>
      ))}
    </Flex>
  )
}

export default CommentList
