import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Badge, Card, CardBody, CardHeader, CardTitle, Table } from 'react-bootstrap'

const Orders = ({ stats, loading }) => {
  const statsData = [
    { label: 'Total Riders', value: stats.totalRiders, icon: 'solar:user-bold-duotone', color: 'primary' },
    { label: 'Active Riders', value: stats.activeRiders, icon: 'solar:user-check-rounded-bold-duotone', color: 'success' },
    { label: 'Total Drivers', value: stats.totalDrivers, icon: 'solar:steering-wheel-bold-duotone', color: 'info' },
    { label: 'Active Drivers', value: stats.activeDrivers, icon: 'solar:steering-wheel-rounded-bold-duotone', color: 'success' },
    { label: 'Total Cranes', value: stats.totalCranes, icon: 'solar:truck-bold-duotone', color: 'warning' },
    { label: 'Available Cranes', value: stats.availableCranes, icon: 'solar:truck-check-bold-duotone', color: 'success' },
    { label: 'Total Admins', value: stats.totalAdmins, icon: 'solar:shield-user-bold-duotone', color: 'danger' },
    { label: 'Active Admins', value: stats.activeAdmins, icon: 'solar:shield-check-bold-duotone', color: 'success' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h4'} className="mb-0">
          System Statistics
        </CardTitle>
        <p className="text-muted mb-0">Overview of all system entities</p>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table hover responsive className="mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th>Entity</th>
                <th>Total</th>
                <th>Active</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    Loading statistics...
                  </td>
                </tr>
              ) : (
                <>
                  <tr>
                    <td>
                      <IconifyIcon icon="solar:user-bold-duotone" className="text-primary me-2" />
                      Riders
                    </td>
                    <td className="fw-semibold">{stats.totalRiders}</td>
                    <td>
                      <Badge bg="success">{stats.activeRiders}</Badge>
                    </td>
                    <td>
                      <Badge bg={stats.activeRiders > 0 ? 'success' : 'secondary'}>
                        {stats.totalRiders > 0 ? `${Math.round((stats.activeRiders / stats.totalRiders) * 100)}%` : '0%'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <IconifyIcon icon="solar:steering-wheel-bold-duotone" className="text-info me-2" />
                      Drivers
                    </td>
                    <td className="fw-semibold">{stats.totalDrivers}</td>
                    <td>
                      <Badge bg="success">{stats.activeDrivers}</Badge>
                    </td>
                    <td>
                      <Badge bg={stats.activeDrivers > 0 ? 'success' : 'secondary'}>
                        {stats.totalDrivers > 0 ? `${Math.round((stats.activeDrivers / stats.totalDrivers) * 100)}%` : '0%'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <IconifyIcon icon="solar:truck-bold-duotone" className="text-warning me-2" />
                      Cranes
                    </td>
                    <td className="fw-semibold">{stats.totalCranes}</td>
                    <td>
                      <Badge bg="success">{stats.availableCranes}</Badge>
                    </td>
                    <td>
                      <Badge bg={stats.availableCranes > 0 ? 'success' : 'secondary'}>
                        {stats.totalCranes > 0 ? `${Math.round((stats.availableCranes / stats.totalCranes) * 100)}%` : '0%'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <IconifyIcon icon="solar:shield-user-bold-duotone" className="text-danger me-2" />
                      Admins
                    </td>
                    <td className="fw-semibold">{stats.totalAdmins}</td>
                    <td>
                      <Badge bg="success">{stats.activeAdmins}</Badge>
                    </td>
                    <td>
                      <Badge bg={stats.activeAdmins > 0 ? 'success' : 'secondary'}>
                        {stats.totalAdmins > 0 ? `${Math.round((stats.activeAdmins / stats.totalAdmins) * 100)}%` : '0%'}
                      </Badge>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

export default Orders
