import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Spinner } from 'react-bootstrap'

const formatNumber = (value) => {
  if (value === undefined || value === null) return '—'
  const number = Number(value)
  if (Number.isNaN(number) || !Number.isFinite(number)) return String(value)
  return number.toLocaleString()
}

const Stats = ({ summary, loading, onRefresh }) => {
  const cards = useMemo(() => {
    return [
      {
        key: 'wallet',
        label: 'Wallet Balance',
        icon: 'solar:wallet-money-bold-duotone',
        value: summary?.walletBalanceDisplay ?? '—',
        accent: 'primary'
      },
      {
        key: 'total-rides',
        label: 'Total Rides',
        icon: 'solar:steering-wheel-bold-duotone',
        value: summary?.totalRidesDisplay ?? '—',
        accent: 'success'
      },
      {
        key: 'completed-rides',
        label: 'Completed Rides',
        icon: 'solar:check-circle-bold-duotone',
        value: summary?.completedRidesDisplay ?? '—',
        accent: 'info'
      },
      {
        key: 'active-rides',
        label: 'Active Rides',
        icon: 'solar:clock-circle-bold-duotone',
        value: summary?.activeRidesDisplay ?? '—',
        accent: 'warning'
      }
    ]
  }, [summary])

  const chartLabels = summary?.statusChart?.labels?.length ? summary.statusChart.labels : ['Completed', 'In Progress', 'Accepted', 'Pending', 'Cancelled']
  const chartData = summary?.statusChart?.data?.length === chartLabels.length ? summary.statusChart.data : new Array(chartLabels.length).fill(0)

  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: 'bar',
        height: 320,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          borderRadius: 6
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: chartLabels,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => formatNumber(value)
        }
      },
      grid: {
        strokeDashArray: 3,
        padding: {
          left: 8,
          right: 8
        }
      },
      colors: ['#2563eb'],
      tooltip: {
        y: {
          formatter: (value) => formatNumber(value)
        }
      }
    }
  }, [chartLabels])

  const chartSeries = useMemo(() => {
    return [{
      name: 'Rides',
      data: chartData
    }]
  }, [chartData])

  return (
    <>
      <Col xxl={4} xl={5} className="d-flex flex-column gap-3">
        {cards.map((card) => (
          <Card key={card.key} className="flex-fill">
            <CardBody>
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div className={`avatar-md rounded bg-${card.accent}-subtle d-flex align-items-center justify-content-center`}>
                  <IconifyIcon icon={card.icon} className={`fs-24 text-${card.accent}`} />
                </div>
                <div className="text-end">
                  <p className="mb-1 text-muted">{card.label}</p>
                  <h4 className="mb-0 text-dark">{card.value}</h4>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </Col>
      <Col xxl={8} xl={7}>
        <Card className="h-100">
          <CardHeader className="d-flex align-items-center justify-content-between gap-2">
            <div>
              <CardTitle as={'h4'} className="mb-0">Ride Status Overview</CardTitle>
              <p className="mb-0 text-muted">Completion rate {summary?.completionRate ?? 0}% • {summary?.uniqueCranesDisplay ?? '0'} cranes utilized</p>
            </div>
            <Button variant="outline-primary" size="sm" onClick={onRefresh} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <IconifyIcon icon="solar:refresh-bold" className="me-2" />}Refresh
            </Button>
          </CardHeader>
          <CardBody>
            <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
              <Badge bg="success" className="fw-normal">Completed {summary?.completedRidesDisplay ?? '0'}</Badge>
              <Badge bg="warning" className="text-dark fw-normal">Active {summary?.activeRidesDisplay ?? '0'}</Badge>
              <Badge bg="danger" className="fw-normal">Cancelled {summary?.cancelledRidesDisplay ?? '0'}</Badge>
              <Badge bg="info" className="text-dark fw-normal">Avg Fare {summary?.averageFareDisplay ?? '0.00'}</Badge>
            </div>
            <div dir="ltr">
              <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={320} className="apex-charts" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

export default Stats
