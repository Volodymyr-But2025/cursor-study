import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { I18nextProvider } from 'react-i18next'
import { vi } from 'vitest'
import i18n from '@/i18n'
import { AppContext } from '@/context'

export interface AppContextStub {
  axios?: {
    get?: ReturnType<typeof vi.fn>
    post?: ReturnType<typeof vi.fn>
    put?: ReturnType<typeof vi.fn>
    delete?: ReturnType<typeof vi.fn>
  }
  navigate?: ReturnType<typeof vi.fn>
  token?: string | null
  setToken?: ReturnType<typeof vi.fn>
  user?: { name?: string; email?: string; role?: string } | null
  blogs?: unknown[]
  setBlogs?: ReturnType<typeof vi.fn>
  input?: string
  setInput?: ReturnType<typeof vi.fn>
  fetchBlogs?: ReturnType<typeof vi.fn>
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string
  routerProps?: MemoryRouterProps
  appContext?: AppContextStub | false
}

export function createAppContextStub(
  overrides: AppContextStub = {}
): Required<AppContextStub> {
  return {
    axios: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      ...overrides.axios
    },
    navigate: overrides.navigate ?? vi.fn(),
    token: overrides.token ?? null,
    setToken: overrides.setToken ?? vi.fn(),
    user: overrides.user ?? null,
    blogs: overrides.blogs ?? [],
    setBlogs: overrides.setBlogs ?? vi.fn(),
    input: overrides.input ?? '',
    setInput: overrides.setInput ?? vi.fn(),
    fetchBlogs: overrides.fetchBlogs ?? vi.fn()
  }
}

export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    routerProps,
    appContext,
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  const contextValue =
    appContext === false ? null : createAppContextStub(appContext ?? {})

  function Wrapper({ children }: { children: ReactNode }) {
    const content =
      contextValue !== null ? (
        <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
      ) : (
        children
      )

    return (
      <I18nextProvider i18n={i18n}>
        <ConfigProvider>
          <MemoryRouter
            initialEntries={routerProps?.initialEntries ?? [route]}
            {...routerProps}
          >
            {content}
          </MemoryRouter>
        </ConfigProvider>
      </I18nextProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    appContext: contextValue
  }
}
