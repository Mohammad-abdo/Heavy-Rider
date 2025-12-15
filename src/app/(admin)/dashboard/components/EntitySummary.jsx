import IconifyIcon from '@/components/wrappers/IconifyIcon'
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient'
import { Card, CardBody, CardTitle, ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const EntitySummary = ({ stats, loading }) => {
  const { t } = useTranslation()
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0'
    return Number(num).toLocaleString()
  }

  const calculateProgress = (active, total) => {
    if (!total || total === 0) return 0
    return Math.round((active / total) * 100)
  }

  const getVariant = (progress) => {
    if (progress >= 70) return 'success'
    if (progress >= 40) return 'info'
    if (progress >= 20) return 'warning'
    return 'danger'
  }

  const entityData = [
    {
      name: t('Riders'),
      total: stats.totalRiders,
      active: stats.activeRiders,
      icon: 'solar:user-bold-duotone',
      link: '/heavy-ride/rides',
      color: 'primary',
    },
    {
      name: t('Drivers'),
      total: stats.totalDrivers,
      active: stats.activeDrivers,
      icon: 'solar:steering-wheel-bold-duotone',
      link: '/heavy-ride/drivers',
      color: 'success',
    },
    {
      name: t('Cranes'),
      total: stats.totalCranes,
      active: stats.availableCranes,
      icon: 'solar:truck-bold-duotone',
      link: '/heavy-ride/cranes',
      color: 'info',
    },
    {
      name: t('Admins'),
      total: stats.totalAdmins,
      active: stats.activeAdmins,
      icon: 'solar:shield-user-bold-duotone',
      link: '/admins',
      color: 'warning',
    },
  ]

  if (loading) {
    return (
      <Card>
        <CardBody>
          <div className="placeholder-glow">
            <div className="placeholder col-12" style={{ height: '300px' }}></div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody className="p-0">
        <div className="pt-3 px-3">
          <div className="float-end">
            <Link to="/heavy-ride" className="text-primary icons-center">
              {t('View All')}
              <IconifyIcon icon="bx:export" className="ms-1" />
            </Link>
          </div>
          <CardTitle as={'h5'} className="mb-3">
            {t('Entity Summary')}
          </CardTitle>
        </div>
        <SimplebarReactClient className="mb-3" style={{ maxHeight: 324 }}>
          <div className="table-responsive table-centered table-nowrap px-3">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>{t('Entity')}</th>
                  <th>{t('Total')}</th>
                  <th>{t('Active')}</th>
                  <th>{t('Activity Rate')}</th>
                </tr>
              </thead>
              <tbody>
                {entityData.map((item, idx) => {
                  const progress = calculateProgress(item.active, item.total)
                  return (
                    <tr key={idx}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <IconifyIcon icon={item.icon} className={`text-${item.color}`} />
                          <Link to={item.link} className="text-reset">
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td className="fw-semibold">{formatNumber(item.total)}</td>
                      <td className="fw-semibold">{formatNumber(item.active)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <ProgressBar
                            now={progress}
                            variant={getVariant(progress)}
                            className="progress-sm"
                            style={{ width: '100px' }}
                          />
                          <span className="text-muted">{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </SimplebarReactClient>
      </CardBody>
    </Card>
  )
}

export default EntitySummary



