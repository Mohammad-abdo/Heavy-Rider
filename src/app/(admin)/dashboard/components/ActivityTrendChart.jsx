import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ActivityTrendChart = ({ stats, loading }) => {
  const { t } = useTranslation()

  // Generate sample data for the last 7 days (in real app, this would come from API)
  const generateDates = () => {
    const dates = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    }
    return dates
  }

  const dates = generateDates()

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    xaxis: {
      categories: dates,
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

  // Simulate activity data (in real app, fetch from API)
  const series = [
    {
      name: t('Riders'),
      data: [stats.totalRiders * 0.7, stats.totalRiders * 0.8, stats.totalRiders * 0.75, stats.totalRiders * 0.9, stats.totalRiders * 0.85, stats.totalRiders, stats.totalRiders],
    },
    {
      name: t('Drivers'),
      data: [stats.totalDrivers * 0.6, stats.totalDrivers * 0.7, stats.totalDrivers * 0.65, stats.totalDrivers * 0.8, stats.totalDrivers * 0.75, stats.totalDrivers, stats.totalDrivers],
    },
    {
      name: t('Cranes'),
      data: [stats.totalCranes * 0.8, stats.totalCranes * 0.85, stats.totalCranes * 0.9, stats.totalCranes * 0.95, stats.totalCranes, stats.totalCranes, stats.totalCranes],
    },
    {
      name: t('Admins'),
      data: [stats.totalAdmins * 0.9, stats.totalAdmins * 0.95, stats.totalAdmins, stats.totalAdmins, stats.totalAdmins, stats.totalAdmins, stats.totalAdmins],
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
          {t('Activity Trends')}
        </CardTitle>
        <p className="text-muted mb-0 small">{t('Last 7 days activity overview')}</p>
      </CardHeader>
      <CardBody>
        <div dir="ltr">
          <ReactApexChart options={chartOptions} series={series} type="area" height={350} className="apex-charts" />
        </div>
      </CardBody>
    </Card>
  )
}

export default ActivityTrendChart

