import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Badge } from 'react-bootstrap'

const StatusOverview = ({ stats, loading }) => {
  const statusCards = [
    {
      title: 'Active Entities',
      value: stats.activeRiders + stats.activeDrivers + stats.availableCranes + stats.activeAdmins,
      total: stats.totalRiders + stats.totalDrivers + stats.totalCranes + stats.totalAdmins,
      icon: 'solar:check-circle-bold-duotone',
      color: 'success',
    },
    {
      title: 'Inactive Entities',
      value:
        stats.totalRiders -
        stats.activeRiders +
        (stats.totalDrivers - stats.activeDrivers) +
        (stats.totalCranes - stats.availableCranes) +
        (stats.totalAdmins - stats.activeAdmins),
      total: stats.totalRiders + stats.totalDrivers + stats.totalCranes + stats.totalAdmins,
      icon: 'solar:close-circle-bold-duotone',
      color: 'danger',
    },
    {
      title: 'Total Riders',
      value: stats.totalRiders,
      active: stats.activeRiders,
      icon: 'solar:user-bold-duotone',
      color: 'primary',
    },
    {
      title: 'Total Drivers',
      value: stats.totalDrivers,
      active: stats.activeDrivers,
      icon: 'solar:steering-wheel-bold-duotone',
      color: 'info',
    },
    {
      title: 'Total Cranes',
      value: stats.totalCranes,
      active: stats.availableCranes,
      icon: 'solar:truck-bold-duotone',
      color: 'warning',
    },
    {
      title: 'Total Admins',
      value: stats.totalAdmins,
      active: stats.activeAdmins,
      icon: 'solar:shield-user-bold-duotone',
      color: 'danger',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h4'} className="mb-0">
          Status Overview
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row className="g-3">
          {statusCards.map((card, idx) => {
            const percentage = card.total > 0 ? Math.round((card.value / card.total) * 100) : 0
            return (
              <Col md={6} lg={4} key={idx}>
                <div className="border rounded p-3 h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className={`avatar-sm rounded bg-${card.color}-subtle d-flex align-items-center justify-content-center`}>
                        <IconifyIcon icon={card.icon} className={`text-${card.color}`} />
                      </div>
                      <div>
                        <h6 className="mb-0">{card.title}</h6>
                        {card.active !== undefined && (
                          <small className="text-muted">Active: {card.active}</small>
                        )}
                      </div>
                    </div>
                    <Badge bg={card.color} className="fs-6">
                      {card.value}
                    </Badge>
                  </div>
                  {card.total > 0 && (
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className={`progress-bar bg-${card.color}`}
                        role="progressbar"
                        style={{ width: `${percentage}%` }}
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  )}
                </div>
              </Col>
            )
          })}
        </Row>
      </CardBody>
    </Card>
  )
}

export default StatusOverview



