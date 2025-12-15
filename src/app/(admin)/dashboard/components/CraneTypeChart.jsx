import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const CraneTypeChart = ({ stats, loading }) => {
  const { t } = useTranslation()

  const chartOptions = {
    chart: {
      type: 'radialBar',
      height: 350,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '16px',
            color: '#6b7280',
          },
          value: {
            fontSize: '24px',
            fontWeight: 600,
            color: '#1f2937',
            formatter: (val) => `${Math.round(val)}`,
          },
        },
      },
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    labels: [t('Light Truck'), t('Refrigerated'), t('Large Freight'), t('Tanker Truck')],
    legend: {
      show: true,
      position: 'bottom',
    },
  }

  const calculatePercentage = (available, total) => {
    if (!total || total === 0) return 0
    return (available / total) * 100
  }

  const series = [
    calculatePercentage(stats.craneTypes?.lightTruck?.available || 0, stats.craneTypes?.lightTruck?.total || 1),
    calculatePercentage(stats.craneTypes?.refrigrated?.available || 0, stats.craneTypes?.refrigrated?.total || 1),
    calculatePercentage(stats.craneTypes?.largeFreight?.available || 0, stats.craneTypes?.largeFreight?.total || 1),
    calculatePercentage(stats.craneTypes?.tankerTruck?.available || 0, stats.craneTypes?.tankerTruck?.total || 1),
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
          {t('Crane Type Availability')}
        </CardTitle>
        <p className="text-muted mb-0 small">{t('Availability percentage by type')}</p>
      </CardHeader>
      <CardBody>
        <div dir="ltr">
          <ReactApexChart options={chartOptions} series={series} type="radialBar" height={350} className="apex-charts" />
        </div>
      </CardBody>
    </Card>
  )
}

export default CraneTypeChart

