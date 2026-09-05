import { Layout, Typography, Space, Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { ROUTES } from '@/constants/routes'
import { assets } from '@/assets/assets'
import { RegisterForm } from './components'
import './Register.css'

const { Header, Footer, Content } = Layout
const { Title, Text, Link } = Typography

function Register() {
  const { navigate } = useAppContext()
  const { t } = useTranslation()

  return (
    <Layout className="auth-layout">
      <Header className="auth-header">
        <Flex
          align="center"
          gap={8}
          onClick={() => navigate(ROUTES.HOME)}
          className="auth-header-logo"
        >
          <img
            src={assets.sprint}
            alt={t('common.appName')}
            className="auth-header-logo-img"
          />
          <Title level={2} className="auth-header-logo-title">
            {t('common.appName')}
          </Title>
        </Flex>
      </Header>

      <Content className="auth-content">
        <Space direction="vertical" size={8} className="auth-card">
          <Title level={1} className="auth-card-title">
            {t('auth.register.title')}
          </Title>

          <RegisterForm />

          <Flex justify="center">
            <Text>
              {t('auth.register.hasAccount')}{' '}
              <Link
                onClick={() => navigate(ROUTES.ADMIN)}
                className="auth-link-warning"
              >
                {t('auth.register.login')}
              </Link>
            </Text>
          </Flex>
        </Space>
      </Content>

      <Footer className="auth-footer">
        <Flex
          align="center"
          gap={8}
          onClick={() => navigate(ROUTES.HOME)}
          className="auth-footer-logo"
        >
          <img
            src={assets.sprint}
            alt={t('common.appName')}
            className="auth-footer-logo-img"
          />
          <Title level={3} className="auth-footer-logo-title">
            {t('common.appName')}
          </Title>
        </Flex>
        <Text>{t('common.copyright')}</Text>
      </Footer>
    </Layout>
  )
}

export default Register
