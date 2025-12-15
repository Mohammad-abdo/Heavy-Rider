import PasswordFormInput from '@/components/form/PasswordFormInput'
import SelectFormInput from '@/components/form/SelectFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import { authAPI } from '@/api/api'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo, useState } from 'react'
import { Button, Form, FormCheck } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'

const accountTypeOptions = [
  { value: 'user', labelKey: 'auth.signUp.types.rider' },
  { value: 'driver', labelKey: 'auth.signUp.types.driver' },
]

const buildSignUpSchema = (t) =>
  yup.object({
    name: yup.string().trim().required(t('auth.validation.nameRequired')),
    email: yup.string().email(t('auth.validation.emailInvalid')).required(t('auth.validation.emailRequired')),
    phone_number: yup.string().trim().required(t('auth.validation.phoneRequired')),
    type: yup.string().oneOf(['driver', 'user']).required(t('auth.validation.accountTypeRequired')),
    password: yup
      .string()
      .min(6, t('auth.validation.passwordMin'))
      .required(t('auth.validation.passwordRequired')),
    re_password: yup
      .string()
      .oneOf([yup.ref('password')], t('auth.validation.passwordsMismatch'))
      .required(t('auth.validation.confirmPasswordRequired')),
    image: yup.mixed().nullable(),
    terms: yup.boolean().oneOf([true], t('auth.validation.termsRequired')),
  })

const SignUpForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register: registerAccount } = useAuthContext()
  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false)
  const signUpSchema = useMemo(() => buildSignUpSchema(t), [t])
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      type: 'user',
      password: '',
      re_password: '',
      image: null,
      terms: false
    }
  })

  const translatedAccountTypeOptions = useMemo(
    () =>
      accountTypeOptions.map((opt) => ({
        ...opt,
        label: t(opt.labelKey),
      })),
    [t],
  )

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true)
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        re_password: values.re_password,
        type: values.type,
        phone_number: values.phone_number,
        image: values.image instanceof File ? values.image : null
      }
      await registerAccount(payload)
      await authAPI.sendVerificationCode()
      showNotification({ variant: 'success', message: t('auth.signUp.success') })
      reset({
        name: '',
        email: values.email,
        phone_number: values.phone_number,
        type: values.type,
        password: '',
        re_password: '',
        image: null,
        terms: false
      })
      navigate('/auth/verify-code', { state: { email: values.email } })
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || t('auth.signUp.failed')
      setError('root', { type: 'manual', message })
      showNotification({ variant: 'danger', message })
    } finally {
      setLoading(false)
    }
  })

  return (
    <form className="authentication-form" onSubmit={onSubmit}>
      {errors?.root?.message && (
        <div className="text-danger mb-3" role="alert">
          {errors.root.message}
        </div>
      )}
      <TextFormInput
        control={control}
        name="name"
        containerClassName="mb-3"
        label={t('auth.fields.name')}
        id="name"
        placeholder={t('auth.placeholders.name')}
      />
      <TextFormInput
        control={control}
        name="email"
        containerClassName="mb-3"
        label={t('auth.fields.email')}
        id="email-id"
        placeholder={t('auth.placeholders.email')}
      />
      <TextFormInput
        control={control}
        name="phone_number"
        containerClassName="mb-3"
        label={t('auth.fields.phone')}
        id="phone_number"
        placeholder={t('auth.placeholders.phone')}
      />
      <SelectFormInput
        control={control}
        name="type"
        label={t('auth.signUp.accountType')}
        containerClassName="mb-3"
        options={translatedAccountTypeOptions}
      />
      <PasswordFormInput
        control={control}
        name="password"
        containerClassName="mb-3"
        placeholder={t('auth.placeholders.password')}
        id="password-id"
        label={t('auth.fields.password')}
      />
      <PasswordFormInput
        control={control}
        name="re_password"
        containerClassName="mb-3"
        placeholder={t('auth.placeholders.confirmPassword')}
        id="confirm-password-id"
        label={t('auth.fields.confirmPassword')}
      />
      <Controller
        control={control}
        name="image"
        render={({ field, fieldState }) => (
          <Form.Group className="mb-3">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(event) => field.onChange(event.target.files?.[0] ?? null)}
              isInvalid={!!fieldState.error}
            />
            <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
          </Form.Group>
        )}
      />
      <Controller
        control={control}
        name="terms"
        render={({ field, fieldState }) => (
          <FormCheck
            id="termAndCondition2"
            className="mb-3"
            checked={field.value}
            onChange={(event) => field.onChange(event.target.checked)}
              label={t('auth.signUp.terms')}
            isInvalid={!!fieldState.error}
            feedback={fieldState.error?.message}
          />
        )}
      />
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? t('auth.signUp.loading') : t('auth.signUp.submit')}
        </Button>
      </div>
    </form>
  )
}

export default SignUpForm
