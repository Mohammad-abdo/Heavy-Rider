import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const QuickStatCard = ({ amount, icon, iconColor, title }) => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col>
            <div className={`avatar-md bg-${iconColor} rounded flex-centered`}>
              <IconifyIcon icon={icon} width={24} height={24} className="fs-24 text-white" />
            </div>
          </Col>
          <Col className="text-end">
            <p className="text-muted mb-0 text-truncate">{title}</p>
            <h3 className="text-dark mt-1 mb-0">{amount}</h3>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

const QuickStats = ({ stats, loading }) => {
  const { t } = useTranslation()
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0'
    return Number(num).toLocaleString()
  }

  const quickStatsData = [
    {
      icon: 'solar:user-check-rounded-bold-duotone',
      iconColor: 'primary',
      title: t('Active Riders'),
      amount: formatNumber(stats.activeRiders),
    },
    {
      icon: 'solar:steering-wheel-bold-duotone',
      iconColor: 'success',
      title: t('Active Drivers'),
      amount: formatNumber(stats.activeDrivers),
    },
    {
      icon: 'solar:truck-bold-duotone',
      iconColor: 'info',
      title: t('Available Cranes'),
      amount: formatNumber(stats.availableCranes),
    },
    {
      icon: 'solar:shield-check-bold-duotone',
      iconColor: 'warning',
      title: t('Active Admins'),
      amount: formatNumber(stats.activeAdmins),
    },
  ]

  if (loading) {
    return (
      <Row>
        {[1, 2, 3, 4].map((idx) => (
          <Col md={6} xl={3} key={idx}>
            <Card>
              <CardBody>
                <div className="placeholder-glow">
                  <div className="placeholder col-12" style={{ height: '100px' }}></div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <Row>
      {quickStatsData.map((item, idx) => (
        <Col md={6} xl={3} key={idx}>
          <QuickStatCard {...item} />
        </Col>
      ))}
    </Row>
  )
}

export default QuickStats



