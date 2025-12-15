import { Card, CardBody, CardHeader, CardTitle, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const SettingsInfo = ({ settings, loading }) => {
  const { t } = useTranslation()

  const formatCurrency = (value) => {
    if (!value) return '—'
    return `${Number(value).toLocaleString()} ${t('EGP')}`
  }

  const formatPercentage = (value) => {
    if (!value) return '—'
    return `${value}%`
  }

  if (loading || !settings) {
    return (
      <Card>
        <CardBody>
          <div className="placeholder-glow">
            <div className="placeholder col-12" style={{ height: '150px' }}></div>
          </div>
        </CardBody>
      </Card>
    )
  }

  const minimumFare = settings.minimum_fare_to_ride || settings.minimum_fare || '—'
  const profitType = settings.profit_type || 'percentage'
  const profitValue = settings.profit_value || '—'

  return (
    <Card>
      <CardHeader className="d-flex align-items-center justify-content-between">
        <div>
          <CardTitle as={'h5'} className="mb-0">
            {t('Application Settings')}
          </CardTitle>
          <p className="text-muted mb-0">{t('Current system configuration')}</p>
        </div>
        <Link to="/settings" className="text-primary">
          <IconifyIcon icon="solar:settings-bold-duotone" className="fs-20" />
        </Link>
      </CardHeader>
      <CardBody>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
            <div className="d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:wallet-money-bold-duotone" className="text-primary" />
              <span className="text-muted">{t('Minimum Fare')}</span>
            </div>
            <strong className="text-dark">{formatCurrency(minimumFare)}</strong>
          </div>
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
            <div className="d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:chart-bold-duotone" className="text-success" />
              <span className="text-muted">{t('Profit Type')}</span>
            </div>
            <Badge bg={profitType === 'percentage' ? 'info' : 'warning'}>
              {profitType === 'percentage' ? t('Percentage') : t('Fixed')}
            </Badge>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <IconifyIcon icon="solar:percent-bold-duotone" className="text-info" />
              <span className="text-muted">{t('Profit Value')}</span>
            </div>
            <strong className="text-dark">
              {profitType === 'percentage' ? formatPercentage(profitValue) : formatCurrency(profitValue)}
            </strong>
          </div>
        </div>
        <div className="mt-3 pt-3 border-top">
          <Link to="/settings" className="text-primary text-decoration-none small">
            {t('Edit Settings')} <IconifyIcon icon="bx:right-arrow-alt" />
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

export default SettingsInfo

