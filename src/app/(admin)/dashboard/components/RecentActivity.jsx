import { Card, CardBody, CardHeader, CardTitle, Table, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useTranslation } from 'react-i18next'

const RecentActivity = ({ stats, loading }) => {
  const { t } = useTranslation()
  const activities = [
    {
      type: t('Riders'),
      action: t('New Registration'),
      count: stats.activeRiders,
      icon: 'solar:user-bold-duotone',
      color: 'primary',
    },
    {
      type: t('Drivers'),
      action: t('Active Drivers'),
      count: stats.activeDrivers,
      icon: 'solar:steering-wheel-bold-duotone',
      color: 'info',
    },
    {
      type: t('Cranes'),
      action: t('Available'),
      count: stats.availableCranes,
      icon: 'solar:truck-bold-duotone',
      color: 'warning',
    },
    {
      type: t('Admins'),
      action: t('Active'),
      count: stats.activeAdmins,
      icon: 'solar:shield-user-bold-duotone',
      color: 'danger',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h4'} className="mb-0">
          {t('Recent Activity')}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table hover responsive className="mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th>{t('Type')}</th>
                <th>{t('Action')}</th>
                <th>{t('Count')}</th>
                <th>{t('Status')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    {t('Loading...')}
                  </td>
                </tr>
              ) : (
                activities.map((activity, idx) => (
                  <tr key={idx}>
                    <td>
                      <IconifyIcon icon={activity.icon} className={`text-${activity.color} me-2`} />
                      {activity.type}
                    </td>
                    <td>{activity.action}</td>
                    <td className="fw-semibold">{activity.count}</td>
                    <td>
                      <Badge bg={activity.count > 0 ? 'success' : 'secondary'}>
                        {activity.count > 0 ? t('Active') : t('Inactive')}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

export default RecentActivity



