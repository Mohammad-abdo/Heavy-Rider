import { Card, CardBody, CardHeader, CardTitle, Col, Row, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useTranslation } from 'react-i18next'

const CraneTypeBreakdown = ({ stats, loading }) => {
  const { t } = useTranslation()

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0'
    return Number(num).toLocaleString()
  }

  const craneTypes = [
    {
      key: 'lightTruck',
      label: t('Light Truck'),
      icon: 'solar:truck-bold-duotone',
      color: 'primary',
    },
    {
      key: 'refrigrated',
      label: t('Refrigerated'),
      icon: 'solar:refrigerator-bold-duotone',
      color: 'info',
    },
    {
      key: 'largeFreight',
      label: t('Large Freight'),
      icon: 'solar:delivery-bold-duotone',
      color: 'success',
    },
    {
      key: 'tankerTruck',
      label: t('Tanker Truck'),
      icon: 'solar:fuel-bold-duotone',
      color: 'warning',
    },
  ]

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="placeholder-glow">
            <div className="placeholder col-12" style={{ height: '200px' }}></div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h5'} className="mb-0">
          {t('Crane Types Breakdown')}
        </CardTitle>
        <p className="text-muted mb-0">{t('Distribution by vehicle type')}</p>
      </CardHeader>
      <CardBody>
        <Row className="g-3">
          {craneTypes.map((type) => {
            const typeData = stats?.craneTypes?.[type.key] || { total: 0, available: 0 }
            const availabilityRate = typeData.total > 0 
              ? Math.round((typeData.available / typeData.total) * 100) 
              : 0

            return (
              <Col md={6} key={type.key}>
                <div className="border rounded-3 p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <IconifyIcon icon={type.icon} className={`text-${type.color} fs-20`} />
                      <span className="fw-semibold">{type.label}</span>
                    </div>
                    <Badge bg={availabilityRate >= 50 ? 'success' : availabilityRate >= 25 ? 'warning' : 'danger'}>
                      {availabilityRate}%
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between text-muted small">
                    <span>
                      {t('Total')}: <strong className="text-dark">{formatNumber(typeData.total)}</strong>
                    </span>
                    <span>
                      {t('Available')}: <strong className="text-dark">{formatNumber(typeData.available)}</strong>
                    </span>
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

export default CraneTypeBreakdown

