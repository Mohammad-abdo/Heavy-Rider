import { Card, CardBody, Row, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useTranslation } from 'react-i18next'
import { Badge } from 'react-bootstrap'

const QuickInsights = ({ stats, settings, loading }) => {
  const { t } = useTranslation()

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0'
    return Number(num).toLocaleString()
  }

  const insights = [
    {
      icon: 'solar:users-group-two-rounded-bold-duotone',
      label: t('Total Users'),
      value: formatNumber(stats.totalRiders + stats.totalDrivers),
      color: 'primary',
      trend: '+12%',
    },
    {
      icon: 'solar:truck-bold-duotone',
      label: t('Available Cranes'),
      value: formatNumber(stats.availableCranes),
      color: 'success',
      trend: '+5%',
    },
    {
      icon: 'solar:wallet-money-bold-duotone',
      label: t('Min Fare'),
      value: settings?.minimum_fare_to_ride ? `${formatNumber(settings.minimum_fare_to_ride)} EGP` : '—',
      color: 'info',
      trend: null,
    },
    {
      icon: 'solar:chart-bold-duotone',
      label: t('Profit Rate'),
      value: settings?.profit_value
        ? `${settings.profit_value}${settings.profit_type === 'percentage' ? '%' : ' EGP'}`
        : '—',
      color: 'warning',
      trend: null,
    },
  ]

  if (loading) {
    return (
      <Card className="animated-card">
        <CardBody>
          <div className="placeholder-glow">
            <div className="placeholder col-12" style={{ height: '200px' }}></div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="animated-card hover-lift">
      <CardBody>
        <Row className="g-3">
          {insights.map((insight, index) => (
            <Col xs={6} md={3} key={index}>
              <div className="text-center p-3 border rounded-3 h-100">
                <div className={`avatar-lg bg-soft-${insight.color} rounded-circle flex-centered mx-auto mb-2`}>
                  <IconifyIcon icon={insight.icon} className={`fs-28 text-${insight.color}`} />
                </div>
                <h4 className="mb-1 fw-bold">{insight.value}</h4>
                <p className="text-muted small mb-1">{insight.label}</p>
                {insight.trend && (
                  <Badge bg={insight.color} className="mt-1">
                    {insight.trend}
                  </Badge>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  )
}

export default QuickInsights

