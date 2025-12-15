import { useForm } from 'react-hook-form'
import TextFormInput from '@/components/form/TextFormInput'
import { Button, FormCheck } from 'react-bootstrap'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../../../context/useAuthContext'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const LoginFrom = () => {
  const { t } = useTranslation()
  const { control, handleSubmit } = useForm()
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, loading, error: authError } = useAuthContext()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const onSubmit = async (data) => {
    setError(null)
    try {
      await login(data.email, data.password)
      setTimeout(() => navigate('/dashboard'), 100)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || t('auth.signIn.loginFailed'))
    }
  }

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      {(error || authError) && (
        <div 
          role="alert" 
          className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3"
          style={{ borderRadius: '12px' }}
        >
          <IconifyIcon icon="solar:danger-triangle-bold-duotone" className="fs-20" />
          <span>{error || authError}</span>
        </div>
      )}

      <div className="mb-4">
        <TextFormInput
          control={control}
          name="email"
          vlaue={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          containerClassName="mb-0"
          label={
            <label className="form-label d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:letter-bold-duotone" className="text-primary" />
              {t('auth.fields.email')}
            </label>
          }
          id="email-id"
          placeholder={t('auth.placeholders.email')}
        />
      </div>

      <div className="mb-4">
        <PasswordFormInput
          control={control}
          name="password"
          containerClassName="mb-0"
          placeholder={t('auth.placeholders.password')}
          id="password-id"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          label={
            <label className="form-label d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:lock-password-bold-duotone" className="text-primary" />
              {t('auth.fields.password')}
            </label>
          }
        />
      </div>

      <div className="mb-4 d-flex justify-content-between align-items-center">
        <FormCheck 
          label={t('auth.signIn.rememberMe')} 
          id="sign-in"
          className="d-flex align-items-center"
        />
        <Link 
          to="/auth/reset-pass" 
          className="text-primary text-decoration-none small fw-semibold"
        >
          {t('auth.signIn.resetPasswordLink')}
        </Link>
      </div>

      <div className="mb-0">
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading}
          className="w-100 d-flex align-items-center justify-content-center gap-2"
          size="lg"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {t('auth.signIn.loading') || 'Signing in...'}
            </>
          ) : (
            <>
              <IconifyIcon icon="solar:login-3-bold-duotone" />
              {t('auth.signIn.submit')}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default LoginFrom
