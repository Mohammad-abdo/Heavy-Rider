import { Card, Col, Row, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import LoginFrom from './LoginFrom'

const SignIn = () => {
  const { t } = useTranslation()

  return (
    <div className="auth-page-wrapper min-vh-100 d-flex align-items-center position-relative">
      {/* Background Gradient */}
      <div className="auth-page-background"></div>
      
      <Container fluid className="py-4">
        <Row className="g-0 justify-content-center">
          {/* Left Side - Login Form */}
          <Col xl={5} lg={6} md={8} className="d-flex align-items-center">
            <div className="w-100">
              <Card className="auth-card shadow-lg border-0">
                <Card.Body className="p-4 p-md-5">
                  {/* Logo/Brand Section */}
                  <div className="text-center mb-4 animated-fade-in">
                    <div className="auth-logo mb-3">
                      <Link to="/dashboard" className="text-decoration-none">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div className="auth-logo-icon">
                            <IconifyIcon icon="solar:truck-bold-duotone" className="fs-32 text-white" />
                          </div>
                          <div className="text-start">
                            <h1 className="mb-0 fw-bold text-primary" style={{ fontSize: '2rem', lineHeight: '1.2' }}>
                              Heavy Rider
                            </h1>
                            <p className="text-muted small mb-0">Heavy Equipment Management</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Welcome Section */}
                  <div className="text-center mb-4 animated-slide-in">
                    <h2 className="fw-bold mb-2">{t('auth.signIn.title')}</h2>
                    <p className="text-muted">{t('auth.signIn.subtitle')}</p>
                  </div>

                  {/* Login Form */}
                  <div className="animated-fade-in">
                    <LoginFrom />
                  </div>

                  {/* Footer Links */}
                  <div className="text-center mt-4 animated-fade-in">
                    <p className="text-muted mb-2">
                      {t("auth.signIn.noAccount")}{' '}
                      <Link to="/auth/sign-up" className="text-primary fw-semibold text-decoration-none">
                        {t('auth.signUp.title')}
                      </Link>
                    </p>
                    <Link to="/auth/reset-pass" className="text-muted small text-decoration-none">
                      <IconifyIcon icon="solar:lock-password-bold-duotone" className="me-1" />
                      {t('auth.signIn.resetPasswordLink')}
                    </Link>
                  </div>
                </Card.Body>
              </Card>

              {/* Features List */}
              <div className="mt-4 text-center animated-fade-in">
                <Row className="g-3">
                  <Col xs={4}>
                    <div className="feature-item">
                      <IconifyIcon icon="solar:shield-check-bold-duotone" className="fs-24 text-primary mb-2" />
                      <p className="small text-muted mb-0">Secure</p>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="feature-item">
                      <IconifyIcon icon="solar:rocket-2-bold-duotone" className="fs-24 text-success mb-2" />
                      <p className="small text-muted mb-0">Fast</p>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="feature-item">
                      <IconifyIcon icon="solar:chart-2-bold-duotone" className="fs-24 text-info mb-2" />
                      <p className="small text-muted mb-0">Reliable</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>

          {/* Right Side - Visual Section */}
          <Col xl={7} lg={6} className="d-none d-lg-flex align-items-center justify-content-center position-relative">
            <div className="auth-visual-section w-100 h-100 d-flex flex-column align-items-center justify-content-center p-5">
              <div className="auth-visual-content text-center text-white">
                <div className="mb-4 animated-scale-in">
                  <IconifyIcon icon="solar:truck-bold-duotone" className="fs-120 mb-3" style={{ opacity: 0.9 }} />
                </div>
                <h2 className="fw-bold mb-3 animated-fade-in" style={{ fontSize: '2.5rem' }}>
                  Welcome to Heavy Rider
                </h2>
                <p className="fs-18 mb-4 animated-slide-in" style={{ opacity: 0.9, maxWidth: '500px', margin: '0 auto' }}>
                  Manage your heavy equipment fleet with ease. Track cranes, drivers, and rides all in one place.
                </p>
                <div className="d-flex gap-4 justify-content-center mt-5 animated-fade-in">
                  <div className="feature-highlight">
                    <IconifyIcon icon="solar:truck-bold-duotone" className="fs-32 mb-2" />
                    <p className="mb-0 small">Crane Management</p>
                  </div>
                  <div className="feature-highlight">
                    <IconifyIcon icon="solar:steering-wheel-bold-duotone" className="fs-32 mb-2" />
                    <p className="mb-0 small">Driver Tracking</p>
                  </div>
                  <div className="feature-highlight">
                    <IconifyIcon icon="solar:route-bold-duotone" className="fs-32 mb-2" />
                    <p className="mb-0 small">Ride Management</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default SignIn
