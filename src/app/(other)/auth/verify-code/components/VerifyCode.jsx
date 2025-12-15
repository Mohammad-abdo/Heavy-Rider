import logoDark from '@/assets/images/logo-dark.png'
import logoLight from '@/assets/images/logo-light.png'
import smallImg from '@/assets/images/small/img-10.jpg'
import TextFormInput from '@/components/form/TextFormInput'
import { authAPI } from '@/api/api'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'

const buildVerifySchema = (t) =>
  yup.object({
    code: yup.string().required(t('auth.verify.validation.codeRequired')),
  })

const VerifyCode = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthContext()
  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false)
  const initialEmail = useMemo(() => location.state?.email ?? '', [location.state])
  const verifySchema = useMemo(() => buildVerifySchema(t), [t])

  const {
    control,
    handleSubmit,
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(verifySchema),
    defaultValues: { code: '' },
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/sign-in')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true)
    try {
      await authAPI.verifyCode({ code: values.code })
      showNotification({ variant: 'success', message: t('auth.verify.success') })
      reset({ code: '' })
      navigate('/dashboard')
    } catch (error) {
      const message = error?.response?.data?.message || t('auth.verify.invalidCode')
      setError('code', { type: 'manual', message })
      showNotification({ variant: 'danger', message })
    } finally {
      setLoading(false)
    }
  })

  const resendCode = async () => {
    setLoading(true)
    try {
      await authAPI.sendVerificationCode()
      showNotification({ variant: 'success', message: t('auth.verify.resendSuccess') })
    } catch (error) {
      const message = error?.response?.data?.message || t('auth.verify.resendFailed')
      showNotification({ variant: 'danger', message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100 p-3">
      <div className="d-flex flex-column flex-grow-1">
        <Row className="h-100 g-0">
          <Col xxl={7} className="d-flex align-items-center justify-content-center">
            <Row className="w-100 justify-content-center">
              <Col lg={7} md={10} sm={12} className="py-4 py-lg-5">
                <div className="d-flex flex-column h-100 justify-content-center">
                  <div className="auth-logo mb-4 d-flex justify-content-center align-items-center">
                    <Link to="/dashboard" className="logo-dark d-flex align-items-center gap-2">
                      <img src={logoDark} height={32} alt="logo dark" />
                    </Link>
                    <Link to="/dashboard" className="logo-light d-flex align-items-center gap-2">
                      <img src={logoLight} height={32} alt="logo light" />
                    </Link>
                  </div>
                  <h2 className="fw-bold fs-24 text-center text-md-start">{t('auth.verify.title')}</h2>
                  <p className="text-muted mt-1 mb-4 text-center text-md-start">
                    {t('auth.verify.subtitle', { email: initialEmail || '' })}
                  </p>
                  <form className="authentication-form" onSubmit={onSubmit}>
                    <TextFormInput
                      control={control}
                      name="code"
                      containerClassName="mb-3"
                      label={t('auth.verify.fields.code')}
                      id="verification-code"
                      placeholder={t('auth.verify.placeholders.code')}
                    />
                    <div className="d-grid gap-2">
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? t('auth.verify.loading') : t('auth.verify.submit')}
                      </Button>
                      <Button variant="outline-secondary" type="button" disabled={loading} onClick={resendCode}>
                        {t('auth.verify.resend')}
                      </Button>
                    </div>
                  </form>
                  <p className="mt-5 text-danger text-center">
                    {t('auth.common.backTo')}{' '}
                    <Link to="/auth/sign-in" className="text-dark fw-bold ms-1">
                      {t('auth.signIn.title')}
                    </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xxl={5} className="d-none d-xxl-flex">
            <Card className="h-100 mb-0 overflow-hidden border-0 rounded-0">
              <div className="d-flex flex-column h-100">
                <img src={smallImg} height={867} width={759} alt="small-img" className="w-100 h-100 object-fit-cover" />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default VerifyCode
