import avatar1 from '@/assets/images/users/avatar-1.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
const ProfileMain = ({ profile, loading, onRefresh }) => {
  const { t } = useTranslation();
  const displayName = profile?.name || profile?.full_name || profile?.username || '—';
  const accountTypeValue = profile?.type || profile?.role || profile?.user_role || profile?.userType;
  const accountType = accountTypeValue ? accountTypeValue.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : t('profile.main.unknown');
  const email = profile?.email || profile?.user_email || '—';
  const phone = profile?.phone_number || profile?.phone || profile?.mobile || '—';
  const image = profile?.image_url || profile?.image || profile?.avatar || avatar1;
  const createdAtValue = profile?.created_at || profile?.createdAt || profile?.joined_at;
  const dateFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const createdAt = (() => {
    if (!createdAtValue) return '—';
    const date = new Date(createdAtValue);
    if (Number.isNaN(date.getTime())) return createdAtValue;
    return dateFormatter.format(date);
  })();
  const numericDisplay = (value) => {
    if (value === undefined || value === null || value === '') return '—';
    const number = Number(value);
    if (Number.isNaN(number) || !Number.isFinite(number)) return String(value);
    return number.toLocaleString();
  };
  const walletBalance = numericDisplay(profile?.wallet_balance ?? profile?.wallet ?? profile?.balance ?? 0);
  const completedRides = numericDisplay(profile?.completed_rides ?? profile?.rides_completed ?? profile?.rides_count);
  const pendingRides = numericDisplay(profile?.pending_rides ?? profile?.rides_pending ?? profile?.active_rides);
  const isVerified = Boolean(profile?.email_verified_at || profile?.is_verified || profile?.verified || profile?.email_verified);
  const primaryCrane = Array.isArray(profile?.cranes) ? profile?.cranes[0] : profile?.primary_crane || profile?.crane;
  const primaryCraneLabel = primaryCrane
    ? [primaryCrane?.type, primaryCrane?.license_plate || primaryCrane?.plate || primaryCrane?.identifier]
        .filter(Boolean)
        .join(' • ')
    : '—';
  return <Row className="g-4">
      <Col xl={9} lg={8}>
        <Card>
          <CardBody>
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <img src={image} alt={displayName} className="avatar-xl rounded-circle border border-light border-3" />
                <div>
                  <h4 className="mb-1 d-flex align-items-center gap-2">
                    {displayName}
                    {isVerified && <Badge bg="success" className="fw-normal">{t('profile.main.verified')}</Badge>}
                  </h4>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <Badge bg="primary" className="fw-normal">{accountType}</Badge>
                    <span className="text-muted">
                      {createdAt !== '—' ? t('profile.main.joinedAt', { date: createdAt }) : t('profile.main.joinDateUnavailable')}
                    </span>
                  </div>
                  <div className="mt-2 text-muted">
                    <div className="d-flex align-items-center gap-2">
                      <IconifyIcon icon="solar:letter-bold-duotone" className="text-primary" />
                      <span>{email}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <IconifyIcon icon="solar:phone-calling-rounded-bold-duotone" className="text-primary" />
                      <span>{phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-start align-items-md-end gap-2">
                <div className="text-start text-md-end">
                  <p className="mb-1 text-muted">{t('profile.main.primaryCrane')}</p>
                  <p className="mb-0 fw-semibold text-dark">{primaryCraneLabel}</p>
                </div>
                <Button variant="outline-primary" size="sm" onClick={onRefresh} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <IconifyIcon icon="solar:refresh-bold" className="me-2" />}
                  {t('profile.main.refresh')}
                </Button>
              </div>
            </div>
            <Row className="mt-4 g-3">
              <Col md={4} sm={6}>
                <Card className="bg-body-tertiary border-0">
                  <CardBody>
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-md rounded bg-primary-subtle d-flex align-items-center justify-content-center">
                        <IconifyIcon icon="solar:wallet-money-bold-duotone" className="fs-24 text-primary" />
                      </div>
                      <div>
                        <p className="mb-1 text-muted">{t('profile.main.walletBalance')}</p>
                        <h5 className="mb-0 text-dark">{walletBalance}</h5>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={4} sm={6}>
                <Card className="bg-body-tertiary border-0">
                  <CardBody>
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-md rounded bg-success-subtle d-flex align-items-center justify-content-center">
                        <IconifyIcon icon="solar:steering-wheel-bold-duotone" className="fs-24 text-success" />
                      </div>
                      <div>
                        <p className="mb-1 text-muted">{t('profile.main.completedRides')}</p>
                        <h5 className="mb-0 text-dark">{completedRides}</h5>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={4} sm={6}>
                <Card className="bg-body-tertiary border-0">
                  <CardBody>
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-md rounded bg-warning-subtle d-flex align-items-center justify-content-center">
                        <IconifyIcon icon="solar:calendar-bold-duotone" className="fs-24 text-warning" />
                      </div>
                      <div>
                        <p className="mb-1 text-muted">{t('profile.main.activeRides')}</p>
                        <h5 className="mb-0 text-dark">{pendingRides}</h5>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col xl={3} lg={4}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'} className="mb-0">{t('profile.main.accountStatus')}</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className={`avatar-md rounded d-flex align-items-center justify-content-center ${isVerified ? 'bg-success-subtle' : 'bg-warning-subtle'}`}>
                <IconifyIcon icon={isVerified ? 'solar:shield-check-bold-duotone' : 'solar:danger-triangle-bold-duotone'} className={`fs-26 ${isVerified ? 'text-success' : 'text-warning'}`} />
              </div>
              <div>
                <p className="mb-1 text-muted">{t('profile.main.emailVerification')}</p>
                <h5 className="mb-0 text-dark">{isVerified ? t('profile.main.verified') : t('profile.main.pending')}</h5>
              </div>
            </div>
            <div className="border rounded-3 p-3">
              <p className="mb-1 text-muted">{t('profile.main.accountType')}</p>
              <p className="mb-0 fw-semibold text-dark">{accountType}</p>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>;
};
export default ProfileMain;