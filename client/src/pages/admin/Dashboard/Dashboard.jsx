import React from 'react'
import { Row, Col, Table, Spin, Typography, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAdminDashboard } from '@/hooks'
import moment from 'moment'
import { DATE_FORMATS, TABLE_SCROLL, COLUMN_WIDTHS } from '@/constants/ui'
import { StatusBadge } from '../shared/StatusBadge'
import './Dashboard.css'

const { Title, Text } = Typography

function Dashboard() {
  const { dashboardData, loading } = useAdminDashboard()
  const { t } = useTranslation()

  const articlesColumns = [
    {
      title: t('admin.listBlog.columns.index'),
      dataIndex: 'index',
      key: 'index',
      width: COLUMN_WIDTHS.INDEX,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: t('admin.listBlog.columns.blogTitle'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: t('admin.listBlog.columns.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: COLUMN_WIDTHS.DATE,
      render: (date) => moment(date).format(DATE_FORMATS.DISPLAY)
    },
    {
      title: t('admin.listBlog.columns.status'),
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: COLUMN_WIDTHS.STATUS_LARGE,
      render: (isPublished) => (
        <StatusBadge status={isPublished ? 'published' : 'draft'} />
      )
    }
  ]

  const commentsColumns = [
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
    }
  ]

  if (loading) {
    return (
      <Flex justify="center" align="center" className="admin-dashboard-loading">
        <Spin size="large" />
      </Flex>
    )
  }

  return (
    <Flex vertical className="admin-dashboard">
      <Title level={2} className="admin-dashboard-title">
        {t('admin.dashboard.title')}
      </Title>

      <Row gutter={[16, 16]} className="admin-dashboard-row">
        <Col xs={24} className="admin-dashboard-col">
          <div className="admin-dashboard-stats-container">
            <Row gutter={[16, 16]} className="admin-dashboard-stats-row">
              <Col xs={24} sm={12} lg={6}>
                <div className="admin-stat-card">
                  <Text type="secondary" className="admin-stat-label">
                    {t('admin.dashboard.articles')}
                  </Text>
                  <div className="admin-stat-value">
                    {dashboardData.blogs || 0}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="admin-stat-card admin-stat-card-draft">
                  <Text type="secondary" className="admin-stat-label">
                    {t('admin.dashboard.drafts')}
                  </Text>
                  <div className="admin-stat-value">
                    {dashboardData.drafts || 0}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="admin-stat-card">
                  <Text type="secondary" className="admin-stat-label">
                    {t('admin.dashboard.comments')}
                  </Text>
                  <div className="admin-stat-value">
                    {dashboardData.comments || 0}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="admin-stat-card admin-stat-card-pending">
                  <Text type="secondary" className="admin-stat-label">
                    {t('admin.dashboard.pendingComments')}
                  </Text>
                  <div className="admin-stat-value">
                    {dashboardData.pendingComments || 0}
                  </div>
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="admin-dashboard-tables-row">
              <Col xs={24} xl={12}>
                <div className="admin-table-section">
                  <div className="admin-table-header">
                    <Title level={4} className="admin-table-header-title">
                      {t('admin.dashboard.latestArticles')}
                    </Title>
                  </div>
                  <div className="admin-table-content">
                    <Table
                      columns={articlesColumns}
                      dataSource={dashboardData.recentBlogs || []}
                      rowKey="_id"
                      pagination={false}
                      size="small"
                      scroll={{ x: TABLE_SCROLL.DASHBOARD_ARTICLES }}
                      className="admin-dashboard-table"
                      rowClassName={(record) =>
                        record.isPublished
                          ? 'admin-row-status-published'
                          : 'admin-row-status-draft'
                      }
                    />
                  </div>
                </div>
              </Col>

              <Col xs={24} xl={12}>
                <div className="admin-table-section">
                  <div className="admin-table-header">
                    <Title level={4} className="admin-table-header-title">
                      {t('admin.dashboard.latestComments')}
                    </Title>
                  </div>
                  <div className="admin-table-content">
                    <Table
                      columns={commentsColumns}
                      dataSource={dashboardData.recentComments || []}
                      rowKey="_id"
                      pagination={false}
                      size="small"
                      scroll={{ x: TABLE_SCROLL.DASHBOARD_COMMENTS }}
                      className="admin-dashboard-table"
                      rowClassName={(record) =>
                        record.isApproved
                          ? 'admin-row-status-approved'
                          : 'admin-row-status-pending'
                      }
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Flex>
  )
}

export default Dashboard
