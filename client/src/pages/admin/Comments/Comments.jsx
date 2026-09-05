import React, { useState } from 'react'
import { Table, Button, Space, Typography, Spin, Flex, Segmented, Tooltip } from 'antd'
import { DeleteOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAdminComments, useCommentActions } from '@/hooks'
import { SORT_OPTIONS, COLUMN_WIDTHS } from '@/constants/ui'
import { StatusBadge } from '../shared/StatusBadge'
import '../shared/AdminTable.css'
import './Comments.css'

const { Title, Text } = Typography

function Comments() {
  const { comments, loading, updateComment, removeComment } = useAdminComments()
  const { approveComment, disapproveComment, deleteComment, inProgress } = useCommentActions()
  const { t } = useTranslation()
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.COMMENTS[0])
  const [pendingId, setPendingId] = useState(null)

  const handleApprove = async (id) => {
    setPendingId(id)
    const result = await approveComment(id)
    if (result?.success) {
      updateComment(id, { isApproved: true })
    }
    setPendingId(null)
  }

  const handleDisapprove = async (id) => {
    setPendingId(id)
    const result = await disapproveComment(id)
    if (result?.success) {
      updateComment(id, { isApproved: false })
    }
    setPendingId(null)
  }

  const handleDelete = async (id) => {
    setPendingId(id)
    const result = await deleteComment(id)
    if (result?.success) {
      removeComment(id)
    }
    setPendingId(null)
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === t('admin.comments.sortLatest') || sortBy === 'Latest') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }

    if (sortBy === t('admin.comments.sortByArticle') || sortBy === 'By Article') {
      const titleA = a.blog?.title || ''
      const titleB = b.blog?.title || ''
      const byTitle = titleA.localeCompare(titleB)
      if (byTitle !== 0) return byTitle
      return new Date(b.createdAt) - new Date(a.createdAt)
    }

    return 0
  })

  const columns = [
    {
      title: t('admin.comments.columns.index'),
      key: 'index',
      width: COLUMN_WIDTHS.INDEX,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: t('admin.comments.columns.comment'),
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    },
    {
      title: t('admin.comments.columns.article'),
      key: 'article',
      width: COLUMN_WIDTHS.ARTICLE,
      ellipsis: true,
      render: (_, record) => record.blog?.title || t('admin.comments.unknownArticle')
    },
    {
      title: t('admin.comments.columns.author'),
      dataIndex: 'name',
      key: 'name',
      width: COLUMN_WIDTHS.AUTHOR,
      ellipsis: true
    },
    {
      title: t('admin.comments.columns.status'),
      dataIndex: 'isApproved',
      key: 'isApproved',
      width: COLUMN_WIDTHS.STATUS_LARGE,
      render: (isApproved) => (
        <StatusBadge status={isApproved ? 'approved' : 'pending'} />
      )
    },
    {
      title: t('admin.comments.columns.actions'),
      key: 'actions',
      width: COLUMN_WIDTHS.ACTIONS_MEDIUM,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          {!record.isApproved ? (
            <Tooltip title={t('common.approve')}>
              <Button
                type="default"
                shape="circle"
                size="small"
                icon={<PlusOutlined className="admin-action-icon" />}
                className="admin-action-btn-approve"
                onClick={() => handleApprove(record._id)}
                disabled={inProgress}
                loading={pendingId === record._id}
                aria-label={t('common.approve')}
              />
            </Tooltip>
          ) : (
            <Tooltip title={t('common.disapprove')}>
              <Button
                type="default"
                shape="circle"
                size="small"
                icon={<CloseOutlined className="admin-action-icon" />}
                className="admin-action-btn-unapprove"
                onClick={() => handleDisapprove(record._id)}
                disabled={inProgress}
                loading={pendingId === record._id}
                aria-label={t('common.disapprove')}
              />
            </Tooltip>
          )}
          <Tooltip title={t('common.delete')}>
            <Button
              type="default"
              shape="circle"
              size="small"
              icon={<DeleteOutlined className="admin-action-icon" />}
              className="admin-action-btn-delete"
                onClick={() => handleDelete(record._id)}
                disabled={inProgress}
                loading={pendingId === record._id}
              aria-label={t('common.delete')}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  if (loading) {
    return (
      <Flex justify="center" align="center" className="admin-comments-loading">
        <Spin size="large" />
      </Flex>
    )
  }

  return (
    <Flex vertical className="admin-comments">
      <Flex justify="space-between" align="center" className="admin-page-header admin-comments-header">
        <Title level={1} className="admin-comments-title">
          {t('admin.comments.title')}
        </Title>

        <Flex align="center" gap="middle">
          <Text strong className="admin-comments-count">
            {t('admin.comments.commentsCount')} {comments.length}
          </Text>

          <Flex align="center" gap="small">
            <Text>{t('admin.comments.sorting')}</Text>
            <Segmented
              options={SORT_OPTIONS.COMMENTS}
              value={sortBy}
              onChange={setSortBy}
              size="large"
            />
          </Flex>
        </Flex>
      </Flex>

      <div className="admin-table-section">
        <Table
          columns={columns}
          dataSource={sortedComments}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => t('admin.comments.totalComments', { count: total })
          }}
          className="admin-table"
          rowClassName={(record) =>
            record.isApproved
              ? 'admin-row-status-approved'
              : 'admin-row-status-pending'
          }
        />
      </div>
    </Flex>
  )
}

export default Comments
