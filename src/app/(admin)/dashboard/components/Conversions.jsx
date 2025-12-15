import ReactApexChart from 'react-apexcharts'
import { Badge, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const formatStatusLabel = (value, t) => {
  if (!value) return t('Unknown')
  return String(value)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const parseDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const formatDate = (value) => {
  const date = parseDate(value)
  if (!date) return '—'
  return dateFormatter.format(date)
}

const Conversions = ({ stats, loading }) => {
  const { t } = useTranslation()
  const totalEntities = stats.totalRiders + stats.totalDrivers + stats.totalCranes + stats.totalAdmins
  const activeEntities = stats.activeRiders + stats.activeDrivers + stats.availableCranes + stats.activeAdmins
  const completionRate = totalEntities > 0 ? Math.round((activeEntities / totalEntities) * 100) : 0
  const normalizedRate = Math.max(0, Math.min(100, completionRate))
  const radialOptions = {
    chart: {
      height: 280,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        track: {
          background: 'rgba(15, 23, 42, 0.08)',
        },
        hollow: {
          size: '60%',
        },
        dataLabels: {
          name: {
            fontSize: '14px',
            color: '#6b7280',
            offsetY: 80,
          },
          value: {
            offsetY: 30,
            fontSize: '26px',
            color: '#0f172a',
            formatter: (val) => `${Math.round(val)}%`,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    colors: ['#0ea5e9'],
    labels: [t('Completion')],
  }

  const systemMetrics = [
    {
      label: t('Total Entities'),
      value: totalEntities.toLocaleString(),
    },
    {
      label: t('Active Entities'),
      value: `${activeEntities.toLocaleString()} (${completionRate}%)`,
    },
    {
      label: t('Riders'),
      value: `${stats.activeRiders}/${stats.totalRiders}`,
    },
    {
      label: t('Drivers'),
      value: `${stats.activeDrivers}/${stats.totalDrivers}`,
    },
    {
      label: t('Cranes'),
      value: `${stats.availableCranes}/${stats.totalCranes}`,
    },
    {
      label: t('Admins'),
      value: `${stats.activeAdmins}/${stats.totalAdmins}`,
    },
  ]

  return (
    <>
      <Col lg={4}>
        <Card className="h-100">
          <CardBody className="text-center d-flex flex-column justify-content-between">
            <div>
              <CardTitle as={'h5'} className="mb-2">
                {t('System Activity Rate')}
              </CardTitle>
              <p className="text-muted mb-3">{t('Active entities across the system')}</p>
            </div>
            <ReactApexChart options={radialOptions} series={[normalizedRate]} type="radialBar" height={280} className="apex-charts" />
            <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
              <Badge bg="success" className="fw-normal">
                {t('Active {{count}}', { count: activeEntities })}
              </Badge>
              <Badge bg="secondary" className="fw-normal">
                {t('Total {{count}}', { count: totalEntities })}
              </Badge>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={4}>
        <Card className="h-100">
          <CardHeader>
            <CardTitle as={'h5'} className="mb-0">
              {t('System Overview')}
            </CardTitle>
            <p className="text-muted mb-0">{t('Entity statistics and activity')}</p>
          </CardHeader>
          <CardBody>
            <Row className="g-3">
              {systemMetrics.map((metric) => (
                <Col xs={12} key={metric.label}>
                  <div className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2">
                    <span className="text-muted">{metric.label}</span>
                    <strong className="text-dark">{metric.value}</strong>
                  </div>
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
      </Col>
      {/* <Col lg={4}>
        <Card className="h-100">
          <CardHeader>
            <CardTitle as={'h5'} className="mb-0">Upcoming Rides</CardTitle>
            <p className="text-muted mb-0">Next {upcomingRides?.length ?? 0} assignments</p>
          </CardHeader>
          <CardBody className="p-0">
            <div className="table-responsive">
              <table className="table table-sm table-hover mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th className="ps-3">{t('Ride')}</th>
                    <th>{t('Status')}</th>
                    <th>{t('Start')}</th>
                    <th>{t('Fare')}</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingRides?.length ? (
                    upcomingRides.map((ride, idx) => (
                      <tr key={ride?.id ?? idx}>
                        <td className="ps-3">#{ride?.id ?? '—'}</td>
                        <td>{formatStatusLabel(ride?.status, t)}</td>
                        <td>{formatDate(ride?.starts_at || ride?.start_time || ride?.scheduled_at)}</td>
                        <td>{ride?.fare ?? ride?.amount ?? '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        {loading ? t('Loading rides…') : t('No upcoming rides to display.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col> */}
    </>
  )
}

export default Conversions
