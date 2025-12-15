import { useCallback, useEffect, useState } from 'react'
import { Col, Row, Button, Spinner, Container } from 'react-bootstrap'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useTranslation } from 'react-i18next'
import StatisticCards from './components/StatisticCards'
import QuickInsights from './components/QuickInsights'
import ActivityTrendChart from './components/ActivityTrendChart'
import StatusComparisonChart from './components/StatusComparisonChart'
import CraneTypeChart from './components/CraneTypeChart'
import PerformanceMetrics from './components/PerformanceMetrics'
import EntityDistribution from './components/EntityDistribution'
import RecentActivity from './components/RecentActivity'
import SettingsInfo from './components/SettingsInfo'
import DashboardDataTables from './components/DashboardDataTables'
import { dashboardAPI, getAllRiders, getAllDrivers, getAllCranse, getAllAdmins, getSettings } from '@/api/api'

const DashboardPage = () => {
  const { t } = useTranslation()
  const { user: sessionUser, profileData } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(sessionUser || null)
  const [settings, setSettings] = useState(null)
  const [stats, setStats] = useState({
    totalRiders: 0,
    activeRiders: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    totalCranes: 0,
    availableCranes: 0,
    totalAdmins: 0,
    activeAdmins: 0,
    craneTypes: {
      lightTruck: { total: 0, available: 0 },
      refrigrated: { total: 0, available: 0 },
      largeFreight: { total: 0, available: 0 },
      tankerTruck: { total: 0, available: 0 },
    },
  })

  useEffect(() => {
    if (sessionUser) {
      setProfile(sessionUser)
    }
  }, [sessionUser])

  const extractData = (response) => {
    if (!response) return []
    if (Array.isArray(response)) return response
    if (response?.data) {
      if (Array.isArray(response.data)) return response.data
      if (response.data?.data && Array.isArray(response.data.data)) return response.data.data
      if (response.data?.items && Array.isArray(response.data.items)) return response.data.items
    }
    return []
  }

  const isActive = (status) => {
    if (!status) return false
    const normalized = String(status).toLowerCase().trim()
    return normalized === 'active'
  }

  const isAvailable = (crane) => {
    if (!crane) return false
    const status = String(crane.status || '').toLowerCase().trim()
    const isOnline = crane.is_online === 1 || crane.is_online === true || crane.is_online === '1'
    return status === 'available' || isOnline || (status !== 'in_progress' && status !== 'in-progress')
  }

  const calculateStats = (riders, drivers, cranes, admins) => {
    const craneTypes = {
      lightTruck: { total: 0, available: 0 },
      refrigrated: { total: 0, available: 0 },
      largeFreight: { total: 0, available: 0 },
      tankerTruck: { total: 0, available: 0 },
    }

    cranes.forEach((crane) => {
      const type = String(crane.type || '').toLowerCase().trim()
      const available = isAvailable(crane)

      if (type === 'light-truck') {
        craneTypes.lightTruck.total++
        if (available) craneTypes.lightTruck.available++
      } else if (type === 'refrigrated') {
        craneTypes.refrigrated.total++
        if (available) craneTypes.refrigrated.available++
      } else if (type === 'large-freight') {
        craneTypes.largeFreight.total++
        if (available) craneTypes.largeFreight.available++
      } else if (type === 'tanker-truck') {
        craneTypes.tankerTruck.total++
        if (available) craneTypes.tankerTruck.available++
      }
    })

    return {
      totalRiders: riders.length,
      activeRiders: riders.filter((r) => isActive(r.status)).length,
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter((d) => isActive(d.status)).length,
      totalCranes: cranes.length,
      availableCranes: cranes.filter(isAvailable).length,
      totalAdmins: admins.length,
      activeAdmins: admins.filter((a) => isActive(a.status)).length,
      craneTypes,
    }
  }

  const loadDashboard = useCallback(async () => {
    if (loading) return
    
    setLoading(true)
    const startTime = Date.now()
    try {
      const result = await profileData()
      if (result) {
        setProfile(result)
      }

      try {
        const [ridersRes, driversRes, cranesRes, adminsRes, settingsRes] = await Promise.all([
          dashboardAPI.getRidersStats().catch(() => ({ data: { data: [] } })),
          dashboardAPI.getDriversStats().catch(() => ({ data: { data: [] } })),
          dashboardAPI.getCranesStats().catch(() => ({ data: { data: [] } })),
          dashboardAPI.getAdminsStats().catch(() => ({ data: { data: [] } })),
          getSettings().catch(() => null),
        ])

        const riders = extractData(ridersRes?.data)
        const drivers = extractData(driversRes?.data)
        const cranes = extractData(cranesRes?.data)
        const admins = extractData(adminsRes?.data)

        setStats(calculateStats(riders, drivers, cranes, admins))

        if (settingsRes) {
          const settingsData = settingsRes?.data || settingsRes
          if (Array.isArray(settingsData)) {
            const settingsObj = {}
            settingsData.forEach((item) => {
              if (item.setting_key && item.setting_value !== undefined) {
                settingsObj[item.setting_key] = item.setting_value
              }
            })
            setSettings(settingsObj)
          } else if (typeof settingsData === 'object') {
            setSettings(settingsData)
          }
        }
      } catch (error) {
        console.error('Failed to load statistics:', error)
        try {
          const [ridersRes, driversRes, cranesRes, adminsRes, settingsRes] = await Promise.all([
            getAllRiders().catch(() => []),
            getAllDrivers().catch(() => []),
            getAllCranse().catch(() => []),
            getAllAdmins().catch(() => []),
            getSettings().catch(() => null),
          ])

          const riders = extractData(ridersRes)
          const drivers = extractData(driversRes)
          const cranes = extractData(cranesRes)
          const admins = extractData(adminsRes)

          setStats(calculateStats(riders, drivers, cranes, admins))

          if (settingsRes) {
            const settingsData = settingsRes?.data || settingsRes
            if (Array.isArray(settingsData)) {
              const settingsObj = {}
              settingsData.forEach((item) => {
                if (item.setting_key && item.setting_value !== undefined) {
                  settingsObj[item.setting_key] = item.setting_value
                }
              })
              setSettings(settingsObj)
            } else if (typeof settingsData === 'object') {
              setSettings(settingsData)
            }
          }
        } catch (fallbackError) {
          console.error('Fallback API calls also failed:', fallbackError)
        }
      }
    } catch (error) {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
        const message = error?.response?.data?.message || t('Failed to load dashboard')
        showNotification({ variant: 'danger', message })
      }
    } finally {
      const elapsed = Date.now() - startTime
      if (elapsed < 300) {
        await new Promise((resolve) => setTimeout(resolve, 300 - elapsed))
      }
      setLoading(false)
    }
  }, [loading, profileData, showNotification, t])

  useEffect(() => {
    loadDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container fluid className="py-4">
      <div className="d-flex flex-column gap-4">
        {/* Modern Header Section */}
        <div className="d-flex justify-content-between align-items-center animated-fade-in">
          <div>
            <h3 className="mb-1 fw-bold">{t('Dashboard Overview')}</h3>
            <p className="text-muted mb-0">
              {t('Welcome back')}, <span className="fw-semibold text-primary">{profile?.name || t('Admin')}</span>
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={loadDashboard}
            disabled={loading}
            className="d-flex align-items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" />
                {t('Loading...')}
              </>
            ) : (
              <>
                <IconifyIcon icon="solar:refresh-bold" />
                {t('Refresh Data')}
              </>
            )}
          </Button>
        </div>

        {/* Quick Insights Cards */}
        <QuickInsights stats={stats} settings={settings} loading={loading} />

        {/* Main Statistics Cards */}
        <StatisticCards stats={stats} loading={loading} />

        {/* Charts Row 1 - Activity Trends & Status Comparison */}
        <Row className="g-4">
          <Col xl={8}>
            <ActivityTrendChart stats={stats} loading={loading} />
          </Col>
          <Col xl={4}>
            <StatusComparisonChart stats={stats} loading={loading} />
          </Col>
        </Row>

        {/* Charts Row 2 - Entity Distribution & Crane Type Chart */}
        <Row className="g-4">
          <Col xl={6}>
            <EntityDistribution stats={stats} loading={loading} />
          </Col>
          <Col xl={6}>
            <CraneTypeChart stats={stats} loading={loading} />
          </Col>
        </Row>

        {/* Performance Metrics & Sidebar */}
        <Row className="g-4">
          <Col xl={8}>
            <PerformanceMetrics stats={stats} loading={loading} />
          </Col>
          <Col xl={4}>
            <Row className="g-4">
              <Col xl={12}>
                <RecentActivity stats={stats} loading={loading} />
              </Col>
              <Col xl={12}>
                <SettingsInfo settings={settings} loading={loading} />
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Data Tables Section */}
        <Row className="g-4 mt-2">
          <Col xl={12}>
            <DashboardDataTables />
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default DashboardPage
