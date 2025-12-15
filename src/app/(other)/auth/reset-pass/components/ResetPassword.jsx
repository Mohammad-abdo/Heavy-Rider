import logoDark from '@/assets/images/logo-dark.png'
import logoLight from '@/assets/images/logo-light.png'
import smallImg from '@/assets/images/small/img-10.jpg'
import TextFormInput from '@/components/form/TextFormInput'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import { authAPI } from '@/api/api'
import { useNotificationContext } from '@/context/useNotificationContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'

const buildRequestSchema = (t) =>
  yup.object({
    email: yup.string().email(t('auth.validation.emailInvalid')).required(t('auth.validation.emailRequired')),
  })

const buildResetSchema = (t) =>
  yup.object({
    otp: yup.string().required(t('auth.reset.validation.codeRequired')),
    remember_token: yup.string().required(t('auth.reset.validation.tokenMissing')),
    password: yup
      .string()
      .min(6, t('auth.validation.passwordMin'))
      .required(t('auth.reset.validation.passwordRequired')),
    re_password: yup
      .string()
      .oneOf([yup.ref('password')], t('auth.validation.passwordsMismatch'))
      .required(t('auth.reset.validation.confirmPasswordRequired')),
  })

const ResetPassword = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { showNotification } = useNotificationContext()
  const [step, setStep] = useState('request')
  const [loading, setLoading] = useState(false)
  const [rememberToken, setRememberToken] = useState('')

  const requestSchema = useMemo(() => buildRequestSchema(t), [t])
  const resetSchema = useMemo(() => buildResetSchema(t), [t])

  const {
    control: requestControl,
    handleSubmit: handleRequestSubmit,
    setError: setRequestError
  } = useForm({
    resolver: yupResolver(requestSchema),
    defaultValues: { email: '' }
  })

  const {
    control: resetControl,
    handleSubmit: handleResetSubmit,
    setValue: setResetValue,
    setError: setResetError
  } = useForm({
    resolver: yupResolver(resetSchema),
    defaultValues: { otp: '', remember_token: '', password: '', re_password: '' }
  })

  const goToSignIn = () => navigate('/auth/sign-in')

  const extractToken = (payload) => {
    if (!payload) return ''
    if (typeof payload === 'string') return payload
    if (payload.data && typeof payload.data === 'object') {
      return extractToken(payload.data.remember_token ?? payload.data.token)
    }
    return payload.remember_token ?? payload.token ?? ''
  }

  const submitRequest = handleRequestSubmit(async (values) => {
    setLoading(true)
    try {
      const response = await authAPI.forgotPassword(values.email)
      const token = extractToken(response?.data ?? response)
      if (token) {
        setRememberToken(token)
        setResetValue('remember_token', token)
      }
      showNotification({ variant: 'success', message: t('auth.reset.requestSuccess') })
      setStep('reset')
    } catch (error) {
      const message = error?.response?.data?.message || t('auth.reset.requestFailed')
      setRequestError('email', { type: 'manual', message })
      showNotification({ variant: 'danger', message })
    } finally {
      setLoading(false)
    }
  })

  const submitReset = handleResetSubmit(async (values) => {
    setLoading(true)
    try {
      const payload = {
        otp: values.otp,
        remember_token: values.remember_token || rememberToken,
        password: values.password,
        re_password: values.re_password
      }
      await authAPI.resetPassword(payload)
      showNotification({ variant: 'success', message: t('auth.reset.success') })
      setStep('done')
    } catch (error) {
      const message = error?.response?.data?.message || t('auth.reset.failed')
      setResetError('otp', { type: 'manual', message })
      showNotification({ variant: 'danger', message })
    } finally {
      setLoading(false)
    }
  })

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
                  <h2 className="fw-bold fs-24 text-center text-md-start">{t('auth.reset.title')}</h2>
                  <p className="text-muted mt-1 mb-4 text-center text-md-start">{t('auth.reset.subtitle')}</p>
                  {step === 'request' && (
                    <form className="authentication-form" onSubmit={submitRequest}>
                      <TextFormInput
                        control={requestControl}
                        name="email"
                        containerClassName="mb-3"
                        label={t('auth.fields.email')}
                        id="email-id"
                        placeholder={t('auth.placeholders.email')}
                      />
                      <div className="mb-1 text-center d-grid">
                        <Button variant="primary" type="submit" disabled={loading}>
                          {loading ? t('auth.reset.requestLoading') : t('auth.reset.requestSubmit')}
                        </Button>
                      </div>
                    </form>
                  )}
                  {step === 'reset' && (
                    <form className="authentication-form" onSubmit={submitReset}>
                      <TextFormInput
                        control={resetControl}
                        name="otp"
                        containerClassName="mb-3"
                        label={t('auth.reset.fields.code')}
                        id="otp"
                        placeholder={t('auth.reset.placeholders.code')}
                      />
                      <TextFormInput
                        control={resetControl}
                        name="remember_token"
                        containerClassName="mb-3"
                        label={t('auth.reset.fields.token')}
                        id="remember_token"
                        placeholder={t('auth.reset.placeholders.token')}
                      />
                      <PasswordFormInput
                        control={resetControl}
                        name="password"
                        containerClassName="mb-3"
                        placeholder={t('auth.reset.placeholders.password')}
                        id="new-password"
                        label={t('auth.reset.fields.password')}
                      />
                      <PasswordFormInput
                        control={resetControl}
                        name="re_password"
                        containerClassName="mb-3"
                        placeholder={t('auth.reset.placeholders.confirmPassword')}
                        id="confirm-password"
                        label={t('auth.reset.fields.confirmPassword')}
                      />
                      <div className="d-grid gap-2">
                        <Button variant="primary" type="submit" disabled={loading}>
                          {loading ? t('auth.reset.resetLoading') : t('auth.reset.resetSubmit')}
                        </Button>
                        <Button variant="outline-secondary" type="button" onClick={() => setStep('request')} disabled={loading}>
                          {t('auth.reset.back')}
                        </Button>
                      </div>
                    </form>
                  )}
                  {step === 'done' && (
                    <div className="text-center">
                      <h4 className="fw-semibold mb-3">{t('auth.reset.doneTitle')}</h4>
                      <p className="text-muted">{t('auth.reset.doneSubtitle')}</p>
                      <div className="d-grid gap-2">
                        <Button variant="primary" onClick={goToSignIn}>
                          {t('auth.reset.goToSignIn')}
                        </Button>
                      </div>
                    </div>
                  )}
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

export default ResetPassword
