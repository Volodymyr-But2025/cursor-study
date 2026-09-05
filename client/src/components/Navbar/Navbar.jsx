import React from 'react'
import { Button, theme } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context'
import { ROUTES } from '@/constants/routes'
import { IMAGE } from '@/constants/ui'
import { scrollToTop } from '@/utils/helpers'
import { assets } from '@/assets/assets'
import './Navbar.css'

const ARTICLES_HASH = 'articles'

function Navbar() {
  const { navigate, token: authToken } = useAppContext()
  const location = useLocation()
  const { token } = theme.useToken()
  const { t } = useTranslation()

  const goHome = () => {
    if (location.pathname === ROUTES.HOME) {
      if (location.hash) {
        navigate(ROUTES.HOME, { replace: true })
      }
      scrollToTop()
      return
    }
    navigate(ROUTES.HOME)
  }

  const goArticles = () => {
    if (location.pathname === ROUTES.HOME) {
      document.getElementById(ARTICLES_HASH)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navigate({ pathname: ROUTES.HOME, hash: ARTICLES_HASH })
  }

  return (
    <nav
      className="navbar"
      style={{
        background: token.colorBgContainer,
        padding: `${token.paddingMD}px ${token.paddingXL * 2}px`,
        borderBottom: `${token.lineWidth}px solid ${token.colorBorderSecondary}`
      }}
    >
      <div
        onClick={goHome}
        className="navbar-logo"
        style={{
          gap: token.marginXS,
          fontSize: token.fontSizeHeading4,
          fontWeight: token.fontWeightStrong,
          color: token.colorPrimary
        }}
      >
        <img
          src={assets.sprint}
          alt={t('common.appName')}
          style={{
            width: IMAGE.LOGO_SIZE,
            height: IMAGE.LOGO_SIZE
          }}
        />
        <span>{t('common.appName')}</span>
      </div>

      <div
        className="navbar-nav"
        style={{ gap: token.marginLG }}
      >
        <Button
          type="text"
          icon={<HomeOutlined />}
          onClick={goHome}
          style={{ fontSize: token.fontSizeLG, height: token.controlHeightLG }}
        >
          {t('nav.home')}
        </Button>
        <Button
          type="text"
          onClick={goArticles}
          style={{ fontSize: token.fontSizeLG, height: token.controlHeightLG }}
        >
          {t('nav.articles')}
        </Button>
        <Button
          type="primary"
          onClick={() => navigate(ROUTES.ADMIN)}
          style={{
            borderRadius: token.borderRadius,
            height: token.controlHeightLG,
            fontSize: token.fontSize,
            fontWeight: token.fontWeightStrong
          }}
        >
          {authToken ? t('nav.dashboard') : t('nav.login')}
        </Button>
        {!authToken && (
          <Button
            onClick={() => navigate('/register')}
            style={{
              borderRadius: token.borderRadius,
              height: token.controlHeightLG,
              fontSize: token.fontSize,
              fontWeight: token.fontWeightStrong,
              borderColor: token.colorPrimary,
              color: token.colorPrimary
            }}
          >
            {t('nav.register')}
          </Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
