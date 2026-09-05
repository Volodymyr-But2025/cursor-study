import { Tag } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import './StatusBadge.css'

const STATUS_CONFIG = {
  published: {
    color: 'success',
    icon: CheckCircleOutlined,
    className: 'admin-status-badge admin-status-badge-positive',
    labelKey: 'blog.status.published'
  },
  draft: {
    color: 'warning',
    icon: FileTextOutlined,
    className: 'admin-status-badge admin-status-badge-draft',
    labelKey: 'blog.status.draft'
  },
  approved: {
    color: 'success',
    icon: CheckCircleOutlined,
    className: 'admin-status-badge admin-status-badge-positive',
    labelKey: 'admin.comments.status.approved'
  },
  pending: {
    color: 'error',
    icon: ClockCircleOutlined,
    className: 'admin-status-badge admin-status-badge-pending',
    labelKey: 'admin.comments.status.pending'
  }
}

export function StatusBadge({ status }) {
  const { t } = useTranslation()
  const config = STATUS_CONFIG[status]

  if (!config) return null

  const Icon = config.icon

  return (
    <Tag
      color={config.color}
      icon={<Icon />}
      className={config.className}
    >
      {t(config.labelKey)}
    </Tag>
  )
}

export default StatusBadge
