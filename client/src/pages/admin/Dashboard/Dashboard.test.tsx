import { describe, it, expect, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import Dashboard from './Dashboard'

vi.mock('@/hooks', () => ({
  useAdminDashboard: vi.fn()
}))

import { useAdminDashboard } from '@/hooks'

describe('Dashboard', () => {
  it('shows loading spinner', () => {
    vi.mocked(useAdminDashboard).mockReturnValue({
      dashboardData: null,
      loading: true,
      error: null,
      refetch: vi.fn()
    })

    const { container } = renderWithProviders(<Dashboard />, { appContext: false })

    expect(container.querySelector('.ant-spin')).toBeTruthy()
  })

  it('renders stats from hook data', () => {
    vi.mocked(useAdminDashboard).mockReturnValue({
      dashboardData: {
        blogs: 4,
        drafts: 1,
        comments: 7,
        pendingComments: 2,
        recentBlogs: [],
        recentComments: []
      },
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithProviders(<Dashboard />, { appContext: false })

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('falls back to zeros and empty tables when fields are missing', () => {
    vi.mocked(useAdminDashboard).mockReturnValue({
      dashboardData: {},
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    renderWithProviders(<Dashboard />, { appContext: false })

    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(4)
    expect(screen.getByText('Latest Articles')).toBeInTheDocument()
    expect(screen.getByText('Latest Comments')).toBeInTheDocument()
  })

  it('renders recent blogs and comments with status badges', () => {
    vi.mocked(useAdminDashboard).mockReturnValue({
      dashboardData: {
        blogs: 2,
        drafts: 1,
        comments: 2,
        pendingComments: 1,
        recentBlogs: [
          {
            _id: 'b1',
            title: 'Published Post',
            createdAt: '2024-01-01T00:00:00.000Z',
            isPublished: true
          },
          {
            _id: 'b2',
            title: 'Draft Post',
            createdAt: '2024-02-01T00:00:00.000Z',
            isPublished: false
          }
        ],
        recentComments: [
          {
            _id: 'c1',
            content: 'Nice article',
            name: 'Ann',
            isApproved: true
          },
          {
            _id: 'c2',
            content: 'Needs review',
            name: 'Bob',
            isApproved: false
          }
        ]
      },
      loading: false,
      error: null,
      refetch: vi.fn()
    })

    const { container } = renderWithProviders(<Dashboard />, { appContext: false })

    expect(screen.getByText('Published Post')).toBeInTheDocument()
    expect(screen.getByText('Draft Post')).toBeInTheDocument()
    expect(screen.getByText('Nice article')).toBeInTheDocument()
    expect(screen.getByText('Needs review')).toBeInTheDocument()
    expect(screen.getByText('Ann')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()

    expect(container.querySelector('.admin-row-status-published')).toBeTruthy()
    expect(container.querySelector('.admin-row-status-draft')).toBeTruthy()
    expect(container.querySelector('.admin-row-status-approved')).toBeTruthy()
    expect(container.querySelector('.admin-row-status-pending')).toBeTruthy()

    const tables = container.querySelectorAll('.admin-dashboard-table')
    expect(tables.length).toBe(2)
    expect(within(tables[0] as HTMLElement).getByText('Published')).toBeInTheDocument()
    expect(within(tables[0] as HTMLElement).getByText('Draft')).toBeInTheDocument()
    expect(within(tables[1] as HTMLElement).getByText('Approved')).toBeInTheDocument()
    expect(within(tables[1] as HTMLElement).getByText('Pending')).toBeInTheDocument()
  })
})
