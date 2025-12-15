import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const StatCard = ({ stat }) => {
  const { amount, change, changeColor, badgeIcon, icon, iconColor, title } = stat

  return (
    <Card>
      <CardBody className="overflow-hidden position-relative">
        <IconifyIcon icon={icon} className={`fs-36 text-${iconColor}`} />
        <h3 className="mb-0 fw-bold mt-3 mb-1">{amount}</h3>
        <p className="text-muted">{title}</p>
        <span className={`badge fs-12 badge-soft-${changeColor}`}>
          {changeColor === 'success' ? (
            <IconifyIcon icon="bx:chevrons-up" />
          ) : (
            <IconifyIcon icon="bx:chevrons-down" />
          )}
          {change}%
        </span>
        {badgeIcon && <IconifyIcon icon={badgeIcon} className="widget-icon" />}
      </CardBody>
    </Card>
  )
}

const ModernStats = ({ stats, profile, loading }) => {
  const { t } = useTranslation()
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0'
    return Number(num).toLocaleString()
  }

  const calculateChange = (active, total) => {
    if (!total || total === 0) return 0
    return Math.round((active / total) * 100)
  }

  const stateData = [
    {
      icon: 'solar:wallet-money-bold-duotone',
      iconColor: 'primary',
      amount: `$${formatNumber(profile?.wallet_balance ?? 0)}`,
      title: t('Wallet Balance'),
      change: '0',
      changeColor: 'success',
      badgeIcon: 'bx:doughnut-chart',
    },
    {
      icon: 'solar:users-group-two-rounded-bold-duotone',
      iconColor: 'success',
      amount: formatNumber(stats.totalRiders + stats.totalDrivers),
      title: t('Total Users'),
      change: calculateChange(stats.activeRiders + stats.activeDrivers, stats.totalRiders + stats.totalDrivers),
      changeColor: 'success',
      badgeIcon: 'bx:bar-chart-alt-2',
    },
    {
      icon: 'solar:truck-bold-duotone',
      iconColor: 'info',
      amount: formatNumber(stats.totalCranes),
      title: t('Total Cranes'),
      change: calculateChange(stats.availableCranes, stats.totalCranes),
      changeColor: stats.availableCranes > 0 ? 'success' : 'danger',
      badgeIcon: 'bx:building-house',
    },
    {
      icon: 'solar:check-circle-bold-duotone',
      iconColor: 'warning',
      amount: formatNumber(stats.activeRiders + stats.activeDrivers + stats.availableCranes + stats.activeAdmins),
      title: t('Active Entities'),
      change: calculateChange(
        stats.activeRiders + stats.activeDrivers + stats.availableCranes + stats.activeAdmins,
        stats.totalRiders + stats.totalDrivers + stats.totalCranes + stats.totalAdmins
      ),
      changeColor: 'success',
      badgeIcon: 'bx:bowl-hot',
    },
    {
      icon: 'solar:shield-user-bold-duotone',
      iconColor: 'danger',
      amount: formatNumber(stats.totalAdmins),
      title: t('Total Admins'),
      change: calculateChange(stats.activeAdmins, stats.totalAdmins),
      changeColor: 'success',
      badgeIcon: 'bx:cricket-ball',
    },
  ]

  if (loading) {
    return (
      <Row>
        {[1, 2, 3, 4, 5].map((idx) => (
          <Col lg={4} md={6} className="col-xl" key={idx}>
            <Card>
              <CardBody>
                <div className="placeholder-glow">
                  <div className="placeholder col-12" style={{ height: '120px' }}></div>
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
      {stateData.map((stat, idx) => (
        <Col lg={4} md={6} className="col-xl" key={idx}>
          <StatCard stat={stat} />
        </Col>
      ))}
    </Row>
  )
}

export default ModernStats



