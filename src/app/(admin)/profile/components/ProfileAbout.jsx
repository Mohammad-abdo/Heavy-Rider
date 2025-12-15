import { useEffect, useMemo, useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { authAPI } from '@/api/api';
import { useNotificationContext } from '@/context/useNotificationContext';
import TextFormInput from '@/components/form/TextFormInput';
import PasswordFormInput from '@/components/form/PasswordFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
const buildProfileSchema = (t) =>
  yup.object({
    name: yup.string().trim().required(t('profile.about.validation.nameRequired')),
    phone_number: yup.string().trim().nullable(),
    image: yup.mixed().nullable(),
  });
const buildPasswordSchema = (t) =>
  yup.object({
    password: yup.string().min(6, t('profile.about.validation.passwordMin')).required(t('profile.about.validation.passwordRequired')),
    re_password: yup
      .string()
      .oneOf([yup.ref('password')], t('profile.about.validation.passwordsMismatch'))
      .required(t('profile.about.validation.confirmPasswordRequired')),
  });
const ProfileAbout = ({ profile, loading, onRefresh }) => {
  const { t } = useTranslation();
  const { showNotification } = useNotificationContext();
  const [sending, setSending] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const profileSchema = useMemo(() => buildProfileSchema(t), [t]);
  const passwordSchema = useMemo(() => buildPasswordSchema(t), [t]);
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    clearErrors: clearProfileErrors,
    setError: setProfileFormError,
    formState: { errors: profileErrors }
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      phone_number: '',
      image: null
    }
  });
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    clearErrors: clearPasswordErrors,
    setError: setPasswordFormError,
    formState: { errors: passwordErrors }
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      password: '',
      re_password: ''
    }
  });
  useEffect(() => {
    resetProfileForm({
      name: profile?.name || profile?.full_name || profile?.username || '',
      phone_number: profile?.phone_number || profile?.phone || profile?.mobile || '',
      image: null
    });
  }, [profile, resetProfileForm]);
  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };
  const shorten = (value) => {
    if (!value) return '—';
    const text = String(value);
    if (text.length <= 28) return text;
    return `${text.slice(0, 14)}…${text.slice(-8)}`;
  };
  const sendVerification = async () => {
    setSending(true);
    try {
      await authAPI.sendVerificationCode();
      showNotification({ variant: 'success', message: t('profile.about.verificationSent') });
    } catch (error) {
      const message = error?.response?.data?.message || t('profile.about.verificationFailed');
      showNotification({ variant: 'danger', message });
    } finally {
      setSending(false);
    }
  };
  const onSubmitProfile = handleProfileSubmit(async (values) => {
    clearProfileErrors('root');
    setProfileSaving(true);
    try {
      const payload = {
        name: values.name
      };
      if (values.phone_number) {
        payload.phone_number = values.phone_number;
      }
      if (values.image instanceof File) {
        payload.image = values.image;
      }
      await authAPI.updateProfile(payload);
      showNotification({ variant: 'success', message: t('profile.about.profileUpdated') });
      resetProfileForm({
        name: values.name,
        phone_number: values.phone_number ?? '',
        image: null
      });
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || t('profile.about.profileUpdateFailed');
      setProfileFormError('root', { type: 'manual', message });
      showNotification({ variant: 'danger', message });
    } finally {
      setProfileSaving(false);
    }
  });
  const onSubmitPassword = handlePasswordSubmit(async (values) => {
    clearPasswordErrors('root');
    setPasswordSaving(true);
    try {
      await authAPI.updateProfile({ password: values.password, re_password: values.re_password });
      showNotification({ variant: 'success', message: t('profile.about.passwordUpdated') });
      resetPasswordForm({ password: '', re_password: '' });
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || t('profile.about.passwordUpdateFailed');
      setPasswordFormError('root', { type: 'manual', message });
      showNotification({ variant: 'danger', message });
    } finally {
      setPasswordSaving(false);
    }
  });
  const userId = profile?.id ?? profile?.uuid ?? profile?.user_id ?? '—';
  const email = profile?.email || profile?.user_email || '—';
  const phone = profile?.phone_number || profile?.phone || profile?.mobile || '—';
  const accountTypeValue = profile?.type || profile?.role || profile?.user_role || profile?.userType;
  const accountType = accountTypeValue ? accountTypeValue.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Unknown';
  const locationDetails = [
    { label: 'profile.about.locationFields.latitude', value: profile?.latitude ?? profile?.lat ?? '—' },
    { label: 'profile.about.locationFields.longitude', value: profile?.longitude ?? profile?.lng ?? '—' },
    { label: 'profile.about.locationFields.city', value: profile?.city ?? profile?.address_city ?? '—' },
    { label: 'profile.about.locationFields.country', value: profile?.country ?? profile?.address_country ?? '—' }
  ];
  const tokenDetails = [
    { label: 'profile.about.tokens.playerId', value: profile?.player_id ?? profile?.onesignal_player_id },
    { label: 'profile.about.tokens.fcmToken', value: profile?.fcm_token ?? profile?.push_token }
  ];
  const metadataDetails = [
    { label: 'profile.about.metadata.userId', value: userId },
    { label: 'profile.about.metadata.accountType', value: accountType },
    { label: 'profile.about.metadata.email', value: email },
    { label: 'profile.about.metadata.phone', value: phone },
    { label: 'profile.about.metadata.updatedAt', value: formatDate(profile?.updated_at ?? profile?.updatedAt) },
    { label: 'profile.about.metadata.lastLogin', value: formatDate(profile?.last_login_at ?? profile?.last_login) }
  ];
  return <Row className="g-4 mt-1">
      <Col xl={8} lg={7}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <CardTitle as={'h4'} className="mb-0">{t('profile.about.accountDetails')}</CardTitle>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" size="sm" onClick={onRefresh} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <IconifyIcon icon="solar:refresh-bold" className="me-2" />}
                {t('profile.about.reload')}
              </Button>
              <Button variant="primary" size="sm" onClick={sendVerification} disabled={sending}>
                {sending ? <Spinner animation="border" size="sm" className="me-2" /> : <IconifyIcon icon="solar:letter-line-duotone" className="me-2" />}
                {t('profile.about.sendVerification')}
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <Row className="g-3">
              {metadataDetails.map((item) => (
                <Col sm={6} key={item.label}>
                  <div className="border rounded-3 p-3 h-100">
                    <p className="mb-1 text-muted">{item.label}</p>
                    <p className="mb-0 fw-semibold text-dark">{item.value || '—'}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">{t('profile.about.location')}</CardTitle>
          </CardHeader>
          <CardBody>
            <Row className="g-3">
              {locationDetails.map((item) => (
                <Col sm={6} key={item.label}>
                  <div className="border rounded-3 p-3 h-100">
                    <p className="mb-1 text-muted">{item.label}</p>
                    <p className="mb-0 fw-semibold text-dark">{item.value || '—'}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col xl={4} lg={5}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">{t('profile.about.editProfile')}</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={onSubmitProfile}>
              {profileErrors?.root?.message && <div className="text-danger mb-3">{profileErrors.root.message}</div>}
              <TextFormInput control={profileControl} name="name" containerClassName="mb-3" label="Full Name" placeholder="Enter your name" />
              <TextFormInput control={profileControl} name="phone_number" containerClassName="mb-3" label="Phone Number" placeholder="Enter your phone number" />
              <Controller
                control={profileControl}
                name="image"
                render={({ field, fieldState }) => (
                  <Form.Group className="mb-4">
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={(event) => field.onChange(event.target.files?.[0] ?? null)} isInvalid={!!fieldState.error} />
                    <Form.Control.Feedback type="invalid">{fieldState.error?.message}</Form.Control.Feedback>
                  </Form.Group>
                )}
              />
              <Button type="submit" variant="primary" className="w-100" disabled={profileSaving || loading}>
                {profileSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardBody>
        </Card>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">{t('profile.about.changePassword')}</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={onSubmitPassword}>
              {passwordErrors?.root?.message && <div className="text-danger mb-3">{passwordErrors.root.message}</div>}
              <PasswordFormInput control={passwordControl} name="password" containerClassName="mb-3" label="New Password" placeholder="Enter new password" />
              <PasswordFormInput control={passwordControl} name="re_password" containerClassName="mb-4" label="Confirm Password" placeholder="Confirm new password" />
              <Button type="submit" variant="primary" className="w-100" disabled={passwordSaving}>
                {passwordSaving ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">{t('profile.about.notificationTokens')}</CardTitle>
          </CardHeader>
          <CardBody>
            {tokenDetails.map((item) => (
              <div key={item.label} className="border rounded-3 p-3 mb-3">
                <p className="mb-1 text-muted">{item.label}</p>
                <p className="mb-0 fw-semibold text-dark" title={item.value || '—'}>{shorten(item.value)}</p>
              </div>
            ))}
            {!tokenDetails.some((item) => item.value) && <p className="text-muted mb-0">No push tokens are linked to this account.</p>}
          </CardBody>
        </Card>
      </Col>
    </Row>;
};
export default ProfileAbout;
