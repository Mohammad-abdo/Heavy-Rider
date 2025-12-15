import { Card, CardBody, CardHeader, CardTitle, Row, Col, ProgressBar } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useTranslation } from 'react-i18next'

const PerformanceMetrics = ({ stats, loading }) => {
  const { t } = useTranslation()

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0'
    return Number(num).toLocaleString()
  }

  const calculatePercentage = (active, total) => {
    if (!total || total === 0) return 0
    return Math.round((active / total) * 100)
  }

  const getVariant = (percentage) => {
    if (percentage >= 80) return 'success'
    if (percentage >= 50) return 'info'
    if (percentage >= 30) return 'warning'
    return 'danger'
  }

  const metrics = [
    {
      label: t('Riders Activity'),
      active: stats.activeRiders,
      total: stats.totalRiders,
      icon: 'solar:user-bold-duotone',
      color: 'primary',
    },
    {
      label: t('Drivers Activity'),
      active: stats.activeDrivers,
      total: stats.totalDrivers,
      icon: 'solar:steering-wheel-bold-duotone',
      color: 'success',
    },
    {
      label: t('Cranes Availability'),
      active: stats.availableCranes,
      total: stats.totalCranes,
      icon: 'solar:truck-bold-duotone',
      color: 'info',
    },
    {
      label: t('Admins Activity'),
      active: stats.activeAdmins,
      total: stats.totalAdmins,
      icon: 'solar:shield-user-bold-duotone',
      color: 'warning',
    },
  ]

  if (loading) {
    return (
      <Card className="animated-card">
        <CardBody>
          <div className="placeholder-glow">
            <div className="placeholder col-12" style={{ height: '300px' }}></div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="animated-card hover-lift">
      <CardHeader>
        <CardTitle as={'h5'} className="mb-0">
          {t('Performance Metrics')}
        </CardTitle>
        <p className="text-muted mb-0 small">{t('System performance indicators')}</p>
      </CardHeader>
      <CardBody>
        <Row className="g-4">
          {metrics.map((metric, index) => {
            const percentage = calculatePercentage(metric.active, metric.total)
            return (
              <Col xs={12} sm={6} key={index}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className={`avatar-md bg-soft-${metric.color} rounded flex-centered`}>
                    <IconifyIcon icon={metric.icon} className={`fs-24 text-${metric.color}`} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-muted small">{metric.label}</span>
                      <span className={`fw-semibold text-${getVariant(percentage)}`}>{percentage}%</span>
                    </div>
                    <ProgressBar
                      now={percentage}
                      variant={getVariant(percentage)}
                      className="progress-sm"
                      style={{ height: '8px' }}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <span className="text-muted small">
                        {formatNumber(metric.active)} / {formatNumber(metric.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      </CardBody>
    </Card>
  )
}

export default PerformanceMetrics

