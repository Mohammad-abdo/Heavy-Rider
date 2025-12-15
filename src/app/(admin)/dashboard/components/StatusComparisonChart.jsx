import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const StatusComparisonChart = ({ stats, loading }) => {
  const { t } = useTranslation()

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
      stacked: false,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => Math.round(val),
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    xaxis: {
      categories: [t('Riders'), t('Drivers'), t('Cranes'), t('Admins')],
      labels: {
        style: {
          colors: '#6b7280',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6b7280',
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'light',
    },
  }

  const series = [
    {
      name: t('Total'),
      data: [stats.totalRiders, stats.totalDrivers, stats.totalCranes, stats.totalAdmins],
    },
    {
      name: t('Active'),
      data: [stats.activeRiders, stats.activeDrivers, stats.availableCranes, stats.activeAdmins],
    },
  ]

  if (loading) {
    return (
      <Card className="animated-card">
        <CardBody>
          <div className="placeholder-glow">
            <div className="placeholder col-12" style={{ height: '350px' }}></div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="animated-card hover-lift">
      <CardHeader>
        <CardTitle as={'h5'} className="mb-0">
          {t('Status Comparison')}
        </CardTitle>
        <p className="text-muted mb-0 small">{t('Total vs Active entities')}</p>
      </CardHeader>
      <CardBody>
        <div dir="ltr">
          <ReactApexChart options={chartOptions} series={series} type="bar" height={350} className="apex-charts" />
        </div>
      </CardBody>
    </Card>
  )
}

export default StatusComparisonChart

