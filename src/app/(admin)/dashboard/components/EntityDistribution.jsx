import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const EntityDistribution = ({ stats, loading }) => {
  const { t } = useTranslation()
  const chartOptions = {
    chart: {
      type: 'donut',
      height: 350,
    },
    labels: [t('Riders'), t('Drivers'), t('Cranes'), t('Admins')],
    colors: ['#3b82f6', '#06b6d4', '#f59e0b', '#ef4444'],
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Math.round(val)}%`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: t('Total'),
              formatter: () => {
                const total = stats.totalRiders + stats.totalDrivers + stats.totalCranes + stats.totalAdmins
                return total.toString()
              },
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  }

  const chartSeries = [
    stats.totalRiders,
    stats.totalDrivers,
    stats.totalCranes,
    stats.totalAdmins,
  ]

  const total = chartSeries.reduce((sum, val) => sum + val, 0)

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle as={'h4'} className="mb-0">
            {t('Entity Distribution')}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="text-center py-4 text-muted">{t('No data available')}</div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h4'} className="mb-0">
          {t('Entity Distribution')}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <div dir="ltr">
          <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={350} className="apex-charts" />
        </div>
      </CardBody>
    </Card>
  )
}

export default EntityDistribution



