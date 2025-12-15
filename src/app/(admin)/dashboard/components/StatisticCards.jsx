import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const StatisticCard = ({ amount, change, icon, name, variant, link }) => {
  const { t } = useTranslation()
  return (
    <Card className="overflow-hidden">
      <CardBody>
        <Row>
          <Col xs={6}>
            <div className={`avatar-md bg-soft-${variant} rounded flex-centered`}>
              <IconifyIcon width={32} height={32} icon={icon} className={`fs-32 text-${variant}`} />
            </div>
          </Col>
          <Col xs={6} className="text-end">
            <p className="text-muted mb-0 text-truncate">{name}</p>
            <h3 className="text-dark mt-1 mb-0">{amount}</h3>
          </Col>
        </Row>
      </CardBody>
      <CardFooter className="py-2 bg-light bg-opacity-50">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className={`text-${variant} icons-center`}>
              {variant === 'danger' ? (
                <IconifyIcon icon="bxs:down-arrow" className="fs-12" />
              ) : (
                <IconifyIcon icon="bxs:up-arrow" className="fs-12" />
              )}
              &nbsp;{change}%
            </span>
            <span className="text-muted ms-1 fs-12">{t('Active Rate')}</span>
          </div>
          {link && (
            <Link to={link} className="text-reset fw-semibold fs-12">
              {t('View More')}
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

const StatisticCards = ({ stats, loading }) => {
  const { t } = useTranslation()
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0'
    return Number(num).toLocaleString()
  }

  const calculateActiveRate = (active, total) => {
    if (!total || total === 0) return 0
    return Math.round((active / total) * 100)
  }

  const statisticData = [
    {
      icon: 'solar:user-bold-duotone',
      name: t('Total Riders'),
      amount: formatNumber(stats.totalRiders),
      variant: 'primary',
      change: calculateActiveRate(stats.activeRiders, stats.totalRiders),
      link: '/heavy-ride/rides',
    },
    {
      icon: 'solar:steering-wheel-bold-duotone',
      name: t('Total Drivers'),
      amount: formatNumber(stats.totalDrivers),
      variant: 'success',
      change: calculateActiveRate(stats.activeDrivers, stats.totalDrivers),
      link: '/heavy-ride/drivers',
    },
    {
      icon: 'solar:truck-bold-duotone',
      name: t('Total Cranes'),
      amount: formatNumber(stats.totalCranes),
      variant: 'info',
      change: calculateActiveRate(stats.availableCranes, stats.totalCranes),
      link: '/heavy-ride/cranes',
    },
    {
      icon: 'solar:shield-user-bold-duotone',
      name: t('Total Admins'),
      amount: formatNumber(stats.totalAdmins),
      variant: 'warning',
      change: calculateActiveRate(stats.activeAdmins, stats.totalAdmins),
      link: '/admins',
    },
  ]

  if (loading) {
    return (
      <Row>
        {[1, 2, 3, 4].map((idx) => (
          <Col md={3} key={idx}>
            <Card className="overflow-hidden">
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
      {statisticData.map((item, idx) => (
        <Col md={6} xl={3} key={idx}>
          <StatisticCard {...item} />
        </Col>
      ))}
    </Row>
  )
}

export default StatisticCards



